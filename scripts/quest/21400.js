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
        qm.sendAcceptDecline("¿Cómo va el entrenamiento? Sé que estás ocupado, pero ven a #bRien#k inmediatamente. El #bMaha#k ha empezado a actuar de forma extraña otra vez... Pero ahora es aún más extraño. Es diferente a antes. Es... más oscuro de lo habitual.");
    } else if (status == 1) {
        qm.startQuest();
        qm.sendOk("Tengo un mal presentimiento sobre esto. Por favor vuelve aquí. Nunca había visto ni pastoreado a Maha de esta manera, pero puedo sentir el sufrimiento por el que está pasando. #bO ¡Solo tú, el maestro de Maha, puedes hacer algo al respecto!");
    } else if (status == 2) {
        qm.dispose();
    }
}