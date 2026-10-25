with open('src/main/java/scripting/npc/NPCConversationManager.java', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''    /** Disabled until crash-safe grant + reconciliation have passed testing. */
    public boolean claimRebirthPassReward() {
        return false;
    }'''

replacement = '''    /** Executes transactional claim for EverleafMS Rebirth Pass. Returns result code. */
    public int claimRebirthPassReward() {
        return server.events.RebirthPassService.claim(getPlayer());
    }'''

assert target in text.replace('\r\n', '\n'), "target not found in NPCConversationManager.java"
text = text.replace('\r\n', '\n').replace(target, replacement)
with open('src/main/java/scripting/npc/NPCConversationManager.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("NPCConversationManager.java updated successfully.")
