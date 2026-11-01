var status = 0;
var em;
var eim;

function sendBaseText() {
    cm.sendOk("El acceso está restringido al público.");
    cm.dispose();
}

function start() {
    em = cm.getEventManager("q3239");
    if (em != null)
        eim = cm.getEventInstance();

    if (em == null) { // No event handler
        sendBaseText();
        return;
    }
    else if (eim == null && !cm.isQuestStarted(3239)) { // Not in instance, quest is not in progress
        sendBaseText();
        return;
    }

    if (eim == null) { // Not in instance
        cm.sendYesNo("¿Estás listo para entrar?#b#m922000000##k?");
    }
    else { // Inside the instance
        cm.sendYesNo("¿Estás listo para dejar este lugar?");
    }
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    if (eim == null) { // Not in instance, ready to enter
        cm.removeAll(4031092); // This handling is done in the portal script and in the event end, just for legacy purposes here
        if (!em.startInstance(cm.getPlayer())) {
            cm.sendOk("Alguien más ya está reuniendo algunas piezas para mí. Espere hasta que se despeje el área.");
        }
    }
    else { // Inside the instance, ready to exit
        eim.removePlayer(cm.getPlayer()); // This will end the event and warp the player out
    }
    cm.dispose();
}