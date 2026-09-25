import re

with open('wz/String.wz/Map.img.xml', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

keywords = ['chryse', 'xerxes', 'golden temple', 'ravana', 'tera forest', 'future henesys', 'door to the future', 'castle wall', 'crimsonwood']
for m in re.finditer(r'<imgdir name="(\d+)">\s*<string name="streetName" value="([^"]*)"\s*/>\s*<string name="mapName" value="([^"]*)"\s*/>', text):
    mid, street, name = m.group(1), m.group(2), m.group(3)
    full = (street + ' ' + name).lower()
    for kw in keywords:
        if kw in full:
            print(f"{kw.upper()} -> {mid}: {street} - {name}")
            break
