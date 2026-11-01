// NPC - Wall
// Location: Magatia - Home of the Missing Alchemist
// Used to handle quest 3311 - Clue

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (!cm.isQuestStarted(3311)) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            cm.sendYesNo("En medio de la multitud de telarañas, hay una pared detrás que parece tener algo escrito. ¿Quizás deberías mirar más de cerca la pared?");
        }
        else if (status == 1) {
            cm.setQuestProgress(3311, 5);
            cm.sendOk("En una pared llena de graffitis, parece haber una frase que realmente destaca por encima del resto.#bTiene forma de colgante...#k¿Qué significa eso?");
        }
        else {
            cm.dispose();
        }
    }
}