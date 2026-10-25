import os
import xml.etree.ElementTree as ET

def find_details(xml_path, pattern):
    if not os.path.exists(xml_path):
        print(f"File not found: {xml_path}")
        return
    tree = ET.parse(xml_path)
    for child in tree.getroot().findall('imgdir'):
        name_node = child.find("string[@name='name']")
        if name_node is not None and pattern.lower() in name_node.attrib.get('value', '').lower():
            item_id = child.attrib.get('name')
            item_name = name_node.attrib.get('value')
            print(f"{item_id}: {item_name}")

print("String.wz files:", os.listdir('wz/String.wz'))

print("--- Pet ---")
find_details('wz/String.wz/Pet.img.xml', 'Puppy')
find_details('wz/String.wz/Pet.img.xml', 'Dragon')

print("--- Chair Ins ---")
find_details('wz/String.wz/Ins.img.xml', 'Relaxer')
find_details('wz/String.wz/Ins.img.xml', 'Yellow Relaxer')
find_details('wz/String.wz/Ins.img.xml', 'Blue Relaxer')
find_details('wz/String.wz/Ins.img.xml', 'Red Relaxer')

print("--- Hair / Face in Cash ---")
find_details('wz/String.wz/Cash.img.xml', 'Hair Style')
find_details('wz/String.wz/Cash.img.xml', 'Face')
