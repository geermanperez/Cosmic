import json
import os
import xml.etree.ElementTree as ET

with open('sync_data.json', 'r') as f:
    data = json.load(f)

chairs = data['chairs']
hairs = data['hairs']
faces = data['faces']

print(f"Syncing {len(chairs)} chairs, {len(hairs)} hairs, {len(faces)} faces into Cosmic...")

# 1. CHAIRS (0301.img.xml)
chair_xml_path = 'Cosmic/wz/Item.wz/Install/0301.img.xml'
tree = ET.parse(chair_xml_path)
root = tree.getroot()
existing_chairs = set(child.attrib.get('name') for child in root if child.tag == 'imgdir')

added_chairs = 0
for cid in sorted(chairs):
    if cid not in existing_chairs:
        node = ET.SubElement(root, 'imgdir', {'name': cid})
        info = ET.SubElement(node, 'imgdir', {'name': 'info'})
        ET.SubElement(info, 'int', {'name': 'price', 'value': '100'})
        ET.SubElement(info, 'int', {'name': 'slotMax', 'value': '1'})
        ET.SubElement(info, 'int', {'name': 'recoveryHP', 'value': '50'})
        ET.SubElement(info, 'int', {'name': 'recoveryMP', 'value': '50'})
        ET.SubElement(info, 'int', {'name': 'reqLevel', 'value': '0'})
        existing_chairs.add(cid)
        added_chairs += 1

tree.write(chair_xml_path, encoding='utf-8', xml_declaration=True)
print(f"Updated 0301.img.xml: added {added_chairs} new chairs (total {len(existing_chairs)})")

# 2. CHAIR STRINGS (String.wz/Ins.img.xml)
ins_xml_path = 'Cosmic/wz/String.wz/Ins.img.xml'
ins_tree = ET.parse(ins_xml_path)
ins_root = ins_tree.getroot()
existing_ins = set(child.attrib.get('name') for child in ins_root if child.tag == 'imgdir')

added_ins = 0
for cid in sorted(chairs):
    num_id = str(int(cid))
    if num_id not in existing_ins:
        node = ET.SubElement(ins_root, 'imgdir', {'name': num_id})
        ET.SubElement(node, 'string', {'name': 'name', 'value': f'Special Chair {num_id}'})
        ET.SubElement(node, 'string', {'name': 'desc', 'value': 'Special custom chair from YunaMS.'})
        existing_ins.add(num_id)
        added_ins += 1

ins_tree.write(ins_xml_path, encoding='utf-8', xml_declaration=True)
print(f"Updated String.wz/Ins.img.xml: added {added_ins} new chair names")

# 3. HAIRS (Character.wz/Hair/)
hair_dir = 'Cosmic/wz/Character.wz/Hair'
os.makedirs(hair_dir, exist_ok=True)
existing_hair_files = set(os.listdir(hair_dir))

added_hairs = 0
hair_fmt = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<imgdir name="{hid}.img">
  <imgdir name="info">
    <string name="islot" value="Hr"/>
    <string name="vslot" value="H1H2H3H4H5H6HfHsHb"/>
    <int name="cash" value="1"/>
  </imgdir>
</imgdir>
"""

for hid in hairs:
    fname = f"{hid}.img.xml"
    if fname not in existing_hair_files:
        with open(os.path.join(hair_dir, fname), 'w', encoding='utf-8') as hf:
            hf.write(hair_fmt.format(hid=hid))
        existing_hair_files.add(fname)
        added_hairs += 1

print(f"Created {added_hairs} new hair XML files in Cosmic/wz/Character.wz/Hair/")

# 4. FACES (Character.wz/Face/)
face_dir = 'Cosmic/wz/Character.wz/Face'
os.makedirs(face_dir, exist_ok=True)
existing_face_files = set(os.listdir(face_dir))

face_fmt = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<imgdir name="{fid}.img">
  <imgdir name="info">
    <string name="islot" value="Fc"/>
    <string name="vslot" value="Fc"/>
    <int name="cash" value="1"/>
  </imgdir>
</imgdir>
"""

added_faces = 0
for fid in faces:
    fname = f"{fid}.img.xml"
    if fname not in existing_face_files:
        with open(os.path.join(face_dir, fname), 'w', encoding='utf-8') as ff:
            ff.write(face_fmt.format(fid=fid))
        existing_face_files.add(fname)
        added_faces += 1

print(f"Created {added_faces} new face XML files in Cosmic/wz/Character.wz/Face/")

# 5. STRING NAMES (String.wz/Eqp.img.xml)
eqp_xml_path = 'Cosmic/wz/String.wz/Eqp.img.xml'
eqp_tree = ET.parse(eqp_xml_path)
eqp_root = eqp_tree.getroot()

hair_eqp_node = None
face_eqp_node = None
for child in eqp_root.iter('imgdir'):
    if child.attrib.get('name') == 'Hair':
        hair_eqp_node = child
    elif child.attrib.get('name') == 'Face':
        face_eqp_node = child

if hair_eqp_node is not None:
    existing_hair_strings = set(c.attrib.get('name') for c in hair_eqp_node)
    added_hs = 0
    for hid in hairs:
        num = str(int(hid))
        if num not in existing_hair_strings:
            n = ET.SubElement(hair_eqp_node, 'imgdir', {'name': num})
            ET.SubElement(n, 'string', {'name': 'name', 'value': f'Hair {num}'})
            existing_hair_strings.add(num)
            added_hs += 1
    print(f"Updated String.wz/Eqp.img.xml: added {added_hs} new hair names")

if face_eqp_node is not None:
    existing_face_strings = set(c.attrib.get('name') for c in face_eqp_node)
    added_fs = 0
    for fid in faces:
        num = str(int(fid))
        if num not in existing_face_strings:
            n = ET.SubElement(face_eqp_node, 'imgdir', {'name': num})
            ET.SubElement(n, 'string', {'name': 'name', 'value': f'Face {num}'})
            existing_face_strings.add(num)
            added_fs += 1
    print(f"Updated String.wz/Eqp.img.xml: added {added_fs} new face names")

eqp_tree.write(eqp_xml_path, encoding='utf-8', xml_declaration=True)
print("ALL COSMIC WZ XML DATA SYNCHRONIZED SUCCESSFULLY!")
