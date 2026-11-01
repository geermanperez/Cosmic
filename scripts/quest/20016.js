/*
	NPC Name: 		Nineheart
	Description: 		Quest - Do you know the black Magician?
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
        if (status == 8) {
            qm.sendNext("Ah, ¿todavía tienes algunas preguntas? Vuelve a hablarme y te lo explico desde el principio.");
            qm.dispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        qm.sendNext("Hola, #h0#. Bienvenidos a #p1101000# Caballeros. Mi nombre es #p1101002# y actualmente me desempeño como táctico de la joven emperatriz. Será mejor que nos conozcamos ya que nos veremos mucho. ¡Ja ja!");
    } else if (status == 1) {
        qm.sendNextPrev("Estoy seguro de que tienes muchas preguntas ya que todo sucedió muy rápido. Te lo explicaré todo, uno por uno, desde dónde estás hasta para qué estás aquí.");
    } else if (status == 2) {
        qm.sendNextPrev("Esta isla se llama Ereve. Gracias a la magia de la Emperatriz, esta isla generalmente flota como un barco en el cielo y patrulla alrededor de Maple World. Sin embargo, por ahora nos hemos detenido aquí por una razón.");
    } else if (status == 3) {
        qm.sendNextPrev("La joven emperatriz es la gobernante de Maple World. ¿Qué? ¿Es la primera vez que oyes hablar de ella? Ah, sí. Bueno, ella es la gobernante de Maple World pero no le gusta controlarlo. Ella observa desde lejos para asegurarse de que todo esté bien. Bueno, al menos ese es su papel habitual.");
    } else if (status == 4) {
        qm.sendNextPrev("Pero ese no es el caso ahora. Hemos estado encontrando señales por todo Maple World que presagian el resurgimiento del Mago Negro. ¡No podemos permitir que el Mago Negro regrese para aterrorizar a Maple World como lo hizo en el pasado!");
    } else if (status == 5) {
        qm.sendNextPrev("Pero eso fue hace mucho tiempo y la gente hoy en día no se da cuenta de lo aterrador que es el Mago Negro. Todos nos hemos echado a perder por el pacífico Maple World que disfrutamos hoy y hemos olvidado lo caótico y aterrador que alguna vez fue Maple World. ¡Si no hacemos algo, el Mago Negro volverá a gobernar Maple World!");
    } else if (status == 6) {
        qm.sendNextPrev("Por eso la joven emperatriz ha decidido tomar el asunto en sus propias manos. Está formando una caballería de valientes Maplers para derrotar al Mago Negro de una vez por todas. Sabes lo que tienes que hacer, ¿verdad? Estoy seguro de que tienes una idea ya que tú mismo te inscribiste para ser Caballero.");
    } else if (status == 7) {
        qm.sendNextPrev("Tenemos que hacernos más fuertes para poder derrotar al Mago Negro si revive. Nuestro objetivo principal es evitar que destruya Maple World, y tú desempeñarás un papel destacado en ello.");
    } else if (status == 8) {
        qm.sendAcceptDecline("Con esto concluye mi explicación. ¿He respondido todas tus preguntas?\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#fUI/UIWindow.img/QuestIcon/8/0# 380 exp.");
    } else if (status == 9) {
        if (!qm.isQuestStarted(20016)) {
            qm.forceStartQuest();
            qm.gainExp(380);
        }
        qm.sendNext("Me alegra que tengas clara nuestra situación actual, pero sabes, en tu nivel actual, ni siquiera eres lo suficientemente fuerte para enfrentar a los secuaces del Mago Negro, y mucho menos al propio Mago Negro. De hecho, ni siquiera los secuaces de sus secuaces. ¿Cómo protegerás Maple World en tu nivel actual?");
    } else if (status == 10) {
        qm.sendNextPrev("Aunque has sido aceptado como caballero, todavía no puedes ser reconocido como caballero. No eres un Caballero Oficial porque ni siquiera eres un Caballero en Entrenamiento. Si permaneces en tu nivel actual, no serás más que el manitas de #p1101000# Knights.");
    } else if (status == 11) {
        qm.sendNextPrev("Pero nadie empieza como un Caballero fuerte el primer día. La Emperatriz no quería a alguien fuerte. Quería a alguien con coraje a quien pudiera convertir en un Caballero fuerte mediante un entrenamiento riguroso. Entonces, primero debes convertirte en un Caballero en Entrenamiento. Hablaremos de tus misiones cuando llegues a ese punto.");
    } else if (status == 12) {
        qm.forceCompleteQuest();
        qm.sendPrev("Toma el portal de la izquierda para llegar al Training Forest. Allí encontrarás a #p1102000#, el instructor de entrenamiento, que te enseñará cómo volverte más fuerte. No quiero encontrarte vagando sin rumbo hasta llegar a Lv. 10, ¿oyes?");
    } else if (status == 13) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
}