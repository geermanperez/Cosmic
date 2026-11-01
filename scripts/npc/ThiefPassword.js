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
        cm.sendGetText("Una voz sospechosa atraviesa el silencio. #bPassword#k!");
    } else if (status == 1) {
        if (cm.getText() == "Open Sesame") {
            if (cm.isQuestCompleted(3925)) {
                cm.warp(260010402, 1);
            } else {
                cm.playerMessage(5, "Aunque dijiste la respuesta correcta, la puerta no se moverá.");
            }

            cm.dispose();
        } else {
            cm.sendOk("#r¡Mal!");
        }
    } else if (status == 2) {
        cm.dispose();
    }
}