var status = -1;

function end(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    } else if (mode != 1) {
        //if (mode == 0)
        qm.sendNext("#b(Necesitas pensar en esto por un segundo...)#k");
        qm.dispose();
        return;
    }

    if (status == 0) {
        qm.sendNext("¿Conseguiste matar a #o9001013#? Jajaja... eres mi maestro, de hecho. Bien, ahora dame el Jade Rojo que encontraste allí. Tendré que volver a ponérselo en el cuerpo y... espera, ¿por qué no dices una palabra? ¡No me digas... que no trajiste eso!");
    } else if (status == 1) {
        qm.sendNextPrev("¡¿Qué?! ¿De verdad no trajiste el Jade Rojo? ¿Por qué? ¿Lo olvidaste por completo? Ahh... incluso con la maldición del Mago Negro, y la cantidad de tiempo que ha pasado y todo, nunca pensé que mi maestro resultaría ser estúpido...");
    } else if (status == 2) {
        qm.sendNextPrev("No, no, no puedo permitir que esto me desespere. Aquí es cuando debo mantener la calma y el control, a diferencia de mi maestro...\r\noosah...");
    } else if (status == 3) {
        qm.sendNextPrev("Incluso si regresas allí ahora, el ladrón probablemente logró salir de allí. Esto significa que tendrás que hacer el Red Jade de nuevo. Has hecho uno antes, así que recuerdas los materiales necesarios para hacerlo, ¿verdad? Ahora ve...");
    } else if (status == 4) {
        qm.sendNextPrev("\r\n\r\n\r\n¡ESTE TIPO DEFINITIVAMENTE HA PERDIDO TODOS LOS RECUERDOS!");
    } else if (status == 5) {
        qm.sendNextPrev("...Sin esperanza, sin sueños... ¡¡Nooooo!!");
    } else if (status == 6) {
        qm.completeQuest();
        qm.sendNextPrev("#b(Maha está empezando a ponerse realmente histérica. Será mejor que me vaya ahora mismo. Tal vez Lilin pueda hacer algo al respecto).", 2);
    } else if (status == 7) {
        qm.dispose();
    }
}