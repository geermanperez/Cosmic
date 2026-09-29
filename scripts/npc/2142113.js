/*
    Danger Zone Taxi - Henesys Ruins (Gate to the Future)
    NPC ID: 2142113
*/

var maps = [
    { name: "Knight Stronghold Entrance", id: 271030000, cost: 50000 },
    { name: "Door to the Future", id: 271000000, cost: 20000 },
    { name: "Henesys (Victoria Island)", id: 100000000, cost: 10000 }
];

var selected = -1;
var status = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        var menu = "Danger Zone Taxi at your service! Driving through ruined terrain is dangerous, but our reinforced cabs will get you there safely. Where would you like to go?\r\n#b";
        for (var i = 0; i < maps.length; i++) {
            menu += "\r\n#L" + i + "#" + maps[i].name + " (" + cm.numberWithCommas(maps[i].cost) + " mesos)#l";
        }
        cm.sendSimple(menu);
    } else if (status == 1) {
        selected = selection;
        if (selected < 0 || selected >= maps.length) {
            cm.dispose();
            return;
        }
        var target = maps[selected];
        cm.sendYesNo("Would you like to travel to #b" + target.name + "#k for #b" + cm.numberWithCommas(target.cost) + " mesos#k?");
    } else if (status == 2) {
        var target = maps[selected];
        if (cm.getMeso() < target.cost) {
            cm.sendNext("You don't have enough mesos. I can't take you without paying the fee!");
        } else {
            cm.gainMeso(-target.cost);
            cm.warp(target.id, 0);
        }
        cm.dispose();
    }
}
