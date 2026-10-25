import os
import xml.etree.ElementTree as ET

zero_cy_npcs = []
missing_fh_npcs = []

for root, dirs, files in os.walk('wz/Map.wz'):
    for f in files:
        if f.endswith('.xml'):
            path = os.path.join(root, f)
            try:
                tree = ET.parse(path)
                life_node = tree.getroot().find("imgdir[@name='life']")
                if life_node is not None:
                    for l in life_node.findall('imgdir'):
                        type_tag = l.find("string[@name='type']")
                        if type_tag is not None and type_tag.attrib.get('value') == 'n':
                            id_tag = l.find("string[@name='id']")
                            npc_id = id_tag.attrib.get('value') if id_tag is not None else 'unknown'
                            cy_tag = l.find("int[@name='cy']")
                            y_tag = l.find("int[@name='y']")
                            fh_tag = l.find("int[@name='fh']")
                            
                            cy_val = int(cy_tag.attrib.get('value')) if cy_tag is not None else None
                            y_val = int(y_tag.attrib.get('value')) if y_tag is not None else None
                            fh_val = int(fh_tag.attrib.get('value')) if fh_tag is not None else None
                            
                            if cy_val is None or (cy_val == 0 and y_val != 0):
                                zero_cy_npcs.append((f, npc_id, cy_val, y_val, fh_val))
            except Exception as e:
                pass

print(f"Total zero/missing cy NPCs: {len(zero_cy_npcs)}")
for item in zero_cy_npcs[:20]:
    print(item)
