import sys
from pathlib import Path

# Use Reader and index_archive from audit_yuna_wz.py
sys.path.insert(0, str(Path(__file__).parent))
from audit_yuna_wz import Reader, index_archive

map_wz = Path("EverleafMs/Map.wz")
if not map_wz.exists():
    print("EverleafMs/Map.wz not found!")
    sys.exit(1)

print(f"Reading {map_wz} ({map_wz.stat().st_size:,} bytes)...")
data = map_wz.read_bytes()
print("Indexing archive...")
entries = index_archive(data, allow_duplicates=True)
paths = {e['path'] for e in entries}
print(f"Total entries in client Map.wz: {len(paths)}")

check_zones = [
    ("Gate to the Future", 271000000, "271"),
    ("Lion Heart Castle", 211060000, "21106"),
    ("Tera Forest & Neo City", 240070000, "24007"),
    ("Golden Temple", 950000000, "9500"),
    ("Crimsonwood Keep", 610030000, "61003"),
    ("Chryse", 200080100, "20008"),
]

for name, entry_id, prefix in check_zones:
    entry_path = f"Map/Map{str(entry_id)[0]}/{entry_id}.img"
    has_entry = entry_path in paths
    zone_count = sum(1 for p in paths if p.startswith(f"Map/Map{prefix[0]}/{prefix}"))
    print(f"\n[{name}]")
    print(f"  Entry map {entry_path}: {'PRESENT' if has_entry else 'MISSING'}")
    print(f"  Total maps with prefix {prefix} in client Map.wz: {zone_count}")
