import xml.etree.ElementTree as ET

tree_info = ET.parse('wz/Quest.wz/QuestInfo.img.xml')
for q in tree_info.getroot().findall('imgdir'):
    qid = q.attrib.get('name')
    parent = q.find("string[@name='parent']")
    name = q.find("string[@name='name']")
    if parent is not None and '7th Day' in parent.attrib.get('value', ''):
        print(f"Parent match: qid={qid}, name={name.attrib.get('value') if name is not None else ''}, parent={parent.attrib.get('value')}")
    if name is not None and '7th Day' in name.attrib.get('value', ''):
        print(f"Name match: qid={qid}, name={name.attrib.get('value')}")
