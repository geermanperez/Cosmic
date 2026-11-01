/*
	NPC Name: 		Nineheart
	Description: 		Quest - Cygnus movie Intro
*/
var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.sendOk("Habla conmigo después de que hayas decidido lo que realmente quieres hacer. Elijas lo que elijas, no te perderás ni perderás privilegios, así que no te lo tomes demasiado en serio...");
        qm.dispose();
    } else {
        if (mode == 0 && type > 0 || selection == 1) {
            qm.sendOk("Habla conmigo después de que hayas decidido lo que realmente quieres hacer. Elijas lo que elijas, no te perderás ni perderás privilegios, así que no te lo tomes demasiado en serio...");
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("Puedo decir que has trabajado muy duro al ver que ya estás en el nivel 10. Creo que ahora es el momento de que te conviertas en un Noble y te conviertas oficialmente en un Caballero en entrenamiento. Pero antes de hacerlo quiero preguntarte una cosa. ¿Has decidido en qué Caballero te gustaría convertirte?");
        } else if (status == 1) {
            qm.sendNextPrev("No existe un único camino para convertirse en Caballero. De hecho, hay cinco preparados para usted. Depende de usted elegir qué camino le gustaría tomar, pero definitivamente debería ser algo de lo que no se arrepienta. Por eso... me ofrezco a mostrarte cómo lucirás una vez que te conviertas en Caballero.");
        } else if (status == 2) {
            qm.sendSimple("¿Qué opinas? ¿Estás interesado en verte como el líder de los Caballeros? Si ya has decidido qué tipo de Caballero te gustaría convertirte, entonces no necesariamente tendrás que mirarlo...\r\n\r\n#b#L0#Muéstrame cómo me vería como líder de los Caballeros.#l ..#b#L1#No, estoy bien.");
        } else if (status == 3) {
            qm.sendYesNo("¿Le gustaría comprobarlo usted mismo ahora mismo? Pronto saldrá un breve clip. Prepárate para lo que estás a punto de presenciar.");
        } else if (status == 4) {
            qm.forceStartQuest();
            qm.forceCompleteQuest();
            qm.warp(913040100, 0);
            qm.dispose();
        }
    }
}
