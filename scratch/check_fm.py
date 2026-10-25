import xml.etree.ElementTree as ET
tree = ET.parse('wz/Map.wz/Map/Map9/910000000.img.xml')
life = tree.getroot().find("imgdir[@name='life']")
for child in life.findall('imgdir'):
    t = child.find("string[@name='type']").attrib['value']
    if t == 'n':
        nid = child.find("string[@name='id']").attrib['value']
        x = child.find("int[@name='x']").attrib['value']
        y = child.find("int[@name='y']").attrib['value']
        cy = child.find("int[@name='cy']").attrib['value'] if child.find("int[@name='cy']") is not None else 'none'
        print(f"FM NPC: {nid}, x={x}, y={y}, cy={cy}")
