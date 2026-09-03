"""Emit one validated client equip and its name as JSON; never modify files."""
import argparse
import json
import mmap
from pathlib import Path
import xml.etree.ElementTree as ET
import audit_yuna_wz as wz


def image(client, archive, selector):
    with (client / archive).open('rb') as f, mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as data:
        matches = [e for e in wz.index_archive(data) if selector(e['path'])]
        if len(matches) != 1:
            raise ValueError(f'Expected one source image, got {len(matches)}')
        e = matches[0]
        return e['path'], wz.parse_image(data[e['offset']:e['offset']+e['size']],Path(e['path']).name)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--client', type=Path, required=True)
    p.add_argument('--key-stream', type=Path, required=True)
    p.add_argument('--server-wz', type=Path, required=True)
    p.add_argument('--item', type=int, required=True)
    args = p.parse_args()
    key = args.key_stream.read_bytes()
    if not key.startswith(wz.KEY): raise ValueError('Wrong client keystream')
    wz.KEY = key
    name = f'{args.item:08d}.img'
    path, root = image(args.client,'Character.wz',lambda path: Path(path).name == name)
    if (args.server_wz / 'Character.wz' / (path+'.xml')).exists():
        raise ValueError('Refusing to overwrite existing server item')
    info = root.find("./imgdir[@name='info']")
    if info is None: raise ValueError('Missing equip info')
    _, names = image(args.client,'String.wz',lambda path: path == 'Eqp.img')
    found = [(cat.get('name'), node) for cat in names.iter('imgdir') for node in cat
             if node.get('name') == str(args.item)]
    if len(found) != 1: raise ValueError('Missing or ambiguous item name')
    cat, node = found[0]
    existing_names = ET.parse(args.server_wz / 'String.wz' / 'Eqp.img.xml').getroot()
    if any(n.get('name') == str(args.item) for n in existing_names.iter('imgdir')):
        raise ValueError('Item name already exists; review manually')
    ET.indent(root, space='  ')
    ET.indent(node, space='  ', level=3)
    print(json.dumps({'path':'Character.wz/'+path+'.xml',
                      'xml':ET.tostring(root, encoding='unicode', xml_declaration=True)+'\n',
                      'category':cat, 'name_xml':'      '+ET.tostring(node,encoding='unicode').rstrip()+'\n'},
                     ensure_ascii=True))


if __name__ == '__main__': main()
