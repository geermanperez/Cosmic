/*
 * Time Temple - Kirston
 * Twilight of the Gods
 */

function start() {
    cm.sendAcceptDecline("¡Si tan solo tuviera el Espejo de la Bondad entonces podría volver a invocar al Mago Negro! \r\n¡Espera! ¡algo no está bien! ¿Por qué no se convoca al Mago Negro? Espera, ¿qué es esta fuerza? Siento algo... totalmente diferente al Mago Negro ¡¡¡Ahhhhh!!!!! \r\n\r\n #b(Pone una mano en el hombro de Kryston.)");
}

function action(mode, type, selection) {
    if (mode == 1) {
        cm.removeNpc(270050100, 2141000);
        cm.forceStartReactor(270050100, 2709000);
    }
    cm.dispose();

// If accepted, = summon PB + Kriston Disappear + 1 hour timer
// If deny = NoTHING HAPPEN
}