function start() {
    if (cm.c.getPlayer().getMapId() == 103000100 || cm.c.getPlayer().getMapId() == 600010001) {
        cm.sendYesNo("el viaje a" + (cm.c.getPlayer().getMapId() == 103000100 ? "Ciudad Nueva Hoja de Masteria" : "Ciudad de Kerning de la isla Victoria") + "despega cada minuto, comenzando en cada hora, y te costará#b5000 mesos#k. ¿Estás seguro de que quieres comprar?#b#t" + (4031711 + parseInt(cm.c.getPlayer().getMapId() / 300000000)) + "##k?");
    } else if (cm.c.getPlayer().getMapId() == 600010002 || cm.c.getPlayer().getMapId() == 600010004) {
        cm.sendYesNo("¿Quieres salir antes de que empiece el tren? No habrá reembolso.");
    }
}

function action(mode, type, selection) {
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (cm.c.getPlayer().getMapId() == 103000100 || cm.c.getPlayer().getMapId() == 600010001) {
        var item = 4031711 + parseInt(cm.c.getPlayer().getMapId() / 300000000);

        if (!cm.canHold(item)) {
            cm.sendNext("No tienes un espacio etc. disponible.");
        } else if (cm.getMeso() >= 5000) {
            cm.gainMeso(-5000);
            cm.gainItem(item, 1);
            cm.sendNext("Ahí tienes.");
        } else {
            cm.sendNext("No tienes suficientes mesos.");
        }
    } else {
        cm.warp(cm.c.getPlayer().getMapId() == 600010002 ? 600010001 : 103000100);
    }
    cm.dispose();
}