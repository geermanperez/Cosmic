import os
import xml.etree.ElementTree as ET

for root, dirs, files in os.walk('wz/Map.wz'):
    for f in files:
        if f.endswith('.xml'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                s = fp.read()
                if '9209001' in s:
                    print(f"Found Mimi 9209001 in {f}")
