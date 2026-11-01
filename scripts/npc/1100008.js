/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100008 Kiru (Orbis Station)

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("Ereve");
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
                display += "\r\n#L" + i + "##b Ereve (1000 mesos)#k";
            }
            cm.sendSimple("Este barco se dirigirá hacia #bEreve#k, una isla donde encontrarás hojas carmesí tomando el sol, la suave brisa que se desliza entre el arroyo y la Emperatriz del Arce Cygnus. Si estás interesado en unirte a Cygnus Knights, definitivamente deberías visitar aquí. ¿Estás interesado en visitar Ereve?, El Viaje te costará #b1000#k Mesos\r\n" + display);

        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("Hmm... ¿Estás seguro de que tienes #b1000#k Mesos? Revisa tu inventario y asegúrate de tener suficiente. Debes pagar la tarifa o no puedo dejarte subir...");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(130000210, 0);
                cm.dispose();
            }
        }
    }
}
