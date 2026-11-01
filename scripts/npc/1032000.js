var status = 0;
var maps = [104000000, 102000000, 100000000, 103000000, 120000000];
var cost = [1000, 1000, 1000, 1000, 800];
var selectedMap = -1;
var mesos;
var hasCoupon = false;

function start() {
    cm.sendNext("Hola, conduzco la cabina regular. Si desea ir de ciudad en ciudad de forma segura y rápida, tome nuestro taxi. Con gusto lo llevaremos a su destino a un precio asequible.");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 1 && mode == 0) {
            cm.dispose();
            return;
        } else if (status >= 2 && mode == 0) {
            cm.sendNext("También hay mucho que ver en esta ciudad. Vuelve y búscanos cuando necesites ir a una ciudad diferente.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            var selStr = "";
            if (cm.getJobId() == 0) {
                selStr += "We have a special 90% discount for beginners.";
            }
            selStr += "Choose your destination, for fees will change from place to place.#b";
            for (var i = 0; i < maps.length; i++) {
                selStr += "\r\n#L" + i + "##m" + maps[i] + "# (" + (cm.getJobId() == 0 ? cost[i] / 10 : cost[i]) + " mesos)#l";
            }
            cm.sendSimple(selStr);
        } else if (status == 2) {
            if (maps[selection] == 100000000 && cm.getMapId() == 101000000 && cm.haveItem(4032288)) {
                cm.sendYesNo("Hmm, veo que Neinheart te recomendó venir a la Isla Victoria para mejorar tus habilidades como caballero. Bueno, sólo que esta vez el viaje será gratuito. ¿Quieres dar el paseo?");
                hasCoupon = true;
            } else {
                cm.sendYesNo("No tienes nada más que hacer aquí, ¿eh? ¿De verdad quieres ir a#b#m" + maps[selection] + "##k? te costará#b" + (cm.getJobId() == 0 ? cost[selection] / 10 : cost[selection]) + "mesos#k.");
            }

            selectedMap = selection;
        } else if (status == 3) {
            if (!hasCoupon) {
                if (cm.getJobId() == 0) {
                    mesos = cost[selectedMap] / 10;
                } else {
                    mesos = cost[selectedMap];
                }

                if (cm.getMeso() < mesos) {
                    cm.sendNext("No tienes suficientes mesos. Lamento decir esto, pero sin ellos no podrás viajar en taxi.");
                    cm.dispose();
                    return;
                }

                cm.gainMeso(-mesos);
            } else {
                cm.gainItem(4032288, -1);
            }

            cm.warp(maps[selectedMap], 0);
            cm.dispose();
        }
    }
}