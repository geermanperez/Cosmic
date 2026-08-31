from pathlib import Path
import re

CONFIG = Path(__file__).resolve().parents[1] / "config.yaml"

text = CONFIG.read_text(encoding="utf-8-sig")
original = text

replacements = {
    r"(?m)^(\s*server_message:\s*).*$": r"\1Welcome to Everlaf MS!",
    r"(?m)^(\s*event_message:\s*).*$": r"\1Everlaf MS - Classic Global MapleStory",
    r"(?m)^(\s*why_am_i_recommended:\s*).*$": r"\1Everlaf MS - 1x Classic progression",
}

# Branding only for the active first world (Scania). Avoid changing every inactive world.
lines = text.splitlines()
in_first_world = False
first_world_done = False
for i, line in enumerate(lines):
    if "#Properties for Scania 0" in line:
        in_first_world = True
        continue
    if in_first_world and "#Properties for Bera 1" in line:
        first_world_done = True
        in_first_world = False
    if in_first_world and not first_world_done:
        if re.match(r"\s*server_message:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}server_message: Welcome to Everlaf MS!"
        elif re.match(r"\s*event_message:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}event_message: Everlaf MS - Classic Global MapleStory"
        elif re.match(r"\s*why_am_i_recommended:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}why_am_i_recommended: Everlaf MS - 1x Classic progression"
        elif re.match(r"\s*exp_rate:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}exp_rate: 1"
        elif re.match(r"\s*meso_rate:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}meso_rate: 1"
        elif re.match(r"\s*drop_rate:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}drop_rate: 1"
        elif re.match(r"\s*boss_drop_rate:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}boss_drop_rate: 1                      # Everlaf MS: classic 1x boss drops"
        elif re.match(r"\s*quest_rate:\s*", line):
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f"{indent}quest_rate: 1                           # Everlaf MS: classic quest rewards"

text = "\n".join(lines) + "\n"

# Party bonus requested for Everlaf MS.
text, party_count = re.subn(
    r"(?m)^(\s*PARTY_BONUS_EXP_RATE:\s*)[^\s#]+(.*)$",
    r"\g<1>5.0\2",
    text,
    count=1,
)

if party_count != 1:
    raise RuntimeError("PARTY_BONUS_EXP_RATE was not found exactly once; config not written.")

required = {
    "exp_rate: 1": "EXP rate",
    "meso_rate: 1": "meso rate",
    "drop_rate: 1": "drop rate",
    "boss_drop_rate: 1": "boss drop rate",
    "PARTY_BONUS_EXP_RATE: 5.0": "party EXP bonus",
    "Welcome to Everlaf MS!": "branding",
}
for needle, description in required.items():
    if needle not in text:
        raise RuntimeError(f"Failed to apply {description}; config not written.")

if text == original:
    print("Everlaf MS configuration already applied; no changes needed.")
else:
    CONFIG.write_text(text, encoding="utf-8")
    print("Everlaf MS configuration applied successfully.")
    print("Rates: EXP 1x | Meso 1x | Drop 1x | Boss Drop 1x | Party bonus 5x")
    print("PQ_BONUS_EXP_RATE and existing gameplay scripts were intentionally left untouched.")
