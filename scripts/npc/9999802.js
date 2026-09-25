/*
 * Jarvis - Multi-function Personal Assistant (EverleafMS / YunaMS)
 * NPC ID: 9999802
 * Accessible via:
 * 1. Trade Button (MTS) anywhere in-game
 * 2. Commands: @jarvis, @services, @bot
 * 3. Clicking the Jarvis computer NPC in Free Market (910000000)
 */

var status = -1;
var selectedOption = -1;
var TELEPORT_COST = 100000; // 100,000 Mesos travel fee

var newZones = [
    { name: "Gate to the Future (Door to the Future)", id: 271000000, desc: "Level 150+ - Future Henesys & Empress Cygnus" },
    { name: "Lion Heart Castle (Entrance Wall)", id: 211060000, desc: "Level 110+ - Von Leon Castle" },
    { name: "Tera Forest & Neo City (Time Gate)", id: 240070000, desc: "Level 100+ - Futuristic Time Gate" },
    { name: "Golden Temple (Sacred Grounds)", id: 950000000, desc: "Level 70+ - Golden Temple & Ravana" },
    { name: "Crimsonwood Keep (Courtyard)", id: 610030000, desc: "Level 90+ - Masteria Mountains & Keep" },
    { name: "Chryse (Orbis Sky Port)", id: 200080100, desc: "Level 50+ - Celestial Island Departure" }
];

function start() {
    status = -1;
    selectedOption = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;

    if (status == 0) {
        var msg = "             #e#b[ JARVIS - Personal Assistant ]#k#n\r\n";
        msg += "Hello #e#h ##n, I am Jarvis, your personal assistant. How may I help you today?\r\n\r\n";
        msg += "#L0##b[1] Universal Account Storage#k#l\r\n";
        msg += "#L1##b[2] VIP Beauty Salon & Style Changer (10k NX)#k#l\r\n";
        msg += "#L2##b[3] New Expansion Teleport (100k Mesos)#k#l\r\n";
        msg += "#L3##b[4] General Store & Consumables#k#l\r\n";
        msg += "#L4##b[5] Warp to Free Market Entrance#k#l\r\n";
        msg += "#L5##b[6] Unstuck Character (@dispose)#k#l\r\n";
        msg += "#L6##b[7] Server Information & Rates#k#l\r\n";

        cm.sendSimple(msg);
    } else if (status == 1) {
        selectedOption = selection;

        if (selectedOption == 0) {
            // Universal Account Storage
            cm.openStorage();
        } else if (selectedOption == 1) {
            // VIP Beauty Salon
            cm.openNpc(9900000);
        } else if (selectedOption == 2) {
            // New Expansion Teleport
            var travelMsg = "         #e#b[ New Expansion Zones Teleport ]#k#n\r\n";
            travelMsg += "Select an expansion zone to travel to:\r\n";
            travelMsg += "#eTravel Fee:#n #r" + TELEPORT_COST.toLocaleString() + " Mesos#k (Free for GMs)\r\n";
            travelMsg += "#eYour Mesos:#n #b" + cm.getMeso().toLocaleString() + " Mesos#k\r\n\r\n";

            for (var i = 0; i < newZones.length; i++) {
                travelMsg += "#L" + i + "##b" + newZones[i].name + "#k\r\n   #d" + newZones[i].desc + "#k#l\r\n";
            }
            cm.sendSimple(travelMsg);
        } else if (selectedOption == 3) {
            // General Store & Consumables (1012000)
            cm.openShopNPC(1012000);
        } else if (selectedOption == 4) {
            // Warp to Free Market
            if (cm.getPlayer().getMapId() == 910000000) {
                cm.sendOk("You are already at the Free Market!");
                cm.dispose();
            } else {
                cm.warp(910000000, 0);
                cm.dispose();
            }
        } else if (selectedOption == 5) {
            // Unstuck (@dispose)
            cm.enableActions();
            cm.sendOk("Your character actions and status have been refreshed successfully.");
            cm.dispose();
        } else if (selectedOption == 6) {
            // Server Info
            var expRate = cm.getClient().getChannelServer().getExpRate();
            var mesoRate = cm.getClient().getChannelServer().getMesoRate();
            var dropRate = cm.getClient().getChannelServer().getDropRate();
            var bossDropRate = cm.getClient().getChannelServer().getBossDropRate();
            var channel = cm.getClient().getChannel();

            var info = "           #e#b[ Server Information ]#k#n\r\n\r\n";
            info += "#b• Current Channel:#k " + channel + "\r\n";
            info += "#b• EXP Rate:#k " + expRate + "x\r\n";
            info += "#b• Meso Rate:#k " + mesoRate + "x\r\n";
            info += "#b• Drop Rate:#k " + dropRate + "x\r\n";
            info += "#b• Boss Drop Rate:#k " + bossDropRate + "x\r\n";
            info += "#b• Server Time:#k " + new java.util.Date().toString() + "\r\n";

            cm.sendOk(info);
            cm.dispose();
        }
    } else if (status == 2) {
        if (selectedOption == 2) {
            if (selection < 0 || selection >= newZones.length) {
                cm.dispose();
                return;
            }

            var dest = newZones[selection];
            var isGm = cm.getPlayer().getGMLevel() > 0;

            if (!isGm && cm.getMeso() < TELEPORT_COST) {
                cm.sendOk("You do not have enough mesos to travel.\r\nThe travel fee is #r" + TELEPORT_COST.toLocaleString() + " Mesos#k.\r\nYour current mesos: #b" + cm.getMeso().toLocaleString() + " Mesos#k.");
                cm.dispose();
                return;
            }

            if (!isGm) {
                cm.gainMeso(-TELEPORT_COST);
            }

            cm.warp(dest.id, 0);
            cm.dispose();
        }
    }
}
