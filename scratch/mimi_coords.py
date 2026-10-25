import xml.etree.ElementTree as ET

for map_id in ['100000000', '104000000', '200000000', '240000000', '260000000', '600000000']:
    path = f'wz/Map.wz/Map/Map{map_id[0]}/{map_id}.img.xml'
    tree = ET.parse(path)
    life = tree.getroot().find("imgdir[@name='life']")
    for child in life.findall('imgdir'):
        nid = child.find("string[@name='id']")
        if nid is not None and nid.attrib.get('value') == '9209001':
            x = child.find("int[@name='x']").attrib.get('value')
            y = child.find("int[@name='y']").attrib.get('value')
            cy = child.find("int[@name='cy']").attrib.get('value')
            fh = child.find("int[@name='fh']").attrib.get('value')
            print(f"Map {map_id}: Mimi x={x}, y={y}, cy={cy}, fh={fh}")
