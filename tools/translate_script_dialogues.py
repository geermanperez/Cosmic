#!/usr/bin/env python3
"""Translate player-facing dialogue calls in Cosmic JavaScript files."""

from __future__ import annotations

import argparse
import concurrent.futures
import os
import re
import zipfile
from pathlib import Path

from translate_npc_dialogues import Cache, request_translation


CALL_RE = re.compile(
    r"\.(?:send[A-Za-z0-9_]*|playerMessage|dropMessage|showInstruction)\s*\("
)
LETTER_RE = re.compile(r"[A-Za-z]{2,}")


def call_ranges(text: str) -> list[tuple[int, int]]:
    ranges: list[tuple[int, int]] = []
    for match in CALL_RE.finditer(text):
        i = match.end()
        depth = 1
        quote: str | None = None
        escaped = False
        while i < len(text) and depth:
            char = text[i]
            if quote:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
            elif char in "\"'":
                quote = char
            elif char == "(":
                depth += 1
            elif char == ")":
                depth -= 1
            i += 1
        if depth == 0:
            ranges.append((match.end(), i - 1))
    return ranges


def string_literals(text: str, start: int, end: int) -> list[tuple[int, int, str, str]]:
    result: list[tuple[int, int, str, str]] = []
    i = start
    while i < end:
        if text[i] not in "\"'":
            i += 1
            continue
        quote = text[i]
        content_start = i + 1
        i += 1
        escaped = False
        while i < end:
            char = text[i]
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                result.append((content_start, i, quote, text[content_start:i]))
                i += 1
                break
            i += 1
    return result


def encode_js(text: str, quote: str) -> str:
    escapes: dict[str, str] = {}

    def hold(match: re.Match[str]) -> str:
        key = f"ZXQESC{len(escapes):04d}QXZ"
        escapes[key] = match.group(0)
        return key

    protected = re.sub(r"\\.", hold, text)
    protected = protected.replace(quote, "\\" + quote)
    for key, value in escapes.items():
        protected = protected.replace(key, value)
    return protected


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--cache", type=Path, default=Path("tools/script-dialogues-es-cache.sqlite3"))
    parser.add_argument("--backup", type=Path, default=Path("tools/script-dialogues-en-backup.zip"))
    args = parser.parse_args()

    files: list[Path] = []
    for path in args.paths:
        files.extend(path.rglob("*.js") if path.is_dir() else [path])
    files = sorted({path.resolve() for path in files})

    raw_contents = {path: path.read_bytes() for path in files}
    newlines = {
        path: "\r\n" if b"\r\n" in raw else "\n" for path, raw in raw_contents.items()
    }
    contents = {
        path: raw.decode("utf-8").replace("\r\n", "\n")
        for path, raw in raw_contents.items()
    }
    occurrences: dict[Path, list[tuple[int, int, str, str]]] = {}
    sources: set[str] = set()
    for path, text in contents.items():
        found: list[tuple[int, int, str, str]] = []
        for start, end in call_ranges(text):
            for literal in string_literals(text, start, end):
                if LETTER_RE.search(literal[3]):
                    found.append(literal)
                    sources.add(literal[3])
        if found:
            occurrences[path] = found

    cache = Cache(args.cache.resolve())
    translated = cache.load()
    pending = sorted(sources - translated.keys())
    print(
        f"Files with dialogue: {len(occurrences)}; unique strings: {len(sources)}; "
        f"cached: {len(sources) - len(pending)}; pending: {len(pending)}",
        flush=True,
    )
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(request_translation, source): source for source in pending}
        for completed, future in enumerate(concurrent.futures.as_completed(futures), 1):
            source = futures[future]
            result = future.result()
            cache.save(source, result)
            translated[source] = result
            if completed % 100 == 0 or completed == len(pending):
                print(f"Translated {completed}/{len(pending)}", flush=True)

    backup = args.backup.resolve()
    backup.parent.mkdir(parents=True, exist_ok=True)
    common = Path(os.path.commonpath([str(path) for path in files]))
    with zipfile.ZipFile(backup, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in occurrences:
            archive.write(path, path.relative_to(common))

    for path, found in occurrences.items():
        output = contents[path]
        for start, end, quote, source in reversed(found):
            output = output[:start] + encode_js(translated[source], quote) + output[end:]
        path.write_bytes(output.replace("\n", newlines[path]).encode("utf-8"))
    print(f"Updated {len(occurrences)} files", flush=True)
    print(f"English backup: {backup}", flush=True)


if __name__ == "__main__":
    main()
