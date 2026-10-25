import xml.etree.ElementTree as ET

tree_info = ET.parse('wz/Quest.wz/QuestInfo.img.xml')
for qid in ['8248', '8249']:
    q = tree_info.getroot().find(f".//imgdir[@name='{qid}']")
    print(f"Quest {qid}:")
    for child in q:
        print(f"  {child.tag} name='{child.attrib.get('name')}' value='{child.attrib.get('value')}'")
