/**
 ----------------------------------------------------------------------------------
 Skyferry Between Victoria Island, Ereve and Orbis.

 1100007 Kiriru (Victoria Island Station to Ereve)

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
            cm.sendNext("Si no estás interesado, entonces bueno...");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            var display = "";
            for (var i = 0; i < menu.length; i++) {
                display += "\r\n#L" + i + "##b Ereve (1000 mesos)#k";
            }
            cm.sendSimple("Eh... Entonces... Um... ¿Estás intentando dejar Victoria para ir a una región diferente? Puedes tomar este barco para#bEreve#k. Allí verás la brillante luz del sol brillando sobre las hojas y sentirás una suave brisa en tu piel. Es donde están Shinsoo y la emperatriz Cygnus. ¿Te gustaría ir a Ereve? Tomará aproximadamente#b2 minutos#ky te costará#b1000#k mesos.\r\n" + display);

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
