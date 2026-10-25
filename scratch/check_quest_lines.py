with open('wz/Quest.wz/Check.img.xml', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'imgdir name="8248"' in l or 'imgdir name="8249"' in l:
        print(f'{i+1}: {l.rstrip()}')
        for j in range(i, min(i+20, len(lines))):
            print(f'  {j+1}: {lines[j].rstrip()}')

print("--- QuestInfo ---")
with open('wz/Quest.wz/QuestInfo.img.xml', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'imgdir name="8248"' in l or 'imgdir name="8249"' in l:
        print(f'{i+1}: {l.rstrip()}')
        for j in range(i, min(i+20, len(lines))):
            print(f'  {j+1}: {lines[j].rstrip()}')
