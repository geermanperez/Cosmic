import xml.etree.ElementTree as ET

tree = ET.parse('wz/Quest.wz/Check.img.xml')
tags = set()
for q in tree.getroot().findall('imgdir'):
    for state in q.findall('imgdir'):
        for child in state:
            tags.add(child.attrib.get('name'))
print("All check tags in Check.img.xml:", sorted(list(tags)))
