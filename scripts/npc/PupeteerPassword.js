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
        if (cm.isQuestStarted(21728)) {
            cm.sendOk("Buscas pistas del Titiritero, pero parece que una fuerza poderosa bloquea el camino... Será mejor que regreses a#b#p1061019##k.");
            cm.setQuestProgress(21728, 21761, 0);
            cm.dispose();
            return;
        }

        cm.sendGetText("Una voz sospechosa atraviesa el silencio. #bPassword#k!");
    } else if (status == 1) {
        if (cm.getText() == "Francis is a genius Puppeteer!") {
            if (cm.isQuestStarted(20730) && cm.getQuestProgressInt(20730, 9300285) == 0) {
                cm.warp(910510001, 1);
            } else if (cm.isQuestStarted(21731) && cm.getQuestProgressInt(21731, 9300346) == 0) {
                cm.warp(910510001, 1);
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