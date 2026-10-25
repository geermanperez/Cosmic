# Apply Problem C fixes

# 1. QuestActionManager.java
with open('src/main/java/scripting/quest/QuestActionManager.java', 'r', encoding='utf-8') as f:
    text = f.read()

assert 'import tools.PacketCreator;' not in text
text = text.replace('import server.quest.actions.MesoAction;', 'import server.quest.actions.MesoAction;\nimport tools.PacketCreator;')
old_dispose = '''    @Override
    public void dispose() {
        QuestScriptManager.getInstance().dispose(this, getClient());
    }'''
new_dispose = '''    @Override
    public void dispose() {
        QuestScriptManager.getInstance().dispose(this, getClient());
        getClient().sendPacket(PacketCreator.enableActions());
    }'''
assert old_dispose in text.replace('\r\n', '\n'), "old_dispose not found in QuestActionManager"
text = text.replace('\r\n', '\n').replace(old_dispose, new_dispose)
with open('src/main/java/scripting/quest/QuestActionManager.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("QuestActionManager updated.")

# 2. NPCScriptManager.java
with open('src/main/java/scripting/npc/NPCScriptManager.java', 'r', encoding='utf-8') as f:
    text = f.read()

old_npc_dispose = '''    public void dispose(NPCConversationManager cm) {
        Client c = cm.getClient();
        c.getPlayer().setCS(false);
        c.getPlayer().setNpcCooldown(System.currentTimeMillis());
        cms.remove(c);
        scripts.remove(c);

        String scriptFolder = (cm.isItemScript() ? "item" : "npc");
        if (cm.getScriptName() != null) {
            resetContext(scriptFolder + "/" + cm.getScriptName() + ".js", c);
        } else {
            resetContext(scriptFolder + "/" + cm.getNpc() + ".js", c);
        }

        c.getPlayer().flushDelayedUpdateQuests();
    }

    public void dispose(Client c) {
        NPCConversationManager cm = cms.get(c);
        if (cm != null) {
            dispose(cm);
        }
    }'''

new_npc_dispose = '''    public void dispose(NPCConversationManager cm) {
        Client c = cm.getClient();
        c.getPlayer().setCS(false);
        c.getPlayer().setNpcCooldown(System.currentTimeMillis());
        cms.remove(c);
        scripts.remove(c);
        c.removeClickedNPC();

        String scriptFolder = (cm.isItemScript() ? "item" : "npc");
        if (cm.getScriptName() != null) {
            resetContext(scriptFolder + "/" + cm.getScriptName() + ".js", c);
        } else {
            resetContext(scriptFolder + "/" + cm.getNpc() + ".js", c);
        }

        c.getPlayer().flushDelayedUpdateQuests();
        c.sendPacket(PacketCreator.enableActions());
    }

    public void dispose(Client c) {
        NPCConversationManager cm = cms.get(c);
        if (cm != null) {
            dispose(cm);
        } else {
            c.removeClickedNPC();
            c.sendPacket(PacketCreator.enableActions());
        }
    }'''

assert old_npc_dispose in text.replace('\r\n', '\n'), "old_npc_dispose not found in NPCScriptManager"
text = text.replace('\r\n', '\n').replace(old_npc_dispose, new_npc_dispose)
with open('src/main/java/scripting/npc/NPCScriptManager.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("NPCScriptManager updated.")

# 3. QuestScriptManager.java
with open('src/main/java/scripting/quest/QuestScriptManager.java', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import server.quest.Quest;', 'import server.quest.Quest;\nimport tools.PacketCreator;')
old_qm_dispose = '''    public void dispose(QuestActionManager qm, Client c) {
        qms.remove(c);
        scripts.remove(c);
        c.getPlayer().setNpcCooldown(System.currentTimeMillis());
        resetContext("quest/" + qm.getQuest() + ".js", c);
        c.getPlayer().flushDelayedUpdateQuests();
    }

    public void dispose(Client c) {
        QuestActionManager qm = qms.get(c);
        if (qm != null) {
            dispose(qm, c);
        }
    }'''

new_qm_dispose = '''    public void dispose(QuestActionManager qm, Client c) {
        qms.remove(c);
        scripts.remove(c);
        c.removeClickedNPC();
        c.getPlayer().setNpcCooldown(System.currentTimeMillis());
        resetContext("quest/" + qm.getQuest() + ".js", c);
        c.getPlayer().flushDelayedUpdateQuests();
        c.sendPacket(PacketCreator.enableActions());
    }

    public void dispose(Client c) {
        QuestActionManager qm = qms.get(c);
        if (qm != null) {
            dispose(qm, c);
        } else {
            c.removeClickedNPC();
            c.sendPacket(PacketCreator.enableActions());
        }
    }'''

assert old_qm_dispose in text.replace('\r\n', '\n'), "old_qm_dispose not found in QuestScriptManager"
text = text.replace('\r\n', '\n').replace(old_qm_dispose, new_qm_dispose)
with open('src/main/java/scripting/quest/QuestScriptManager.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("QuestScriptManager updated.")

# 4. Client.java
with open('src/main/java/client/Client.java', 'r', encoding='utf-8') as f:
    text = f.read()

old_close = '''    public void closePlayerScriptInteractions() {
        this.removeClickedNPC();
        NPCScriptManager.getInstance().dispose(this);
        QuestScriptManager.getInstance().dispose(this);
    }'''

new_close = '''    public void closePlayerScriptInteractions() {
        this.removeClickedNPC();
        NPCScriptManager.getInstance().dispose(this);
        QuestScriptManager.getInstance().dispose(this);
        sendPacket(PacketCreator.enableActions());
    }'''

assert old_close in text.replace('\r\n', '\n'), "old_close not found in Client.java"
text = text.replace('\r\n', '\n').replace(old_close, new_close)
with open('src/main/java/client/Client.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("Client.java updated.")

# 5. NPCMoreTalkHandler.java
with open('src/main/java/net/server/channel/handlers/NPCMoreTalkHandler.java', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import scripting.quest.QuestScriptManager;', 'import scripting.quest.QuestScriptManager;\nimport tools.PacketCreator;')

old_talk = '''        if (lastMsg == 2) {
            if (action != 0) {
                String returnText = p.readString();
                if (c.getQM() != null) {
                    c.getQM().setGetText(returnText);
                    if (c.getQM().isStart()) {
                        QuestScriptManager.getInstance().start(c, action, lastMsg, -1);
                    } else {
                        QuestScriptManager.getInstance().end(c, action, lastMsg, -1);
                    }
                } else {
                    c.getCM().setGetText(returnText);
                    NPCScriptManager.getInstance().action(c, action, lastMsg, -1);
                }
            } else if (c.getQM() != null) {
                c.getQM().dispose();
            } else {
                c.getCM().dispose();
            }
        } else {
            int selection = -1;
            if (p.available() >= 4) {
                selection = p.readInt();
            } else if (p.available() > 0) {
                selection = p.readUnsignedByte();
            }
            if (c.getQM() != null) {
                if (c.getQM().isStart()) {
                    QuestScriptManager.getInstance().start(c, action, lastMsg, selection);
                } else {
                    QuestScriptManager.getInstance().end(c, action, lastMsg, selection);
                }
            } else if (c.getCM() != null) {
                NPCScriptManager.getInstance().action(c, action, lastMsg, selection);
            }
        }'''

new_talk = '''        if (lastMsg == 2) {
            if (action != 0) {
                String returnText = p.readString();
                if (c.getQM() != null) {
                    c.getQM().setGetText(returnText);
                    if (c.getQM().isStart()) {
                        QuestScriptManager.getInstance().start(c, action, lastMsg, -1);
                    } else {
                        QuestScriptManager.getInstance().end(c, action, lastMsg, -1);
                    }
                } else if (c.getCM() != null) {
                    c.getCM().setGetText(returnText);
                    NPCScriptManager.getInstance().action(c, action, lastMsg, -1);
                } else {
                    c.sendPacket(PacketCreator.enableActions());
                }
            } else if (c.getQM() != null) {
                c.getQM().dispose();
            } else if (c.getCM() != null) {
                c.getCM().dispose();
            } else {
                c.sendPacket(PacketCreator.enableActions());
            }
        } else {
            int selection = -1;
            if (p.available() >= 4) {
                selection = p.readInt();
            } else if (p.available() > 0) {
                selection = p.readUnsignedByte();
            }
            if (c.getQM() != null) {
                if (c.getQM().isStart()) {
                    QuestScriptManager.getInstance().start(c, action, lastMsg, selection);
                } else {
                    QuestScriptManager.getInstance().end(c, action, lastMsg, selection);
                }
            } else if (c.getCM() != null) {
                NPCScriptManager.getInstance().action(c, action, lastMsg, selection);
            } else {
                c.sendPacket(PacketCreator.enableActions());
            }
        }'''

assert old_talk in text.replace('\r\n', '\n'), "old_talk not found in NPCMoreTalkHandler"
text = text.replace('\r\n', '\n').replace(old_talk, new_talk)
with open('src/main/java/net/server/channel/handlers/NPCMoreTalkHandler.java', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)
print("NPCMoreTalkHandler updated.")
