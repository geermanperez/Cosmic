from test_wz_read import Reader, KEY

data = open('D:/Everleaf/MapleStory/Quest.wz', 'rb').read()
r = Reader(data)
r.take(4)
r.number('Q')
start = r.number('I')
r.pos = start

count = r.integer()
print("Root entries count:", count)
for i in range(count):
    kind = r.number('B')
    name = r.string_block()
    fsize = r.integer()
    csum = r.integer()
    offset = r.number('I')
    print(f"Entry {i}: kind={kind}, name={name}, size={fsize}, offset={offset}")
