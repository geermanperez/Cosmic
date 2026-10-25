import os

targets = [
    'c:/Users/germa/OneDrive/Escritorio/YunaMS',
    'd:/Everleaf'
]

search_phrases = [
    b'Someone in MapleStory',
    b'would like to send you a message',
    b'Maple 7th Day Market'
]

for base in targets:
    for root, dirs, files in os.walk(base):
        # skip large media / dlls
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.png', '.mp3', '.wav', '.zip', '.rar', '.exe', '.dll', '.class']:
                continue
            path = os.path.join(root, f)
            try:
                data = open(path, 'rb').read()
                for phrase in search_phrases:
                    if phrase.lower() in data.lower():
                        print(f"Match '{phrase.decode()}' in {path}")
            except Exception:
                pass
