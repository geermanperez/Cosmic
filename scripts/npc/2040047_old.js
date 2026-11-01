/**
 * @author: Eric
 * @npc: Sgt. Anderson
 * @maps: Ludibrium PQ Maps
 * @func: Ludi PQ (Warps you out)
 */

var status = -1;

function start() {
    if (cm.getMapId() != 922010000 && cm.getMapId() != 922010800) {
        cm.sendYesNo("Tendrás que empezar de nuevo desde cero si quieres intentar esta misión después de abandonar esta etapa. ¿Estás seguro de que quieres abandonar este mapa?");
    } else if (cm.getMapId() == 922010800) {
        cm.sendSimple("¿Necesitas ayuda?#b\r\n#L0#Necesito un títere de plataforma.#l\r\n#L1#Quiero salir de aquí.#l#k");
    } else {
        cm.removeAll(4001022); // pass of dimension
        cm.removeAll(4001023);
        cm.removeAll(4001454); // platform puppet
        cm.warp(221024500, 0);
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0 && (status == 0 || status == -1)) {
        cm.sendNext("Veo. ¡Reúne las fuerzas de los miembros de tu grupo y esfuérzate más!");
        cm.dispose();
        return;
    } else {
        status--;
    }
    if (status == 0) {
        if (cm.getMapId() == 922010800) {
            if (selection == 0) {
                cm.sendNext("Has recibido una marioneta de plataforma. Si lo colocas en la plataforma, tendrá el mismo efecto que si estuviera parado allí.\r\nRecuerda, sin embargo, que este es un elemento que solo se puede usar aquí.");
                cm.gainItem(4001454, 1);
                cm.dispose();
            } else {
                cm.sendYesNo("Tendrás que empezar de nuevo desde cero si quieres intentar esta misión después de abandonar esta etapa. ¿Estás seguro de que quieres abandonar este mapa?");
            }
        } else {
            var eim = cm.getPlayer().getEventInstance();
            if (eim != null) {
                eim.removePlayer(cm.getPlayer());
            } else {
                cm.warp(922010000, 0);
            }
            cm.dispose();
        }
    } else if (status == 1) {
        var eim = cm.getPlayer().getEventInstance();
        if (eim != null) {
            eim.removePlayer(cm.getPlayer());
        } else {
            cm.warp(922010000, 0);
        }
        cm.dispose();
    }
}