with open('src/main/java/server/maps/MapFactory.java', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''            int hide = DataTool.getInt("hide", life, 0);
            int mobTime = DataTool.getInt("mobTime", life, 0);

            loadLifeRaw(map, Integer.parseInt(id), type, cy, f, fh, rx0, rx1, x, y, hide, mobTime, team);'''

replacement = '''            int hide = DataTool.getInt("hide", life, 0);
            int mobTime = DataTool.getInt("mobTime", life, 0);

            if (cy == 0) {
                if (y != 0) {
                    cy = y;
                } else if (fh != 0 && map.getFootholds() != null) {
                    Foothold foothold = map.getFootholds().findBelow(new Point(x, y));
                    if (foothold != null) {
                        cy = foothold.calculateFooting(x);
                    }
                }
            }

            loadLifeRaw(map, Integer.parseInt(id), type, cy, f, fh, rx0, rx1, x, y, hide, mobTime, team);'''

assert target in text.replace('\r\n', '\n'), "target not found in MapFactory.java"
text = text.replace('\r\n', '\n').replace(target, replacement)
with open('src/main/java/server/maps/MapFactory.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("MapFactory.java updated successfully.")
