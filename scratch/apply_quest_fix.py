import sys

# 1. Update Check.img.xml
with open('wz/Quest.wz/Check.img.xml', 'rb') as f:
    content = f.read()

target1 = b'  <imgdir name="8248">\r\n    <imgdir name="0">\r\n      <int name="npc" value="9209001"/>\r\n      <int name="lvmin" value="30"/>\r\n    </imgdir>'
replacement1 = b'  <imgdir name="8248">\r\n    <imgdir name="0">\r\n      <int name="npc" value="9209001"/>\r\n      <int name="lvmin" value="30"/>\r\n      <string name="end" value="2010010100"/>\r\n    </imgdir>'

assert target1 in content, "target1 not found in Check.img.xml"
content = content.replace(target1, replacement1, 1)

target2 = b'    <imgdir name="0">\r\n      <int name="npc" value="9209001"/>\r\n      <imgdir name="quest">\r\n        <imgdir name="0">\r\n          <int name="id" value="8248"/>\r\n          <int name="state" value="2"/>\r\n        </imgdir>\r\n      </imgdir>\r\n      <int name="lvmin" value="30"/>\r\n    </imgdir>\r\n  </imgdir>\r\n  <imgdir name="8251">'
replacement2 = b'    <imgdir name="0">\r\n      <int name="npc" value="9209001"/>\r\n      <imgdir name="quest">\r\n        <imgdir name="0">\r\n          <int name="id" value="8248"/>\r\n          <int name="state" value="2"/>\r\n        </imgdir>\r\n      </imgdir>\r\n      <int name="lvmin" value="30"/>\r\n      <string name="end" value="2010010100"/>\r\n    </imgdir>\r\n  </imgdir>\r\n  <imgdir name="8251">'

assert target2 in content, "target2 not found in Check.img.xml"
content = content.replace(target2, replacement2, 1)

with open('wz/Quest.wz/Check.img.xml', 'wb') as f:
    f.write(content)
print("Check.img.xml updated successfully.")

# 2. Update QuestInfo.img.xml
with open('wz/Quest.wz/QuestInfo.img.xml', 'rb') as f:
    info_content = f.read()

target_info1 = b'    <string name="2" value="I completed #b#p9209001##k&apos;s first task. Turned out that the main event became even more attractive."/>\r\n    <int name="area" value="50"/>\r\n  </imgdir>'
replacement_info1 = b'    <string name="2" value="I completed #b#p9209001##k&apos;s first task. Turned out that the main event became even more attractive."/>\r\n    <int name="area" value="0"/>\r\n  </imgdir>'

assert target_info1 in info_content, "target_info1 not found in QuestInfo.img.xml"
info_content = info_content.replace(target_info1, replacement_info1, 1)

target_info2 = b'    <string name="2" value="I completed #b#p9209001##k&apos;s final task. The public seems to have enjoyed a lot the events of the Maple 7th Day Market."/>\r\n    <int name="area" value="50"/>\r\n  </imgdir>'
replacement_info2 = b'    <string name="2" value="I completed #b#p9209001##k&apos;s final task. The public seems to have enjoyed a lot the events of the Maple 7th Day Market."/>\r\n    <int name="area" value="0"/>\r\n  </imgdir>'

assert target_info2 in info_content, "target_info2 not found in QuestInfo.img.xml"
info_content = info_content.replace(target_info2, replacement_info2, 1)

with open('wz/Quest.wz/QuestInfo.img.xml', 'wb') as f:
    f.write(info_content)
print("QuestInfo.img.xml updated successfully.")
