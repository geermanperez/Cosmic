/*
 * Cygnus Skill - Training Never ends
 */

var status = -1;

function start(mode, type, selection) {
    status++;

    if (status == 0) {
        qm.sendAcceptDecline("#h0#. ¿Has estado aflojando el entrenamiento desde que alcanzaste el nivel 100? Todos sabemos lo poderoso que eres, pero el entrenamiento no está completo. Echa un vistazo a estos Caballeros Comandantes. Entrenan día y noche, preparándose para el posible encuentro con el Mago Negro.");
    } else if (status == 1) {
        if (mode == 1) {
            qm.forceStartQuest();
        }
        qm.dispose();
    }
}

function end(mode, type, selection) {
    qm.dispose();
}