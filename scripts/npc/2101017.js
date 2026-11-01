/*2101017.js
 *Cesar
 *@author Jvlaple
 */

var status = 0;
var toBan = -1;
var choice;
var arena;
var arenaName;
var type;
var map;
const ExpeditionType = Java.type('server.expeditions.ExpeditionType');
var exped;
var expedicao;
var expedMembers;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }

        const GameConstants = Java.type('constants.game.GameConstants');
        if (cm.getPlayer().getMapId() == 980010100 || cm.getPlayer().getMapId() == 980010200 || cm.getPlayer().getMapId() == 980010300) {
            if (cm.getPlayer().getMapId() == 980010100) {
                exped = ExpeditionType.ARIANT;
                expedicao = cm.getExpedition(exped);

            } else if (cm.getPlayer().getMapId() == 980010200) {
                exped = ExpeditionType.ARIANT1;
                expedicao = cm.getExpedition(exped);
            } else {
                exped = ExpeditionType.ARIANT2;
                expedicao = cm.getExpedition(exped);
            }

            if (expedicao == null) {
                cm.dispose();
                return;
            }

            expedMembers = expedicao.getMemberList();
            if (status == 0) {
                if (cm.isLeaderExpedition(exped)) {
                    cm.sendSimple("¿Qué te gustaría hacer?#b\r\n#L1#Ver miembros actuales#l\r\n#L2#Prohibir miembros#l\r\n#L3#comienza la batalla#l\r\n#L4#dejar la arena#l");
                    status = 1;
                } else {
                    var toSend = "Current members inside this arena:\r\n#b";
                    toSend += cm.getExpeditionMemberNames(exped);
                    cm.sendOk(toSend);
                    cm.dispose();
                }
            } else if (status == 1) {
                if (selection == 1) {
                    var toSend = "Current members inside this arena:\r\n#b";
                    toSend += cm.getExpeditionMemberNames(exped);
                    cm.sendOk(toSend);
                    cm.dispose();
                } else if (selection == 2) {
                    var size = expedMembers.size();
                    if (size == 1) {
                        cm.sendOk("Eres el único miembro de la expedición.");
                        cm.dispose();
                        return;
                    }
                    var text = "The following members make up your expedition (Click on them to expel them):\r\n";
                    text += "\r\n\t\t1." + expedicao.getLeader().getName();
                    for (var i = 1; i < size; i++) {
                        text += "\r\n#b#L" + (i + 1) + "#" + (i + 1) + ". " + expedMembers.get(i).getValue() + "#l\n";
                    }
                    cm.sendSimple(text);
                    status = 6;
                } else if (selection == 3) {
                    if (expedicao.getMembers().size() < 1) {
                        cm.sendOk("Necesita un jugador más para comenzar la batalla.");
                        cm.dispose();
                    } else {
                        if (cm.getParty() != null) {
                            cm.sendOk("No puedes ingresar a la batalla como un grupo de grupo.");
                            cm.dispose();
                            return;
                        }

                        var errorMsg = cm.startAriantBattle(exped, cm.getPlayer().getMapId());
                        if (errorMsg != "") {
                            cm.sendOk(errorMsg);
                        }

                        cm.dispose();
                    }
                } else if (selection == 4) {
                    cm.mapMessage(5, "The Leader of the arena left.");
                    expedicao.warpExpeditionTeam(980010000);
                    cm.endExpedition(expedicao);
                    cm.dispose();
                }
            } else if (status == 6) {
                if (selection > 0) {
                    var banned = expedMembers.get(selection - 1);
                    expedicao.ban(banned);
                    cm.sendOk("has prohibido" + banned.getValue() + "de la expedición.");
                    cm.dispose();
                } else {
                    cm.sendSimple(list);
                    status = 2;
                }
            }
        } else if (GameConstants.isAriantColiseumArena(cm.getPlayer().getMapId())) {
            if (cm.getPlayer().getMapId() == 980010101) {
                exped = ExpeditionType.ARIANT;
                expedicao = cm.getExpedition(exped);
            } else if (cm.getPlayer().getMapId() == 980010201) {
                exped = ExpeditionType.ARIANT1;
                expedicao = cm.getExpedition(exped);
            } else {
                exped = ExpeditionType.ARIANT2;
                expedicao = cm.getExpedition(exped);
            }
            if (status == 0) {
                var gotTheBombs = expedicao.getProperty("gotBomb" + cm.getChar().getId());
                if (gotTheBombs != null) {
                    cm.sendOk("Ya te di la bomba, ¡mata el #bScorpio#k ahora!");
                    cm.dispose();
                } else if (cm.canHoldAll([2270002, 2100067], [50, 5])) {
                    cm.sendOk("te he dado (5)#b#eBombs#k#ny (50)#b#eElemento Roca#k#n.\r\nUsa las Rocas Elementales para capturar los escorpiones para#r#eJoyas espirituales#k#n!");
                    expedicao.setProperty("gotBomb" + cm.getChar().getId(), "1");
                    cm.gainItem(2270002, 50);
                    cm.gainItem(2100067, 5);
                    cm.dispose();
                } else {
                    cm.sendOk("Parece que tu inventario está lleno.");
                    cm.dispose();
                }
            }
        } else {
            cm.sendOk("Hola, ¿has oído hablar del Ariant Coliseum Battle Arena? ¡Es un evento competitivo disponible para jugadores de nivel 20 a 30!");
            cm.dispose();
        }
    }
}
