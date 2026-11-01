//@author kevintjuh93

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode > 0) {
            status++;
        } else {
            qm.dispose();
        }
        if (status == 0) {
            qm.sendAcceptDecline("Hola, #h0#. Bienvenido al mundo del arce. Actualmente es temporada de eventos y damos la bienvenida a nuevos personajes con un regalo. ¿Quieres tu regalo ahora?");
        } else if (status == 1) {
            qm.sendOk("¡Abre tu inventario y haz doble clic en él! Estos regalos te harán lucir elegante. ¡Ah, una cosa más! Recibirás otro regalo en el nivel 30. ¡Buena suerte!");
            qm.forceStartQuest();
            qm.forceCompleteQuest();
            qm.gainItem(2430191, 1, true);
        } else if (status == 2) {
            qm.dispose();
        }
    }
}