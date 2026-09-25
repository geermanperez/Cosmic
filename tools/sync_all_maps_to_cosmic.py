import struct, os, sys, time
import xml.etree.ElementTree as ET

KEY = bytes.fromhex('f709616307746ae3047b2f69c96a0d1f37') + bytes([0]*40000)
WZ_OffsetConstant = 0x581C3F6D
fstart = 60
h = 1876

def rol32(val, n):
    n &= 31
    return ((val << n) | (val >> (32 - n))) & 0xFFFFFFFF

def decrypt_ascii(data, mask=0xAA):
    dec = []
    for i in range(len(data)):
        dec.append((data[i] ^ (KEY[i] if i < len(KEY) else 0) ^ mask) & 0xFF)
        mask = (mask + 1) & 0xFF
    return bytes(dec).decode('ascii', errors='replace')

def decrypt_str(raw):
    mask = 0xAA
    dec = []
    for i in range(min(len(raw), len(KEY))):
        dec.append((raw[i] ^ (KEY[i] if i < len(KEY) else 0) ^ mask) & 0xFF)
        mask = (mask + 1) & 0xFF
    return bytes(dec).decode('ascii', errors='replace')

def read_dir(f, off):
    f.seek(off)
    b = f.read(1)[0]
    count = struct.unpack('<I', f.read(4))[0] if b == 0x80 else b
    entries = []
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
        child_off = ((pos - fstart) ^ 0xFFFFFFFF) & 0xFFFFFFFF
        child_off = (child_off * h) & 0xFFFFFFFF
        child_off = (child_off - WZ_OffsetConstant) & 0xFFFFFFFF
        child_off = rol32(child_off, child_off & 0x1F)
        child_off = (child_off ^ enc) & 0xFFFFFFFF
        child_off = (child_off + fstart * 2) & 0xFFFFFFFF
        entries.append((t, name, child_off))
    return entries

class WzReader:
    def __init__(self, data):
        self.data = data
        self.pos = 0

    def read_u8(self):
        v = self.data[self.pos]
        self.pos += 1
        return v

    def read_i8(self):
        v = struct.unpack('<b', self.data[self.pos:self.pos+1])[0]
        self.pos += 1
        return v

    def read_u16(self):
        v = struct.unpack('<H', self.data[self.pos:self.pos+2])[0]
        self.pos += 2
        return v

    def read_i16(self):
        v = struct.unpack('<h', self.data[self.pos:self.pos+2])[0]
        self.pos += 2
        return v

    def read_u32(self):
        v = struct.unpack('<I', self.data[self.pos:self.pos+4])[0]
        self.pos += 4
        return v

    def read_i32(self):
        v = struct.unpack('<i', self.data[self.pos:self.pos+4])[0]
        self.pos += 4
        return v

    def read_f32(self):
        v = struct.unpack('<f', self.data[self.pos:self.pos+4])[0]
        self.pos += 4
        return v

    def read_f64(self):
        v = struct.unpack('<d', self.data[self.pos:self.pos+8])[0]
        self.pos += 8
        return v

    def read_wz_int(self):
        b = self.read_i8()
        if b == -128:
            return self.read_i32()
        return b

    def read_wz_string(self):
        slen = self.read_i8()
        if slen == 0: return ''
        if slen > 0:
            raw = self.data[self.pos:self.pos + slen*2]
            self.pos += slen*2
            return raw.decode('utf-16le', errors='replace')
        else:
            length = -slen
            raw = self.data[self.pos:self.pos + length]
            self.pos += length
            return decrypt_str(raw)

    def read_string_block(self, offset):
        b = self.read_u8()
        if b == 0x00 or b == 0x73:
            return self.read_wz_string()
        elif b == 0x01 or b == 0x1B:
            off = self.read_i32()
            saved = self.pos
            self.pos = off
            s = self.read_wz_string()
            self.pos = saved
            return s
        else:
            raise ValueError(f'Unknown string block byte {b} at {self.pos-1}')

def parse_wz_map(data):
    reader = WzReader(data)
    if len(data) < 10: return None
    header_b = reader.read_u8()
    prop_str = reader.read_wz_string()
    if prop_str != 'Property': return None
    reader.read_u16()

    def parse_prop(path=''):
        entry_count = reader.read_wz_int()
        props = {}
        for _ in range(entry_count):
            name = reader.read_string_block(0)
            ptype = reader.read_u8()
            cur_path = f'{path}/{name}' if path else name
            val = None
            if ptype == 0:
                val = None
            elif ptype in (2, 11):
                val = reader.read_i16()
            elif ptype in (3, 19):
                val = reader.read_wz_int()
            elif ptype == 20:
                val = struct.unpack('<q', reader.data[reader.pos:reader.pos+8])[0]
                reader.pos += 8
            elif ptype == 4:
                t = reader.read_u8()
                val = reader.read_f32() if t == 0x80 else 0.0
            elif ptype == 5:
                val = reader.read_f64()
            elif ptype == 8:
                val = reader.read_string_block(0)
            elif ptype == 9:
                blen = reader.read_u32()
                eob = reader.pos + blen
                val = parse_ext(cur_path, eob)
                reader.pos = eob
            props[name] = val
        return props

    def parse_ext(path, eob):
        b = reader.read_u8()
        if b in (0x01, 0x1B):
            off = reader.read_i32()
            saved = reader.pos
            reader.pos = off
            iname = reader.read_wz_string()
            reader.pos = saved
        elif b in (0x00, 0x73):
            iname = reader.read_wz_string()
        else:
            raise ValueError(f'Unknown iname byte {b}')
        
        if iname == 'Property':
            reader.pos += 2
            return parse_prop(path)
        elif iname == 'Canvas':
            reader.pos += 1
            subprops = {}
            if reader.read_u8() == 1:
                reader.pos += 2
                subprops = parse_prop(path)
            reader.pos = eob
            return {'_type': 'Canvas', 'props': subprops}
        elif iname == 'Shape2D#Vector2D':
            x = reader.read_wz_int()
            y = reader.read_wz_int()
            return {'_type': 'Vector2D', 'x': x, 'y': y}
        elif iname == 'Shape2D#Convex2D':
            count = reader.read_wz_int()
            sub = [parse_ext(f'{path}/{i}', eob) for i in range(count)]
            return {'_type': 'Convex2D', 'elements': sub}
        elif iname == 'Sound_DX8':
            reader.pos = eob
            return {'_type': 'Sound'}
        elif iname == 'UOL':
            reader.pos += 1
            return {'_type': 'UOL', 'uol': reader.read_string_block(0)}
        else:
            reader.pos = eob
            return {'_type': iname}

    return parse_prop()

def sanitize_xml_string(s):
    if not isinstance(s, str):
        return str(s)
    return "".join(c for c in s if c in ('\t', '\r', '\n') or (0x20 <= ord(c) <= 0xD7FF) or (0xE000 <= ord(c) <= 0xFFFD))

def prop_to_xml(name, val):
    clean_name = sanitize_xml_string(name)
    elem = None
    if isinstance(val, dict):
        t = val.get('_type')
        if t == 'Vector2D':
            elem = ET.Element('vector', {'name': clean_name, 'x': str(val.get('x', 0)), 'y': str(val.get('y', 0))})
        elif t == 'UOL':
            elem = ET.Element('uol', {'name': clean_name, 'value': sanitize_xml_string(val.get('uol', ''))})
        elif t in ('Canvas', 'Sound'):
            pass
        else:
            elem = ET.Element('imgdir', {'name': clean_name})
            for sub_name, sub_val in val.items():
                if sub_name.startswith('_'): continue
                sub_elem = prop_to_xml(sub_name, sub_val)
                if sub_elem is not None:
                    elem.append(sub_elem)
    elif isinstance(val, int):
        elem = ET.Element('int', {'name': clean_name, 'value': str(val)})
    elif isinstance(val, float):
        elem = ET.Element('float', {'name': clean_name, 'value': str(val)})
    elif isinstance(val, str):
        elem = ET.Element('string', {'name': clean_name, 'value': sanitize_xml_string(val)})
    return elem


def main():
    print("=== MAP & NPC SYNC TOOL: CLIENT Map.wz -> COSMIC XMLs ===")
    t0 = time.time()
    
    # 1. Collect NPC scripts from Cosmic
    cosmic_script_npcs = set()
    script_dir = "Cosmic/scripts/npc"
    if os.path.exists(script_dir):
        for fn in os.listdir(script_dir):
            if fn.endswith(".js"):
                nid = fn[:-3]
                if nid.isdigit():
                    cosmic_script_npcs.add(nid)
    print(f"Found {len(cosmic_script_npcs)} NPC scripts in Cosmic.")

    # 2. Index client maps from Map.wz
    print("Reading Map.wz directory...")
    f = open("Map.wz", "rb")
    root = read_dir(f, 62)
    map_dir = next(e for e in root if e[1] == 'Map')
    map_sub = read_dir(f, map_dir[2])
    client_maps = {}
    for t, name, off in map_sub:
        if t == 3 and name.startswith('Map'):
            for st, sname, soff in read_dir(f, off):
                if sname.endswith('.img'):
                    client_maps[sname[:-4]] = soff
    print(f"Total client maps indexed: {len(client_maps)}")

    # 3. Synchronize each map
    updated_count = 0
    created_count = 0
    skipped_count = 0
    error_count = 0

    total_maps = len(client_maps)
    idx = 0

    for mid, soff in sorted(client_maps.items(), key=lambda x: int(x[0]) if x[0].isdigit() else x[0]):
        idx += 1
        if idx % 500 == 0 or idx == total_maps:
            print(f"Progress: {idx}/{total_maps} maps processed ({idx/total_maps*100:.1f}%)...")

        # Skip Free Market if already updated to 22-room version
        if mid == '910000000':
            updated_count += 1
            continue

        xml_dir = f"Cosmic/wz/Map.wz/Map/Map{mid[0]}"
        xml_path = os.path.join(xml_dir, f"{mid}.img.xml")

        try:
            f.seek(soff)
            data = f.read(1500000)
            c_data = parse_wz_map(data)
            if not c_data:
                skipped_count += 1
                continue

            if os.path.exists(xml_path):
                # Update existing XML
                tree = ET.parse(xml_path)
                r = tree.getroot()

                # Check for custom Cosmic NPCs in old life
                custom_cosmic_npcs = []
                old_life = r.find("./imgdir[@name='life']")
                client_npc_ids = set()
                if 'life' in c_data and isinstance(c_data['life'], dict):
                    for k, v in c_data['life'].items():
                        if isinstance(v, dict) and v.get('type') == 'n' and 'id' in v:
                            client_npc_ids.add(str(v['id']))

                if old_life is not None:
                    for elem in old_life:
                        t_el = elem.find("./string[@name='type']")
                        id_el = elem.find("./string[@name='id']")
                        if t_el is not None and t_el.attrib.get('value') == 'n' and id_el is not None:
                            nid = id_el.attrib.get('value')
                            # Preserve custom NPC if it's in cosmic_script_npcs and NOT in client
                            if nid in ('9209003', '9000070') or (nid in cosmic_script_npcs and nid not in client_npc_ids):
                                custom_cosmic_npcs.append(elem)

                # Replace life
                if 'life' in c_data and isinstance(c_data['life'], dict):
                    new_life = prop_to_xml('life', c_data['life'])
                    if new_life is not None:
                        # Append any preserved custom NPCs
                        if custom_cosmic_npcs:
                            start_idx = len(list(new_life))
                            for c_elem in custom_cosmic_npcs:
                                c_elem.attrib['name'] = str(start_idx)
                                new_life.append(c_elem)
                                start_idx += 1

                        if old_life is not None:
                            r.remove(old_life)
                        r.append(new_life)

                # Replace foothold
                if 'foothold' in c_data and isinstance(c_data['foothold'], dict):
                    old_fh = r.find("./imgdir[@name='foothold']")
                    new_fh = prop_to_xml('foothold', c_data['foothold'])
                    if new_fh is not None:
                        if old_fh is not None:
                            r.remove(old_fh)
                        r.append(new_fh)

                # Replace portal
                if 'portal' in c_data and isinstance(c_data['portal'], dict):
                    old_pt = r.find("./imgdir[@name='portal']")
                    new_pt = prop_to_xml('portal', c_data['portal'])
                    if new_pt is not None:
                        if old_pt is not None:
                            r.remove(old_pt)
                        r.append(new_pt)

                ET.indent(r, space='  ')
                tree.write(xml_path, encoding='utf-8', xml_declaration=True)
                updated_count += 1

            else:
                # Map exists in client but not in Cosmic XMLs -> Create full XML
                os.makedirs(xml_dir, exist_ok=True)
                root_elem = ET.Element('imgdir', {'name': f'{mid}.img'})
                for sec in ['info', 'back', 'life', 'foothold', 'ladderRope', 'portal', 'seat', 'area']:
                    if sec in c_data and c_data[sec]:
                        sec_elem = prop_to_xml(sec, c_data[sec])
                        if sec_elem is not None:
                            root_elem.append(sec_elem)

                ET.indent(root_elem, space='  ')
                new_tree = ET.ElementTree(root_elem)
                new_tree.write(xml_path, encoding='utf-8', xml_declaration=True)
                created_count += 1

        except Exception as e:
            error_count += 1
            if error_count <= 10:
                print(f"Error processing map {mid}: {e}")

    f.close()
    elapsed = time.time() - t0
    print(f"\n=== SYNC COMPLETE ===")
    print(f"Total processed: {total_maps}")
    print(f"Updated existing maps: {updated_count}")
    print(f"Created new maps: {created_count}")
    print(f"Skipped: {skipped_count}")
    print(f"Errors: {error_count}")
    print(f"Total time: {elapsed:.2f}s")

if __name__ == '__main__':
    main()
