import xml.etree.ElementTree as ET

for name in ['QuestInfo', 'Check', 'Act', 'Say']:
    tree = ET.parse(f'wz/Quest.wz/{name}.img.xml')
    for qid in ['8248', '8249']:
        node = tree.getroot().find(f".//imgdir[@name='{qid}']")
        if node is not None:
            print(f"=== {name}.img.xml [{qid}] ===")
            print(ET.tostring(node, encoding='unicode'))
