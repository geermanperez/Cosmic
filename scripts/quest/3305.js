/*
	QUEST: Re-acquiring Zenumist Cape
	NPC: Carson
*/

var status = -1;

function start(mode, type, selection) {
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
            qm.sendNext("Entonces has perdido el#bcapa zenumista#k. Puedo hacerte otro pero necesitaré algunos materiales.");
        } else if (status == 1) {
            qm.sendAcceptDecline("Para hacer la nueva capa necesito que me traigas.#b5 #t4021003##k, #b10 #t4000021##ky#b10000 mesos#k");
        } else if (status == 2) {
            qm.sendOk("Vuelve conmigo cuando tengas todos los artículos.");
            qm.forceStartQuest();
        } else if (status == 3) {
            qm.dispose();
        }
    }
}
