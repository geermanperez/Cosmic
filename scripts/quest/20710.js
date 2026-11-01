/*
	Author: DietStory v1.02 dev team
	NPC: Matthias
	Quest: Hidden Inside the Trash Can
*/


var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
        return;
    } else if (mode == 0 && status == 0) {
        qm.sendOk("¿Qué? ¿Estás rechazando la misión? Bien, hazlo así. Lo informaré directamente a #p1101002#.");
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }


    if (status == 0) {
        qm.sendAcceptDecline("Realmente no me infundes confianza, pero como eres un Caballero Cygnus y todo... y como nadie más puede ir a buscar ahora mismo... Bien, déjame explicarte de qué se trata esta misión.");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.dispose();
    }
}