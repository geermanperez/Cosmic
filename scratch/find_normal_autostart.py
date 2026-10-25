import xml.etree.ElementTree as ET

tree = ET.parse('wz/Quest.wz/Check.img.xml')
for q in tree.getroot().findall('imgdir'):
    qid = q.attrib.get('name')
    for state in q.findall('imgdir'):
        nas = state.find("int[@name='normalAutoStart']")
        if nas is not None:
            print(f"Quest {qid} state {state.attrib.get('name')}: normalAutoStart={nas.attrib.get('value')}")
