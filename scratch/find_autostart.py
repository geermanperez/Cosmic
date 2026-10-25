import xml.etree.ElementTree as ET

tree = ET.parse('wz/Quest.wz/QuestInfo.img.xml')
root = tree.getroot()
for q in root.findall('imgdir'):
    qid = q.attrib.get('name')
    autostart = q.find("int[@name='autoStart']")
    name = q.find("string[@name='name']")
    parent = q.find("string[@name='parent']")
    name_val = name.attrib.get('value') if name is not None else ''
    parent_val = parent.attrib.get('value') if parent is not None else ''
    if autostart is not None and autostart.attrib.get('value') == '1':
        msg = f"Quest {qid}: autoStart=1, name='{name_val}', parent='{parent_val}'"
        print(msg.encode('ascii', 'replace').decode('ascii'))
