import os
import xml.etree.ElementTree as ET

def find_item(folder, pattern):
    results = []
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.xml'):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                    if pattern.lower() in content.lower():
                        results.append((f, p))
    return results

print("=== Search Return to Nearest Town ===")
with open('wz/String.wz/Consume.img.xml', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()
    for line in text.splitlines():
        if 'Return to' in line or 'Return Scroll' in line:
            print(line[:100])

print("=== Search 2x EXP in Cash / Consume ===")
with open('wz/String.wz/Cash.img.xml', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()
    for line in text.splitlines():
        if '2X EXP' in line or '2x EXP' in line or 'EXP Coupon' in line:
            print(line[:100])

with open('wz/String.wz/Consume.img.xml', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()
    for line in text.splitlines():
        if '2X EXP' in line or '2x EXP' in line or 'EXP Coupon' in line or 'Special EXP' in line:
            print(line[:100])
