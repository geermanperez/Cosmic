import xml.etree.ElementTree as ET

tree = ET.parse('wz/Quest.wz/Check.img.xml')
for q in tree.getroot().findall('imgdir'):
    qid = q.attrib.get('name')
    for state in q.findall('imgdir'):
        end_tag = state.find("string[@name='end']")
        start_tag = state.find("string[@name='start']")
        if end_tag is not None or start_tag is not None:
            e_val = end_tag.attrib.get('value') if end_tag is not None else ''
            s_val = start_tag.attrib.get('value') if start_tag is not None else ''
            print(f"Quest {qid} state {state.attrib.get('name')}: start='{s_val}', end='{e_val}'")
