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
        qm.sendNext("Yo, maestro. Ahora que te he mostrado lo que puedo hacer, es tu turno. Demuéstrame... ¡que puedes encontrar comida! Estoy hambriento. Puedes usar mi poder ahora, así que tienes que cuidar de mí.");
    } else if (status == 1) {
        qm.sendNextPrev("Eh, todavía no entiendo lo que está pasando, pero no puedo dejar que un pobre bicho como tú muera de hambre, ¿verdad? ¿Comida, dices? ¿Qué quieres comer?", 2);
    } else if (status == 2) {
        qm.sendNextPrev("Hola, acabo de nacer hace unos minutos. ¿Cómo sabría lo que como? Todo lo que sé es que soy un Dragón... Soy TU Dragón. Y tú eres mi maestro. ¡Tienes que tratarme bien!");
    } else if (status == 3) {
        qm.sendAcceptDecline("Supongo que se supone que debemos aprender juntos. Pero tengo hambre. Maestro, quiero comida. Recuerda, ¡soy un bebé! ¡Pronto empezaré a llorar!");
    } else if (status == 4) {
        if (mode == 0) {
            qm.sendNext("*jadea* ¿Cómo puedes negarte a alimentar a tu Dragón? ¡Esto es abuso infantil!");
        } else {
            qm.forceStartQuest();
            qm.sendOk("#b#b(#p1013000#El bebé Dragón parece tener mucha hambre. Debes alimentarlo. Tal vez tu papá pueda darte consejos sobre qué comen los dragones).");
        }
    } else if (status == 5) {
        qm.dispose();
    }
}