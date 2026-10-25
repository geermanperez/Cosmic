import xml.etree.ElementTree as ET

tree_info = ET.parse('wz/Quest.wz/QuestInfo.img.xml')
tree_check = ET.parse('wz/Quest.wz/Check.img.xml')

# find all quests where check has npc in (9209000, 9209001, 9209008) or parent contains Market
for q in tree_info.getroot().findall('imgdir'):
    qid = q.attrib.get('name')
    qcheck = tree_check.getroot().find(f".//imgdir[@name='{qid}']")
    parent = q.find("string[@name='parent']")
    name = q.find("string[@name='name']")
    autoStart = q.find("int[@name='autoStart']")
    
    npcs = set()
    if qcheck is not None:
        for npc_tag in qcheck.findall('.//int[@name="npc"]'):
            npcs.add(npc_tag.attrib.get('value'))
            
    p_val = parent.attrib.get('value') if parent is not None else ''
    n_val = name.attrib.get('value') if name is not None else ''
    as_val = autoStart.attrib.get('value') if autoStart is not None else ''
    
    if any(n in npcs for n in ['9209000', '9209001', '9209008', '9209100']) or 'Market' in p_val or 'Market' in n_val or '7th Day' in p_val or '7th Day' in n_val:
        print(f"QID {qid}: name='{n_val}', parent='{p_val}', autoStart='{as_val}', npcs={npcs}")
