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
        qm.sendNext("No quedan muchos registros de los héroes que lucharon contra el Mago Negro. Incluso en el Libro de la Profecía, la única información disponible es que eran cinco. No hay nada sobre quiénes eran o cómo lucían. ¿Hay algo que recuerdes? ¿Algo en absoluto?", 8);
    } else if (status == 1) {
        qm.sendNextPrev("No recuerdo nada...", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Como esperaba. Por supuesto, la maldición del Mago Negro fue lo suficientemente fuerte como para borrar toda tu memoria. Pero incluso si ese es el caso, tiene que llegar un punto en el que el pasado se descubrirá, especialmente ahora que estamos seguros de que eres uno de los héroes. Sé que perdiste tu armadura y tu arma durante la batalla pero... Oh, sí, sí. ¡Casi lo olvido! ¡Tu #bweapon#k!", 8);
    } else if (status == 3) {
        qm.sendNextPrev("¿Mi arma?", 2);
    } else if (status == 4) {
        qm.sendNextPrev("Encontré un arma increíble mientras cavaba bloques de hielo hace un tiempo. Supuse que el arma pertenecía a un héroe, así que la traje a la ciudad y la coloqué en algún lugar del centro de la ciudad. ¿No lo has visto?#bEl#p1201001##k... \r\r#i4032372#\r\rSe parece a esto...", 8);
    } else if (status == 5) {
        qm.sendNextPrev("Ahora que lo pienso, vi un #p1201001# en la ciudad.", 2);
    } else if (status == 6) {
        qm.sendAcceptDecline("Sí, eso es todo. Según lo que se ha registrado, el arma de un héroe reconocerá a su legítimo dueño, y si eres el héroe que usó la#p1201001#, el#p1201001#reaccionará cuando agarres el#p1201001#. Por favor ve a buscar el#b#p1201001#y haga clic en él.#k");
    } else if (status == 7) {
        if (mode == 0 && type == 15) {
            qm.sendNext("¿Qué te detiene? Lo prometo, no me decepcionaré incluso si el #p1201001# no muestra ninguna reacción ante usted. Por favor, corre hacia allí y toma el #p1201001#. Solo #bclick#k en él.", 8);
        } else {
            qm.forceCompleteQuest();
            qm.sendOk("Si el #p1201001# reacciona ante ti, entonces sabremos que eres #bAran#k, el héroe que empuñaba un #p1201001#.", 8);
            qm.showIntro("Effect/Direction1.img/aranTutorial/ClickPoleArm");
        }
    } else if (status == 8) {
        qm.dispose();
    }
}