import xml.etree.ElementTree as ET

tree_info = ET.parse('wz/Quest.wz/QuestInfo.img.xml')
tree_check = ET.parse('wz/Quest.wz/Check.img.xml')
tree_say = ET.parse('wz/Quest.wz/Say.img.xml')

for qid in range(8240, 8260):
    sqid = str(qid)
    qinfo = tree_info.getroot().find(f".//imgdir[@name='{sqid}']")
    if qinfo is not None:
        name = qinfo.find("string[@name='name']")
        parent = qinfo.find("string[@name='parent']")
        autoStart = qinfo.find("int[@name='autoStart']")
        print(f"Quest {sqid}: name='{name.attrib.get('value') if name is not None else ''}', parent='{parent.attrib.get('value') if parent is not None else ''}', autoStart={autoStart.attrib.get('value') if autoStart is not None else 'None'}")
        
        qcheck = tree_check.getroot().find(f".//imgdir[@name='{sqid}']")
        if qcheck is not None:
            for state in qcheck.findall('imgdir'):
                sname = state.attrib.get('name')
                npc = state.find("int[@name='npc']")
                lvmin = state.find("int[@name='lvmin']")
                print(f"   state {sname}: npc={npc.attrib.get('value') if npc is not None else 'None'}, lvmin={lvmin.attrib.get('value') if lvmin is not None else 'None'}")
