var status = 0;
var cost = 5000;

function start() {
    cm.sendYesNo("Hola, soy el encargado de vender los billetes para el viaje en barco a la Estación Orbis de Ossiria. El viaje a Orbis sale cada 15 minutos, a partir de la hora en punto, y te costará #b" + cost + "mesos#k. ¿Estás seguro de que quieres comprar?#b#t4031045##k?");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.sendNext("Debes tener algunos asuntos que atender aquí, ¿verdad?");
            cm.dispose();
            return;
        }
        status++;
        if (status == 1) {
            if (cm.getMeso() >= cost && cm.canHold(4031045)) {
                cm.gainItem(4031045, 1);
                cm.gainMeso(-cost);
                cm.dispose();
            } else {
                cm.sendOk("¿Estás seguro de que tienes #b?" + cost + "mesos#k? Si es así, le insto a que revise su inventario, etc. y vea si está lleno o no.");
                cm.dispose();
            }
        }
    }
}
