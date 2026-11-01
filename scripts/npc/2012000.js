var ticket = [4031047, 4031074, 4031331, 4031576];
var cost = [5000, 6000, 30000, 6000];
var mapNames = ["Ellinia of Victoria Island", "Ludibrium", "Leafre", "Ariant"];
var mapName2 = ["Ellinia of Victoria Island", "Ludibrium", "Leafre of Minar Forest", "Nihal Desert"];
var select;
var status = 0;

function start() {
    var where = "Hello, I'm in charge of selling tickets for the ship ride for every destination. Which ticket would you like to purchase?";
    for (var i = 0; i < ticket.length; i++) {
        where += "\r\n#L" + i + "##b" + mapNames[i] + "#k#l";
    }
    cm.sendSimple(where);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            select = selection;
            cm.sendYesNo("el viaje a" + mapName2[select] + "se quita cada" + (select == 0 ? 15 : 10) + "minutos, comenzando en cada hora, y le costará #b" + cost[select] + "mesos#k. ¿Estás seguro de que quieres comprar?#b#t" + ticket[select] + "##k?");
        } else if (status == 2) {
            if (cm.getMeso() < cost[select] || !cm.canHold(ticket[select])) {
                cm.sendOk("¿Estás seguro de que tienes #b?" + cost[select] + "mesos#k? Si es así, le insto a que revise su inventario, etc., y vea si está lleno o no.");
            } else {
                cm.gainMeso(-cost[select]);
                cm.gainItem(ticket[select], 1);
            }
            cm.dispose();
        }
    }
}
