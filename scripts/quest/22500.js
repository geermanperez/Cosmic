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
        qm.sendNext("¡Por fin estoy aquí! *inhala* Ah, esto debe ser aire lo que estoy respirando. ¡Y ese, ese debe ser el sol! ¡Y eso, un árbol! ¡Y eso, una planta! ¡Y eso, una flor! Woohahahaha! ¡Esto es increíble! Esto es mucho mejor de lo que imaginaba que sería el mundo mientras estaba atrapado dentro del huevo. Y tú... ¿eres mi maestro? Hm, te imaginé diferente.");
    } else if (status == 1) {
        qm.sendNextPrev("#b¡Vaya, habla!", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Mi amo es extraño. Supongo que no puedo hacer nada al respecto ahora, ya que se hizo el pacto. *suspiro* Bueno, encantado de conocerte. Nos veremos mucho.");
    } else if (status == 3) {
        qm.sendNextPrev("#bEh? ¿Qué quieres decir? ¿Nos veremos mucho? ¿Qué pacto?", 2);
    } else if (status == 4) {
        qm.sendNextPrev("¡¿Qué quieres decir con qué quiero decir?! Me despertaste del Huevo. ¡Eres mi maestro! Entonces, por supuesto, es tu responsabilidad cuidarme, entrenarme y ayudarme a convertirme en un Dragón fuerte. ¡Obviamente!");
    } else if (status == 5) {
        qm.sendNextPrev("#b¿Qué? ¿Un dragón? ¡¿Eres un Dragón?! No lo entiendo... ¿Por qué soy tu maestro? ¿De qué estás hablando?", 2);
    } else if (status == 6) {
        qm.sendNextPrev("¿De qué estás hablando? ¡Tu espíritu hizo un pacto con mi espíritu! Ahora somos prácticamente la misma persona. ¿Realmente tengo que dar explicaciones? Como resultado, te has convertido en mi maestro. Estamos obligados por el pacto. No puedes cambiar de opinión... El pacto no se puede romper.");
    } else if (status == 7) {
        qm.sendNextPrev("#bEspera, espera, espera. Déjame aclarar esto. ¿Estás diciendo que no tengo más remedio que ayudarte?", 2);
    } else if (status == 8) {
        qm.sendNextPrev("¡Sí! ¡Oyeeee...! ¿Qué pasa con la cara? ¿Tú... no quieres ser mi maestro?");
    } else if (status == 9) {
        qm.sendNextPrev("#bNo... No es eso... Simplemente no sé si estoy listo para tener una mascota.", 2);
    } else if (status == 10) {
        qm.sendNextPrev("¡¿Una p-p-mascota?! ¿Me acabas de llamar mascota? ¿Cómo se atreve...? ¡Vaya, soy un Dragón! ¡El ser más fuerte del mundo!");
    } else if (status == 11) {
        qm.sendNextPrev("#b...#b(Lo miras con escepticismo. Parece un lagarto. Un pequeño enclenque, además.)#k", 2);
    } else if (status == 12) {
        qm.sendAcceptDecline("¡¿Por qué me miras así?! ¡Solo mira! Mira lo que puedo hacer con mi poder. ¿Listo?");
    } else if (status == 13) {
        if (mode == 0 && type == 15) {
            qm.sendNext("¿No me crees? ¡Grrrrr, me estás volviendo loco!");
            qm.dispose();
        } else {
            if (!qm.isQuestStarted(22500)) {
                qm.forceStartQuest();
            }
            qm.sendNext("Ordename que mate al#r#o1210100##k¡s! ¡Hazlo ahora! Te mostraré qué tan rápido un Dragón puede derrotar al#o1210100#¡s! ¡Vaya, carga!");
        }
    } else if (status == 14) {
        qm.sendNextPrev("¡Espera un minuto! ¿Distribuiste tu AP? Estoy muy afectado por mi maestría.#bINT y LUK#k! Si realmente quieres ver lo que puedo hacer, distribuye tu AP y#bequipa tu equipo de mago#k¡antes de usar la habilidad!");
    } else if (status == 15) {
        qm.sendImage("UI/tutorial/evan/11/0");
        qm.dispose();
    }
}