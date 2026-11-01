var status = 0;
var ticketSelection = -1;
var text = "Here's the ticket reader.";
var hasTicket = false;
var NLC = false;
var em;

function start() {
    cm.sendSimple("Elige tu destino.\n\r\n#L0##bCentro Comercial Plaza Kerning#l\n\n\r\n#L1#Ingresar al sitio de construcción#l\r\n#L2#Ciudad Nueva Hoja#l");
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        cm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 1) {
        if (selection == 0) {
            var em = cm.getEventManager("KerningTrain");
            if (!em.startInstance(cm.getPlayer())) {
                cm.sendOk("El vagón de pasajeros ya está lleno. Inténtalo de nuevo un poco más tarde.");
            }

            cm.dispose();

        } else if (selection == 1) {
            if (cm.haveItem(4031036) || cm.haveItem(4031037) || cm.haveItem(4031038)) {
                text += " You will be brought in immediately. Which ticket you would like to use?#b";
                for (var i = 0; i < 3; i++) {
                    if (cm.haveItem(4031036 + i)) {
                        text += "\r\n#b#L" + (i + 1) + "##t" + (4031036 + i) + "#";
                    }
                }
                cm.sendSimple(text);
                hasTicket = true;
            } else {
                cm.sendOk("¡Parece que no tienes billete!");
                cm.dispose();

            }
        } else if (selection == 2) {
            if (!cm.haveItem(4031711) && cm.getPlayer().getMapId() == 103000100) {
                cm.sendOk("¡Parece que no tienes billete! Puedes comprar uno en Bell.");
                cm.dispose();
                return;
            }

                cm.sendYesNo("Parece que hay mucho espacio para este viaje. Por favor tenga su boleto listo para que pueda dejarle entrar. Llegará inmediatamente. ¿Qué opinas? ¿Quieres subirte a este paseo?");

        }
    } else if (status == 2) {
        if (hasTicket) {
            ticketSelection = selection;
            if (ticketSelection > -1) {
                cm.gainItem(4031035 + ticketSelection, -1);
                cm.warp(103000897 + (ticketSelection * 3), "st00");  // thanks IxianMace for noticing a few scripts having misplaced warp SP's
                hasTicket = false;
                cm.dispose();
                return;
            }
        }

        if (cm.haveItem(4031711)) {

                cm.gainItem(4031711, -1);
                cm.warp(600010001, 0);


            cm.dispose();

        }
    }
}
