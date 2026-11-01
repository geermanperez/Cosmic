var status = -1;

function start(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendAcceptDecline("Su#bDad#Olvidé su lonchera cuando se fue a la granja esta mañana. Quieres#bentrega esta lonchera#ka tu papá en#b#m100030300##k, ¿Miel?");
    } else if (status == 1) {
        if (mode == 0 && type == 15) {//decline
            qm.sendNext("Los buenos niños escuchan a sus madres. Ahora, Evan, sé un buen niño y habla conmigo otra vez.");
            qm.dispose();
        } else {
            if (!qm.isQuestStarted(22003)) {
                if (!qm.haveItem(4032448)) {
                    qm.gainItem(4032448, true);
                }
                qm.forceStartQuest();
            }
            qm.sendNext("Jejeje, ¡mi Evan es un buen chico! Cabeza#bse fue después de salir de la casa#k. Corre hacia tu papá. Estoy seguro de que se está muriendo de hambre.");
        }
    } else if (status == 2) {
        qm.sendNextPrev("Vuelve conmigo si pierdes la lonchera. Le prepararé el almuerzo otra vez.");
    } else if (status == 3) {
        qm.sendImage("UI/tutorial/evan/5/0");
        qm.dispose();
    }
}