status = -1;
close = false;
oldSelection = -1;
var em;

function start() {
    var text = "Here's the ticket reader.";
    var hasTicket = false;
    if (cm.haveItem(4031713) && cm.getPlayer().getMapId() == 600010001) {
        text += "\r\n#b#L0##t4031713#";
        hasTicket = true;
    }
    if (!hasTicket) {
        cm.sendOk("¡Parece que no tienes billete! Puedes comprar uno en Bell.");
        cm.dispose();
    } else {
        cm.sendSimple(text);
    }
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0) {
            cm.sendNext("Debes tener algunos asuntos que atender aquí, ¿verdad?");
        }
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (selection == 0) {

                cm.sendYesNo("Parece que hay mucho espacio para este viaje. Por favor tenga su boleto listo para que pueda dejarle entrar. Llegará inmediatamente. ¿Qué opinas? ¿Quieres subirte a este paseo?");

        }
        oldSelection = selection;
    } else if (status == 1) {
        if (oldSelection == 0 && cm.haveItem(4031713)) {

                cm.gainItem(4031713, -1);
                cm.warp(103000100, 0);

        } else {
            cm.sendNext("Lo sentimos, ¡necesitas un boleto para ingresar!");
        }

        cm.dispose();
    }
}
