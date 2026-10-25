import xml.etree.ElementTree as ET

tree_info = ET.parse('wz/Quest.wz/QuestInfo.img.xml')
for q in tree_info.getroot().findall('imgdir'):
    area = q.find("int[@name='area']")
    if area is not None and area.attrib.get('value') == '50':
        qid = q.attrib.get('name')
        name = q.find("string[@name='name']")
        parent = q.find("string[@name='parent']")
        print(f"Area 50: qid={qid}, name={name.attrib.get('value') if name is not None else ''}, parent={parent.attrib.get('value') if parent is not None else ''}")
