/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 ? - Victoria Road: Pet-Walking Road (100000202)
 -- By ---------------------------------------------------------------------------------------------
 Xterminator
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Xterminator
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
        cm.sendNext("#b(No toqué este objeto oculto cubierto de hierba)");
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        if (cm.getQuestStatus(4646) == 1) {
            if (cm.haveItem(4031921)) {
                cm.sendNext("#b(¿Qué es esto... eww... ¡había caca de mascota allí!)");
                cm.dispose();
            } else {
                cm.sendYesNo("#b(Puedo ver algo cubierto de hierba. ¿Debo sacarlo?)");
            }
        } else {
            cm.sendOk("#b (No pude encontrar nada).");
            cm.dispose();
        }
    } else if (status == 1) {
        cm.sendNext("Encontré el objeto que escondió el entrenador de mascotas Bartos... esta nota.");
        cm.gainItem(4031921, 1);
        cm.dispose();
    }
}