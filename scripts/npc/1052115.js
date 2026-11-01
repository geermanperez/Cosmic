var status = 0;
var section = 0;

//questid 29931, infoquest 7662

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 1) {
        if (cm.getMapId() == 910320001) {
            cm.warp(910320000, 0);
            cm.dispose();
        } else if (cm.getMapId() == 910330001) {
            var itemid = 4001321;
            if (!cm.canHold(itemid)) {
                cm.sendOk("Deje espacio para 1 espacio ETC.");
            } else {
                cm.gainItem(itemid, 1);
                cm.warp(910320000, 0);
            }
            cm.dispose();
        } else if (cm.getMapId() >= 910320100 && cm.getMapId() <= 910320304) {
            cm.sendYesNo("¿Quieres salir de este lugar?");
            status = 99;
        } else {
            cm.sendSimple("Mi nombre es Sr. Lim.\r\n#b#e#L1#Ingrese a la plataforma polvorienta.#l#n\r\n#L2#Dirígete hacia el Tren 999.#l\r\n#L3#Reciba una medalla de <Empleado Honorario>.#l#k");
        }
    } else if (status == 2) {
        section = selection;
        if (selection == 1) {
            if (cm.getPlayer().getLevel() < 25 || cm.getPlayer().getLevel() > 30 || !cm.isLeader()) {
                cm.sendOk("Debes estar en el rango de niveles 25-30 y ser el líder del grupo.");
            } else {
                if (!cm.start_PyramidSubway(-1)) {
                    cm.sendOk("La plataforma Dusty está actualmente llena.");
                }
            }
            //todo
        } else if (selection == 2) {
            if (cm.haveItem(4001321)) {
                if (cm.bonus_PyramidSubway(-1)) {
                    cm.gainItem(4001321, -1);
                } else {
                    cm.sendOk("El Tren 999 se encuentra lleno en estos momentos");
                }
            } else {
                cm.sendOk("No tienes la tarjeta de embarque.");
            }
        } else if (selection == 3) {
            var record = cm.getQuestRecord(7662);
            var data = record.getCustomData();
            if (data == null) {
                record.setCustomData("0");
                data = record.getCustomData();
            }
            var mons = parseInt(data);
            if (mons < 10000) {
                cm.sendOk("Por favor, derrota al menos a 10.000 monstruos en la Estación y búscame de nuevo. Mata:" + mons);
            } else if (cm.canHold(1142141) && !cm.haveItem(1142141)) {
                cm.gainItem(1142141, 1);
                cm.startQuest(29931);
                cm.completeQuest(29931);
            } else {
                cm.sendOk("Por favor haz espacio.");
            }
        }
        cm.dispose();
    } else if (status == 100) {
        cm.warp(910320000, 0);
        cm.dispose();
    }
}