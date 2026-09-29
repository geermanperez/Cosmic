/*
 * Neo Tokyo / Neo City Time Machine Teleporter
 * NPC ID: 2083006
 */

var status = -1;

var array = [
    "Year 2021 - Average Town Entrance",
    "Year 2099 - Midnight Harbor Entrance",
    "Year 2215 - Bombed City Center Retail District",
    "Year 2216 - Ruined City Intersection",
    "Year 2230 - Dangerous Tower Lobby",
    "Year 2503 - Air Battleship Bow"
];

var mapids = [
    240070100,
    240070200,
    240070300,
    240070400,
    240070500,
    240070600
];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }
    status++;

    if (status == 0) {
        var menu = "             #e#b[ Neo City - Time Gate Machine ]#k#n\r\n";
        menu += "Where would you like to travel in time?\r\n\r\n";
        for (var i = 0; i < array.length; i++) {
            menu += "#L" + i + "##b" + array[i] + "#k#l\r\n";
        }
        cm.sendSimple(menu);
    } else if (status == 1) {
        var sel = selection | 0;
        if (sel >= 0 && sel < mapids.length) {
            cm.warp(mapids[sel], 1);
        }
        cm.dispose();
    } else {
        cm.dispose();
    }
}