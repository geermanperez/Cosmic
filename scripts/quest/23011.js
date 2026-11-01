var status = -1;

function end(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        qm.sendYesNo("Entonces finalmente decidiste convertirte en un mago de batalla, ¿eh? Bueno, todavía puedes cambiar de opinión. Simplemente detén nuestra conversación, abandona esta misión y habla con otro entrenador de clase. Entonces, ¿estás seguro de que quieres convertirte en un mago de batalla? No estoy interesado en enseñarte a menos que estés cien por ciento seguro...");
    } else if (status == 1) {
        if (mode == 0) {
            qm.sendNext("Piénselo detenidamente antes de tomar una decisión.");
        } else {
            if (!qm.isQuestCompleted(23011)) {
                qm.gainItem(1382100);
                qm.gainItem(1142242);
                qm.forceCompleteQuest();
                qm.changeJobById(3200);
                qm.showItemGain(1382100, 1142242);
            }
            qm.sendNext("Está bien, está bien. Bienvenido a la Resistencia, chico. A partir de ahora, desempeñarás el papel de un mago de batalla, un mago feroz siempre dispuesto a liderar a tu grupo en la batalla.");
        }
    } else if (status == 2) {
        qm.sendNextPrev("Pero no digas que eres un mago de batalla, ¿eh? No es necesario tentar a los Black Wings para que vengan a por ti. De ahora en adelante seré tu maestro. Si alguien pregunta, me visitas sólo como estudiante normal, no como miembro de la Resistencia. Te daré lecciones especiales de vez en cuando. Será mejor que no te quedes dormido en clase, ¿entiendes?");
    } else if (status == 3) {
        qm.dispose();
    }
}