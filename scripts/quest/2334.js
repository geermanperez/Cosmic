/*
	QUEST: The Identity of the Princess
	NPC: Violetta
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }


    if (status == 0) {
        qm.forceStartQuest();
        qm.sendNext("Muchas gracias,#b#h ##k. Eres el héroe que ha salvado a nuestro imperio del peligro. Estoy muy agradecido por lo que has hecho. No sé cómo agradecerte. Y por favor entiende por qué no puedo mostrarte mi cara.");
    } else if (status == 1) {
        qm.sendNextPrev("Es humillante decir esto, pero desde que era un bebé, mi familia ha mantenido mi rostro oculto al mundo. Temían que los hombres se enamoraran perdidamente de mí. Me he acostumbrado tanto que incluso evito a las mujeres. Lo sé, es de mala educación de mi parte darle la espalda al héroe, pero necesitaré algo de tiempo para reunir coraje antes de poder saludarte cara a cara.");
    } else if (status == 2) {
        qm.sendNextPrev("Ya veo...\r\n#b(Wow, ¿qué tan bonita podría ser?)", 2);
    } else if (status == 3) {
        qm.sendNextPrev("#b(¿Qué diablos--)", 2);
    } else if (status == 4) {
        qm.sendNextPrev("#b(¡¿Eso es lo que se considera bonito en el mundo de las setas?!)", 2);
    } else if (status == 5) {
        qm.sendNextPrev("Soy tan tímida que me estoy sonrojando. De todos modos, gracias,#b#h ##k.");
    } else if (status == 6) {
        qm.forceStartQuest();
        qm.gainExp(1000);
        qm.forceCompleteQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {}