/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100004 Kiru (To Orbis)

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/
var menu = new Array("Orbis");
var method;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();

    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        } else if (mode == 0) {
            cm.sendNext("DE ACUERDO. Si alguna vez cambias de opinión, házmelo saber.");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            var display = "";
            for (var i = 0; i < menu.length; i++) {
                display += "\r\n#L" + i + "##b Orbis (1000 mesos)#k";
            }
            cm.sendSimple("Hmm... Los vientos son favorables. ¿Estás pensando en dejar aquí e ir a algún otro lugar? Este ferry navega a Orbis en el continente de Ossiria. ¿Te has ocupado de todo lo necesario en Ereve? Si te diriges hacia #bOrbis#k, puedo llevarte allí. ¿Qué haces el día? ¿Vas a ir a Orbis?\r\n" + display);

        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("Hmm... ¿Estás seguro de que tienes #b1000#k Mesos? Revisa tu inventario y asegúrate de tener suficiente. Debes pagar la tarifa o no puedo dejarte subir...");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(200000161, 0);
                cm.dispose();
            }
        }
    }
}
