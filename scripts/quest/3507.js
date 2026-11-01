var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (qm.isQuestCompleted(3523) || qm.isQuestCompleted(3524) || qm.isQuestCompleted(3525) || qm.isQuestCompleted(3526) || qm.isQuestCompleted(3527) || qm.isQuestCompleted(3529) || qm.isQuestCompleted(3539)) {
                qm.completeQuest();
                qm.sendOk("Ahora estás lleno de todos tus recuerdos nuevamente. Ahora puedes ir a #m270020000#.");
            } else {
                qm.sendOk("¿Aún no has consultado con tu primer profesor sobre tus recuerdos?");
            }
        } else if (status == 1) {
            qm.dispose();
        }
    }
}