with open('src/main/java/client/Character.java', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''    public static Character getDefault(Client c) {'''

methods = '''    public void addMaxHp(int gain) {
        setMaxHp(Math.min(30000, getMaxHp() + gain));
        setHp(Math.min(getCurrentMaxHp(), getHp() + gain));
        updateSingleStat(Stat.MAXHP, getMaxHp());
        updateSingleStat(Stat.HP, getHp());
    }

    public void addMaxMp(int gain) {
        setMaxMp(Math.min(30000, getMaxMp() + gain));
        setMp(Math.min(getCurrentMaxMp(), getMp() + gain));
        updateSingleStat(Stat.MAXMP, getMaxMp());
        updateSingleStat(Stat.MP, getMp());
    }

    public static Character getDefault(Client c) {'''

assert target in text.replace('\r\n', '\n'), "target not found in Character.java"
text = text.replace('\r\n', '\n').replace(target, methods)
with open('src/main/java/client/Character.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("Character.java updated successfully.")
