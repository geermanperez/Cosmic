var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }


    if (status == 0) {
        cm.sendGetText("La entrada del Santuario Sellado... ¡#bPassword#k!");
    } else if (status == 1) {
        if (cm.getWarpMap(925040100).countPlayers() > 0) {
            cm.sendOk("Alguien ya está asistiendo al Santuario Sellado.");
            cm.dispose();
            return;
        }
        if (cm.getText() == "Actions speak louder than words") {
            if (cm.isQuestStarted(21747) && cm.getQuestProgressInt(21747, 9300351) == 0) {
                cm.warp(925040100, 0);
            } else {
                cm.playerMessage(5, "Aunque dijiste la respuesta correcta, algunas fuerzas misteriosas están bloqueando el camino.");
            }

            cm.dispose();
        } else {
            cm.sendOk("#r¡Mal!");
        }
    } else if (status == 2) {
        cm.dispose();
    }
}