/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100003 Kiriru (To Victoria Island From Ereve)

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("Victoria Island");
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
            cm.sendNext("Si no estás interesado, entonces bueno...");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            var display = "";
            for (var i = 0; i < menu.length; i++) {
                display += "\r\n#L" + i + "##b Victoria Island (1000 mesos)#k";
            }
            cm.sendSimple("Eh, hola... otra vez. ¿Quieres dejar Ereve e ir a otro lugar? Si es así, has venido al lugar correcto. Opero un ferry que va desde#bEreve#k a#bIsla Victoria#k, puedo llevarte a#bIsla Victoria#ksi quieres... tendrás que pagar una tarifa de#b1000#k Mesos.\r\n" + display);
        } else if (status == 1) {
            if (cm.getMeso() < 1000) {
                cm.sendNext("Hmm... ¿Estás seguro de que tienes #b1000#k Mesos? Revisa tu inventario y asegúrate de tener suficiente. Debes pagar la tarifa o no puedo dejarte subir...");
                cm.dispose();
            } else {
                cm.gainMeso(-1000);
                cm.warp(101000400, 0);
                cm.dispose();
            }
        }
    }
}
