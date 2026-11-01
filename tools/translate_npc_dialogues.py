#!/usr/bin/env python3
"""Translate NPC String.wz dialogue fields from English to Spanish.

The translator is resumable: completed strings are cached in SQLite and the
source XML is only replaced after every translation succeeds and XML parses.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import html
import json
import re
import shutil
import sqlite3
import threading
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


STRING_RE = re.compile(r'(<string\s+name="([^"]+)"\s+value=")([^"]*)("\s*/>)')
PROTECTED_RE = re.compile(
    r"(#(?:[A-Za-z]\d+|[A-Za-z]{2,}|\d+)#|#[A-Za-z]|%[A-Za-z0-9_]+%|\$\{[^}]+\}|\\.|&(?:#[0-9]+|#x[0-9A-Fa-f]+|[A-Za-z]+);)"
)
SKIP_FIELDS = {"name"}
ENDPOINT = "https://clients5.google.com/translate_a/t"


def protect(text: str) -> tuple[str, dict[str, str]]:
    replacements: dict[str, str] = {}

    def replace(match: re.Match[str]) -> str:
        key = f"\ue000{len(replacements)}\ue001"
        replacements[key] = match.group(0)
        return key

    return PROTECTED_RE.sub(replace, text), replacements


def restore(text: str, replacements: dict[str, str]) -> str:
    for key, value in replacements.items():
        if key not in text:
            raise ValueError(f"Protected marker was altered by translation: {value!r}")
        text = text.replace(key, value)
    return text


def request_plain_translation(source: str, attempts: int = 6) -> str:
    if not source.strip() or not re.search(r"[A-Za-z\u00c0-\uffff]", source):
        return source
    if len(source) > 700:
        chunks: list[str] = []
        remaining = source
        while len(remaining) > 700:
            split_at = max(remaining.rfind(" ", 0, 700), remaining.rfind("\\n", 0, 700))
            if split_at < 300:
                split_at = 700
            else:
                split_at += 1
            chunks.append(remaining[:split_at])
            remaining = remaining[split_at:]
        if remaining:
            chunks.append(remaining)
        return "".join(request_plain_translation(chunk, attempts) for chunk in chunks)

    query = urllib.parse.urlencode(
        {"client": "dict-chrome-ex", "sl": "auto", "tl": "es", "q": source}
    )
    request = urllib.request.Request(
        f"{ENDPOINT}?{query}", headers={"User-Agent": "Mozilla/5.0"}
    )
    error: Exception | None = None
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            translated = payload[0][0] if isinstance(payload[0], list) else payload[0]
            return translated
        except Exception as exc:  # Network throttling is expected on a bulk job.
            error = exc
            time.sleep(min(2**attempt, 20))
    raise RuntimeError(f"Translation failed after {attempts} attempts: {source[:80]!r}") from error


def request_translation(source: str, attempts: int = 6) -> str:
    parts = PROTECTED_RE.split(source)
    translated: list[str] = []
    for part in parts:
        if not part:
            continue
        if PROTECTED_RE.fullmatch(part):
            translated.append(part)
        else:
            translated.append(request_plain_translation(part, attempts))
    return "".join(translated)


class Cache:
    def __init__(self, path: Path):
        self.connection = sqlite3.connect(path, check_same_thread=False)
        self.connection.execute(
            "CREATE TABLE IF NOT EXISTS translations "
            "(source TEXT PRIMARY KEY, translated TEXT NOT NULL)"
        )
        self.lock = threading.Lock()

    def load(self) -> dict[str, str]:
        return dict(self.connection.execute("SELECT source, translated FROM translations"))

    def save(self, source: str, translated: str) -> None:
        with self.lock:
            self.connection.execute(
                "INSERT OR REPLACE INTO translations(source, translated) VALUES (?, ?)",
                (source, translated),
            )
            self.connection.commit()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("xml", type=Path)
    parser.add_argument("--workers", type=int, default=12)
    args = parser.parse_args()

    xml_path = args.xml.resolve()
    original_bytes = xml_path.read_bytes()
    newline = "\r\n" if b"\r\n" in original_bytes else "\n"
    original = original_bytes.decode("utf-8").replace("\r\n", "\n")
    matches = list(STRING_RE.finditer(original))
    sources = {
        html.unescape(match.group(3))
        for match in matches
        if match.group(2) not in SKIP_FIELDS and html.unescape(match.group(3)).strip()
    }

    cache = Cache(xml_path.with_suffix(xml_path.suffix + ".es-cache.sqlite3"))
    translated = cache.load()
    pending = sorted(sources - translated.keys())
    print(f"Unique strings: {len(sources)}; cached: {len(sources) - len(pending)}; pending: {len(pending)}", flush=True)

    completed = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(request_translation, source): source for source in pending}
        for future in concurrent.futures.as_completed(futures):
            source = futures[future]
            result = future.result()
            cache.save(source, result)
            translated[source] = result
            completed += 1
            if completed % 100 == 0 or completed == len(pending):
                print(f"Translated {completed}/{len(pending)}", flush=True)

    def apply(match: re.Match[str]) -> str:
        field, encoded = match.group(2), match.group(3)
        if field in SKIP_FIELDS:
            return match.group(0)
        source = html.unescape(encoded)
        result = translated.get(source, source)
        escaped = html.escape(result, quote=True).replace("&#x27;", "&apos;")
        return f"{match.group(1)}{escaped}{match.group(4)}"

    output = STRING_RE.sub(apply, original)
    temp_path = xml_path.with_suffix(xml_path.suffix + ".tmp")
    temp_path.write_bytes(output.replace("\n", newline).encode("utf-8"))
    ET.parse(temp_path)

    backup_path = xml_path.with_suffix(xml_path.suffix + ".en-backup")
    if not backup_path.exists():
        shutil.copy2(xml_path, backup_path)
    temp_path.replace(xml_path)
    print(f"Updated {xml_path}", flush=True)
    print(f"English backup: {backup_path}", flush=True)


if __name__ == "__main__":
    main()
