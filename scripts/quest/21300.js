var status = -1;

function start(mode, type, selection) {
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
        qm.sendNext("¿Cómo va el entrenamiento? Hmmm... Nivel 70... Eso todavía no es mucho, pero realmente has logrado algunos avances desde la primera vez que te conocí recién salido del hielo. Sigue entrenando y estoy seguro de que algún día podrás recuperar tu forma previa a la batalla.");
    } else if (status == 1) {
        qm.sendAcceptDecline("Pero antes de hacer eso, te necesitaré de vuelta en Rein por un tiempo.#bTu brazo de asta está reaccionando de forma extraña una vez más. Parece que tiene algo que quiere decirte.#kPodría despertar tus poderes ocultos, así que ven inmediatamente.");
    } else if (status == 2) {
        qm.forceStartQuest();
        qm.sendOk("De todos modos, pensé que realmente era algo que un arma tiene su propia identidad, pero en serio… esta arma no deja de hablar. Al principio siguió llorando porque realmente no estaba prestando atención a sus necesidades, y... ahh, por favor mantén esto en secreto del brazo de asta. No creo que sea buena idea alterar más el arma.");
    } else if (status == 3) {
        qm.dispose();
    }
}