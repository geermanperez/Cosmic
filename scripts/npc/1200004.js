/**
 ----------------------------------------------------------------------------------
 Whale Between Lith harbor and Rien.

 1200004 Puro

 Credits to: MapleSanta
 ----------------------------------------------------------------------------------
 **/

var menu = new Array("Rien");
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
                display += "\r\n#L" + i + "##b Rien (800 mesos)#k";
            }
            cm.sendSimple("¿Estás pensando en dejar la Isla Victoria y dirigirte a nuestro pueblo? Si abordas este barco, puedo llevarte desde#bPuerto Lith#ka#bRien#k y de vuelta. Pero debes pagar un#btarifa de 800#kMesos. ¿Te gustaría ir a Rien? Tardará aproximadamente un minuto en llegar.\r\n" + display);

        } else if (status == 1) {
            if (cm.getMeso() < 800) {
                cm.sendNext("Hmm... ¿Estás seguro de que tienes #b800#k Mesos? Revisa tu inventario y asegúrate de tener suficiente. Debes pagar la tarifa o no puedo dejarte subir...");
                cm.dispose();
            } else {
                cm.gainMeso(-800);
                cm.warp(140020300, 0);
                cm.dispose();
            }
        }
    }
}
