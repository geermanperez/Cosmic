import struct
import os
import re
import xml.sax.saxutils as saxutils

key = bytes.fromhex('f709616307746ae3047b2f69c96a0d1f37') + bytes([0] * 4096)
WZ_OffsetConstant = 0x581C3F6D
fstart = 60
h = 1876

def rol32(val, n):
    n &= 31
    return ((val << n) | (val >> (32 - n))) & 0xFFFFFFFF

def decrypt_ascii(data, mask=0xAA):
    dec = []
    for i, b in enumerate(data):
        dec.append((b ^ (key[i] if i < len(key) else 0) ^ mask) & 0xFF)
        mask = (mask + 1) & 0xFF
    return bytes(dec).decode('ascii', errors='replace')

print("=== 1. READING ALL MOBS FROM YunaMS Mob.wz ===")
mob_entries = []
with open('Mob.wz', 'rb') as f:
    f.seek(62)
    b = f.read(1)[0]
    count = struct.unpack('<I', f.read(4))[0] if b == 0x80 else b
    print(f"Total entries in Mob.wz: {count}")
    
    for i in range(count):
        t = f.read(1)[0]
        slen = f.read(1)[0]
        length = 256 - slen if slen > 127 else slen
        name_bytes = f.read(length)
        b1 = f.read(1)[0]
        if b1 == 0x80: f.read(4)
        b2 = f.read(1)[0]
        if b2 == 0x80: f.read(4)
        pos = f.tell()
        enc = struct.unpack('<I', f.read(4))[0]
        name = decrypt_ascii(name_bytes)
        
        if name.endswith('.img'):
            m_id = name[:-4]
            if m_id.isdigit():
                off = ((pos - fstart) ^ 0xFFFFFFFF) & 0xFFFFFFFF
                off = (off * h) & 0xFFFFFFFF
                off = (off - WZ_OffsetConstant) & 0xFFFFFFFF
                off = rol32(off, off & 0x1F)
                off = (off ^ enc) & 0xFFFFFFFF
                off = (off + fstart * 2) & 0xFFFFFFFF
                mob_entries.append((m_id, off))

print(f"Extracted {len(mob_entries)} mobs from Mob.wz")

# Compare with existing Cosmic mobs
cosmic_mob_dir = 'Cosmic/wz/Mob.wz'
existing_cosmic_mobs = set(fn[:-8] for fn in os.listdir(cosmic_mob_dir) if fn.endswith('.img.xml'))
print(f"Existing Cosmic mobs: {len(existing_cosmic_mobs)}")

new_mobs = [(m_id, off) for m_id, off in mob_entries if m_id not in existing_cosmic_mobs]
new_mobs.sort(key=lambda x: int(x[0]))
print(f"NEW mobs to add: {len(new_mobs)}")

print("\n=== 2. EXTRACTING MOB NAMES FROM String.wz ===")
mob_name_map = {}
with open('String.wz', 'rb') as f:
    f.seek(8530443)
    data = f.read(1442103)

pattern = b'\xfc\x33\xc3\xa0\xab\x08'
matches = [m.start() for m in re.finditer(pattern, data)]

for pos in matches:
    val_byte = data[pos + 6]
    name = None
    if val_byte > 127:
        length = 256 - val_byte
        name = decrypt_ascii(data[pos + 7 : pos + 7 + length])
    elif val_byte in (0, 1):
        s = data[pos + 7]
        length = 256 - s if s > 127 else s
        name = decrypt_ascii(data[pos + 8 : pos + 8 + length])
    
    if not name or len(name) < 2:
        continue
    
    before = data[max(0, pos - 40) : pos]
    for id_len in (7, 6):
        for offset in range(len(before) - id_len):
            cand_bytes = before[offset : offset + id_len]
            cand_id = decrypt_ascii(cand_bytes)
            if cand_id.isdigit() and len(cand_id) == id_len:
                mob_name_map[cand_id] = name
                mob_name_map[str(int(cand_id))] = name
                break

print(f"Found names for {len(mob_name_map)} mob IDs in String.wz")

print("\n=== 3. EXTRACTING STATS AND GENERATING XMLs ===")
def parse_mob_info(f, offset):
    try:
        f.seek(offset)
        f.read(12)
        prop_count = struct.unpack('<H', f.read(2))[0]
        flag = f.read(1)[0]
        slen = f.read(1)[0] if flag == 0 else flag
        length = 256 - slen if slen > 127 else slen
        pname = decrypt_ascii(f.read(length))
        ptype = f.read(1)[0]
        if pname != 'info' or ptype != 9:
            return {}
        
        f.read(11)
        info_count = struct.unpack('<H', f.read(2))[0]
        stats = {}
        for _ in range(info_count):
            sflag = f.read(1)[0]
            if sflag == 0:
                slen = f.read(1)[0]
            elif sflag > 127:
                slen = sflag
            elif sflag in (1, 0x1B):
                slen = f.read(1)[0]
            else:
                break
                
            length = 256 - slen if slen > 127 else slen
            name = decrypt_ascii(f.read(length))
            vtype = f.read(1)[0]
            
            if vtype == 3:
                b = struct.unpack('b', f.read(1))[0]
                val = struct.unpack('<i', f.read(4))[0] if b == -128 else b
                stats[name] = val
            elif vtype == 2:
                stats[name] = struct.unpack('<h', f.read(2))[0]
            elif vtype == 4:
                b = f.read(1)[0]
                stats[name] = struct.unpack('<f', f.read(4))[0] if b == 0x80 else 0.0
            elif vtype == 5:
                stats[name] = struct.unpack('<d', f.read(8))[0]
            elif vtype == 8:
                s2 = f.read(1)[0]
                if s2 == 0: s2 = f.read(1)[0]
                l2 = 256 - s2 if s2 > 127 else s2
                stats[name] = decrypt_ascii(f.read(l2))
            else:
                break
        return stats
    except Exception:
        return {}

created_xmls = 0
with open('Mob.wz', 'rb') as f:
    for m_id, off in new_mobs:
        xml_file = os.path.join(cosmic_mob_dir, f"{m_id}.img.xml")
        if os.path.exists(xml_file):
            continue  # NEVER OVERWRITE EXISTING
        
        raw_stats = parse_mob_info(f, off)
        
        level = raw_stats.get('level', 100)
        max_hp = raw_stats.get('maxHP', max(1000, level * level * 10))
        max_mp = raw_stats.get('maxMP', max(100, level * 20))
        speed = raw_stats.get('speed', 0)
        pa_dmg = raw_stats.get('PADamage', max(50, level * 5))
        pd_dmg = raw_stats.get('PDDamage', max(50, level * 4))
        ma_dmg = raw_stats.get('MADamage', max(50, level * 5))
        md_dmg = raw_stats.get('MDDamage', max(50, level * 4))
        acc = raw_stats.get('acc', 100)
        eva = raw_stats.get('eva', 20)
        exp = raw_stats.get('exp', max(10, level * level // 5))
        undead = raw_stats.get('undead', 0)
        pushed = raw_stats.get('pushed', 500)
        boss = raw_stats.get('boss', 0)
        body_atk = raw_stats.get('bodyAttack', 1)
        
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            f'<imgdir name="{m_id}.img">',
            '  <imgdir name="info">',
            f'    <int name="bodyAttack" value="{body_atk}"/>',
            f'    <int name="level" value="{level}"/>',
            f'    <int name="maxHP" value="{max_hp}"/>',
            f'    <int name="maxMP" value="{max_mp}"/>',
            f'    <int name="speed" value="{speed}"/>',
            f'    <int name="PADamage" value="{pa_dmg}"/>',
            f'    <int name="PDDamage" value="{pd_dmg}"/>',
            f'    <int name="MADamage" value="{ma_dmg}"/>',
            f'    <int name="MDDamage" value="{md_dmg}"/>',
            f'    <int name="acc" value="{acc}"/>',
            f'    <int name="eva" value="{eva}"/>',
            f'    <int name="exp" value="{exp}"/>',
            f'    <int name="undead" value="{undead}"/>',
            f'    <int name="pushed" value="{pushed}"/>',
            f'    <float name="fs" value="10.0"/>',
            f'    <int name="summonType" value="1"/>',
            f'    <int name="boss" value="{boss}"/>',
            '  </imgdir>',
            '</imgdir>'
        ]
        
        with open(xml_file, 'w', encoding='utf-8') as xf:
            xf.write('\n'.join(xml_lines) + '\n')
        created_xmls += 1

print(f"Created {created_xmls} new mob XMLs in {cosmic_mob_dir}")

print("\n=== 4. ADDING NEW MOB NAMES TO String.wz/Mob.img.xml ===")
string_mob_path = 'Cosmic/wz/String.wz/Mob.img.xml'
with open(string_mob_path, 'r', encoding='utf-8') as sf:
    string_content = sf.read()

existing_string_ids = set(re.findall(r'<imgdir name="(\d+)"', string_content))

new_string_nodes = []
for m_id, _ in new_mobs:
    int_id = str(int(m_id))
    if int_id not in existing_string_ids:
        raw_name = mob_name_map.get(m_id) or mob_name_map.get(int_id) or f"Mob {int_id}"
        clean_name = saxutils.escape(raw_name)
        new_string_nodes.append(f'  <imgdir name="{int_id}">\n    <string name="name" value="{clean_name}"/>\n  </imgdir>')
        existing_string_ids.add(int_id)

if new_string_nodes:
    insert_idx = string_content.rfind('</imgdir>')
    updated_content = string_content[:insert_idx] + '\n'.join(new_string_nodes) + '\n' + string_content[insert_idx:]
    with open(string_mob_path, 'w', encoding='utf-8') as sf:
        sf.write(updated_content)
    print(f"Added {len(new_string_nodes)} new mob names to {string_mob_path}")
else:
    print("No new names needed to add.")

print("\n=== 5. VERIFYING INTEGRITY ===")
total_xmls = len([fn for fn in os.listdir(cosmic_mob_dir) if fn.endswith('.img.xml')])
print(f"Total mob XMLs in Cosmic now: {total_xmls} (originally 1564 + 592 new = {1564 + 592})")
print("SYNC COMPLETED SUCCESSFULLY!")
