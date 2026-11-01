/**
 ----------------------------------------------------------------------------------
 Whale Between Lith harbor and Rien.

 1200003 Puro

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("Lith Harboor");
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
                display += "\r\n#L" + i + "##b Lith Harbor (800 mesos)#k";
            }
            cm.sendSimple("¿Estás intentando dejar Rien? Sube a este barco y te llevaré desde#bRien#k a#bPuerto Lith#ky de vuelta. por un#btarifa de 800#kMesos. ¿Te gustaría dirigirte a Lith Harbor ahora? Tardará aproximadamente un minuto en llegar.\r\n" + display);

        } else if (status == 1) {
            if (cm.getMeso() < 800) {
                cm.sendNext("Hmm... ¿Estás seguro de que tienes #b800#k Mesos? Revisa tu inventario y asegúrate de tener suficiente. Debes pagar la tarifa o no puedo dejarte subir...");
                cm.dispose();
            } else {
                cm.gainMeso(-800);
                cm.warp(104000000, 3);
                cm.dispose();
            }

        }
    }
}
