/*
	NPC Name: 		Cygnus
	Description: 		Quest - Encounter with the Young Queen
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        qm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        if (status == 2) {
            qm.sendNext("Mmmm, no hay nada de qué preocuparse. Esto será muy sencillo para alguien de tu nivel. Reúne tu coraje y avísame cuando estés listo.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("¿Mmm? #p1101002# te envió, ¿eh? Debes ser el novato que se unió recientemente a Cygnus Knights. ¡Bienvenido y encantado de conocerte! Mi nombre es #p1102000#. Soy el instructor de entrenamiento que entrena a todas las nobles como tú. Por supuesto, no soy un humano como puedes ver.");
    } else if (status == 1) {
        qm.sendNextPrev("Nos llamamos Piyos. Has visto a #p1101001# que está al lado de la Emperatriz todo el tiempo, ¿no? Los piyos son de la misma familia que #p1101001#, pero pertenecemos a tipos diferentes. Por supuesto, no nos has visto a ninguno de nosotros ya que sólo vivimos en Ereve. Te acostumbrarás a Piyos en poco tiempo.");
    } else if (status == 2) {
        qm.sendNextPrev("Ah, ¿y sabías que no hay monstruos en Ereve? Ni siquiera una pizca de maldad se atreve a entrar en Ereve. Pero no te preocupes. Podrás entrenar con monstruos ilusorios creados por #p1101001# llamados Mimis.");
    } else if (status == 3) {
        qm.sendAcceptDecline("¡Pareces preparado! Viendo lo que has logrado, creo que deberías lanzarte directamente a cazar Mimis más avanzadas. ¿Qué tal si cazas?#b15 #r#o100122#está en#m130010100##k#k? Utilice el portal de la izquierda para llegar al#bBosque de entrenamiento II#k.");
    } else if (status == 4) {
        qm.guideHint(12);
        qm.forceStartQuest(20020);
        qm.forceCompleteQuest(20100);
        qm.forceStartQuest();
        qm.dispose();
    }
}

function end(mode, type, selection) {
}