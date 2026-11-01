function start() {
    cm.sendNext("Hiciste un gran trabajo allí atrás." + cm.getPlayer().getName() + ", bien hecho. Ahora te transportaré de regreso a El Nath. Ten el colgante en tu poder y habla conmigo cuando te sientas listo para recibir la nueva habilidad.");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        cm.warp(211000000, "in01");
        cm.dispose();
    }
}