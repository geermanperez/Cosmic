import os
import xml.etree.ElementTree as ET

for root, dirs, files in os.walk('wz'):
    for f in files:
        if f.endswith('.xml'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    if 'Maple 7th Day Market' in content:
                        print(f"Found in {path}")
            except Exception as e:
                pass
