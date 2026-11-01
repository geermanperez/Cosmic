/*2101014.js - Lobby and Entrance
 * @author Jvlaple
 * For Jvlaple's AriantPQ
 */

var status = 0;
var toBan = -1;
var choice;
var arenaType;
var arena;
var arenaName;
var type;
var map;
const ExpeditionType = Java.type('server.expeditions.ExpeditionType');
var exped = ExpeditionType.ARIANT;
var exped1 = ExpeditionType.ARIANT1;
var exped2 = ExpeditionType.ARIANT2;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (cm.getPlayer().getMapId() == 980010000) {
            if (cm.getLevel() > 30) {
                cm.sendOk("ya terminaste#rnivel 30#k, por lo tanto ya no puedes participar en esta instancia.");
                cm.dispose();
                return;
            }

            if (status == 0) {
                var expedicao = cm.getExpedition(exped);
                var expedicao1 = cm.getExpedition(exped1);
                var expedicao2 = cm.getExpedition(exped2);

                var channelMaps = cm.getClient().getChannelServer().getMapFactory();
                var startSnd = "What would you like to do? \r\n\r\n\t#e#r(Choose a Battle Arena)#n#k\r\n#b";
                var toSnd = startSnd;

                if (expedicao == null) {
                    toSnd += "#L0#Battle Arena (1) (Empty)#l\r\n";
                } else if (channelMaps.getMap(980010101).getCharacters().isEmpty()) {
                    toSnd += "#L0#Join Battle Arena (1)  Owner (" + expedicao.getLeader().getName() + ")" + " Current Member: " + cm.getExpeditionMemberNames(exped) + "\r\n";
                }
                if (expedicao1 == null) {
                    toSnd += "#L1#Battle Arena (2) (Empty)#l\r\n";
                } else if (channelMaps.getMap(980010201).getCharacters().isEmpty()) {
                    toSnd += "#L1#Join Battle Arena (2)  Owner (" + expedicao1.getLeader().getName() + ")" + " Current Member: " + cm.getExpeditionMemberNames(exped1) + "\r\n";
                }
                if (expedicao2 == null) {
                    toSnd += "#L2#Battle Arena (3) (Empty)#l\r\n";
                } else if (channelMaps.getMap(980010301).getCharacters().isEmpty()) {
                    toSnd += "#L2#Join Battle Arena (3)  Owner (" + expedicao2.getLeader().getName() + ")" + " Current Member: " + cm.getExpeditionMemberNames(exped2) + "\r\n";
                }
                if (toSnd === startSnd) {
                    cm.sendOk("Todo el Battle Arena está actualmente ocupado. Te sugiero que vuelvas más tarde o cambies de canal.");
                    cm.dispose();
                } else {
                    cm.sendSimple(toSnd);
                }
            } else if (status == 1) {
                arenaType = selection;
                expedicao = fetchArenaType();
                if (expedicao == "") {
                    cm.dispose();
                    return;
                }

                if (expedicao != null) {
                    enterArena(-1);
                } else {
                    cm.sendGetText("¿Hasta cuántos participantes pueden unirse a este partido? (2~5 personas)");
                }
            } else if (status == 2) {
                var players = parseInt(cm.getText());   // AriantPQ option limit found thanks to NarutoFury (iMrSiN)
                if (isNaN(players)) {
                    cm.sendNext("Ingrese un valor límite numérico de jugadores permitidos en su instancia.");
                    status = 0;
                } else if (players < 2) {
                    cm.sendNext("El valor límite numérico no debe ser inferior a 2 jugadores.");
                    status = 0;
                } else {
                    enterArena(players);
                }
            }
        }
    }
}

function fetchArenaType() {
    switch (arenaType) {
        case 0 :
            exped = ExpeditionType.ARIANT;
            expedicao = cm.getExpedition(exped);
            map = 980010100;
            break;
        case 1 :
            exped = ExpeditionType.ARIANT1;
            expedicao = cm.getExpedition(exped);
            map = 980010200;
            break;
        case 2 :
            exped = ExpeditionType.ARIANT2;
            expedicao = cm.getExpedition(exped);
            map = 980010300;
            break;
        default :
            exped = null;
            map = 0;
            expedicao = "";
    }

    return expedicao;
}

function enterArena(arenaPlayers) {
    expedicao = fetchArenaType();
    if (expedicao == "") {
        cm.dispose();

    } else if (expedicao == null) {
        if (arenaPlayers != -1) {
            var res = cm.createExpedition(exped, true, 0, arenaPlayers);
            if (res == 0) {
                cm.warp(map, 0);
                cm.getPlayer().dropMessage("Tu arena fue creada exitosamente. Espere a que la gente se una a la batalla.");
            } else if (res > 0) {
                cm.sendOk("Lo sentimos, ¡ya alcanzaste la cuota de intentos para esta expedición! Inténtalo de nuevo otro día...");
            } else {
                cm.sendOk("Se ha producido un error inesperado al iniciar la expedición, inténtalo de nuevo más tarde.");
            }
        } else {
            cm.sendOk("Se ha producido un error inesperado al localizar la expedición, inténtelo de nuevo más tarde.");
        }

        cm.dispose();
    } else {
        if (playerAlreadyInLobby(cm.getPlayer())) {
            cm.sendOk("Lo siento, ya estás dentro del vestíbulo.");
            cm.dispose();
            return;
        }

        var playerAdd = expedicao.addMemberInt(cm.getPlayer());
        if (playerAdd == 3) {
            cm.sendOk("Lo sentimos, el vestíbulo está lleno ahora.");
            cm.dispose();
        } else {
            if (playerAdd == 0) {
                cm.warp(map, 0);
                cm.dispose();
            } else if (playerAdd == 2) {
                cm.sendOk("Lo sentimos, el líder no te permitió entrar.");
                cm.dispose();
            } else {
                cm.sendOk("Error.");
                cm.dispose();
            }
        }
    }
}

function playerAlreadyInLobby(player) {
    return cm.getExpedition(ExpeditionType.ARIANT) != null && cm.getExpedition(ExpeditionType.ARIANT).contains(player) ||
        cm.getExpedition(ExpeditionType.ARIANT1) != null && cm.getExpedition(ExpeditionType.ARIANT1).contains(player) ||
        cm.getExpedition(ExpeditionType.ARIANT2) != null && cm.getExpedition(ExpeditionType.ARIANT2).contains(player);
}