with open('D:/Everleaf/MapleStory/Quest.wz', 'rb') as f:
    data = f.read()

# search for "8248" in Quest.wz
idx = 0
found = []
while True:
    pos = data.find(b'8248', idx)
    if pos == -1:
        break
    found.append(pos)
    idx = pos + 4

print(f"Found {len(found)} occurrences of 8248 in client Quest.wz")
for pos in found:
    start = max(0, pos - 100)
    end = min(len(data), pos + 100)
    snippet = data[start:end]
    print(f"Pos {pos}: {snippet}")
