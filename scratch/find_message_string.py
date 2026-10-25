import os

for folder in ['wz/String.wz', 'wz/UI.wz', 'wz/Etc.wz']:
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.xml'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                    if 'send you a message' in content:
                        print(f"Match 'send you a message': {p}")
                    if 'Someone in' in content:
                        print(f"Match 'Someone in': {p}")
