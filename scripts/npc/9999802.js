/*
 * Jarvis - Multi-function Personal Assistant (EverleafMS / YunaMS)
 * NPC ID: 9999802
 * Access: Trade Button (MTS), @jarvis, @servicios
 * GraalJS compatible: no regex, no sendOk+dispose race
 */

var status = -1;
var selectedOption = -1;
var TELEPORT_COST = 100000;

var newZones = [
    { name: "Gate to the Future", id: 271000000, desc: "Level 150+ - Future Henesys / Empress Cygnus" },
    { name: "Lion Heart Castle", id: 211060000, desc: "Level 110+ - Von Leon Castle" },
    { name: "Tera Forest & Neo City", id: 240070000, desc: "Level 100+ - Futuristic Time Gate" },
    { name: "Crimsonwood Keep", id: 610030000, desc: "Level 90+ - Masteria Mountains" },
    { name: "Ellin Forest", id: 300000000, desc: "Level 70+ - Altair Camp / Past Victoria Island" },
    { name: "Chryse (Orbis Sky Port)", id: 200080100, desc: "Level 50+ - Celestial Island Departure" },
    { name: "Golden Temple", id: 950000000, desc: "Tourist Zone - World Tour & Safe Rest Area" }
];

function formatNumber(num) {
    var s = "" + Math.floor(+num);
    var result = "";
    var count = 0;
    for (var i = s.length - 1; i >= 0; i--) {
        if (count > 0 && count % 3 === 0) result = "," + result;
        result = s[i] + result;
        count++;
    }
    return result;
}

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

    // ── STATUS 0: Main menu ──────────────────────────────────────────────────
    if (status == 0) {
        var msg = "             #e#b[ JARVIS - Personal Assistant ]#k#n\r\n";
        msg += "Hello #e#h ##n! How may I assist you today?\r\n\r\n";
        msg += "#L0##b[1] Universal Account Storage#k#l\r\n";
        msg += "#L1##b[2] VIP Beauty Salon & (NEW HAIR) Style Changer (10k NX)#k#l\r\n";
        msg += "#L2##b[3] New Expansion Teleport (100k Mesos)#k#l\r\n";
        msg += "#L3##b[4] General Store & Consumables#k#l\r\n";
        msg += "#L4##b[5] Warp to Free Market Entrance#k#l\r\n";
        msg += "#L5##b[6] Server Information & Rates#k#l\r\n";
        msg += "#L6##b[7] (NEW HAIR) Modern & Special Hairstyles (10k NX)#k#l\r\n";
        cm.sendSimple(msg);

    // ── STATUS 1: Option selected ────────────────────────────────────────────
    } else if (status == 1) {
        selectedOption = selection | 0;

        if (selectedOption == 0) {
            cm.openStorage();
            cm.dispose();

        } else if (selectedOption == 1 || selectedOption == 6) {
            cm.openNpc(9900000);
            // openNpc disposes current and starts the other NPC

        } else if (selectedOption == 2) {
            // Show expansion zone list
            var isGm = cm.getPlayer().isGM();
            var travelMsg = "         #e#b[ New Expansion Zones Teleport ]#k#n\r\n";
            travelMsg += "Travel Fee: #r" + formatNumber(TELEPORT_COST) + " Mesos#k";
            travelMsg += (isGm ? " #g(Free for GMs)#k" : "") + "\r\n";
            travelMsg += "Your Mesos: #b" + formatNumber(cm.getMeso()) + "#k\r\n\r\n";
            for (var i = 0; i < newZones.length; i++) {
                travelMsg += "#L" + i + "##b" + newZones[i].name + "#k\r\n";
                travelMsg += "   #d" + newZones[i].desc + "#k#l\r\n";
            }
            cm.sendSimple(travelMsg);

        } else if (selectedOption == 3) {
            cm.openShopNPC(1012000);
            cm.dispose();

        } else if (selectedOption == 4) {
            // Free Market warp
            cm.warp(910000000, 0);
            cm.dispose();

        } else if (selectedOption == 5) {
            // Server Info
            var world = cm.getClient().getWorldServer();
            var expRate  = (world != null) ? world.getExpRate()      : 1;
            var mesoRate = (world != null) ? world.getMesoRate()     : 1;
            var dropRate = (world != null) ? world.getDropRate()     : 1;
            var bossRate = (world != null) ? world.getBossDropRate() : 1;
            var ch = cm.getClient().getChannel();

            var info = "           #e#b[ YunaMS Server Info ]#k#n\r\n\r\n";
            info += "#b• Channel:#k " + ch + "\r\n";
            info += "#b• EXP Rate:#k " + expRate + "x\r\n";
            info += "#b• Meso Rate:#k " + mesoRate + "x\r\n";
            info += "#b• Drop Rate:#k " + dropRate + "x\r\n";
            info += "#b• Boss Drop Rate:#k " + bossRate + "x\r\n";
            info += "#b• Time (UTC):#k " + new Date().toUTCString() + "\r\n";

            cm.sendOk(info);
            // Player clicks OK -> action(1,...) -> status==2 -> dispose()

        } else {
            cm.dispose();
        }

    // ── STATUS 2: Zone selected from teleport list, or OK after server info ──
    } else if (status == 2) {
        if (selectedOption == 2) {
            // Zone selection: selection is the zone index
            var idx = selection | 0;
            if (idx < 0 || idx >= newZones.length) {
                cm.dispose();
                return;
            }

            var dest = newZones[idx];
            var destId = dest.id | 0;
            var isGm = cm.getPlayer().isGM();

            if (!isGm && cm.getMeso() < TELEPORT_COST) {
                // Not enough mesos - just dispose (don't sendOk+dispose)
                cm.dispose();
                return;
            }

            if (!isGm) {
                cm.gainMeso(-TELEPORT_COST);
            }

            cm.warp(destId, 0);
            cm.dispose();

        } else {
            // Any other status==2 (e.g., after server info sendOk OK click)
            cm.dispose();
        }

    } else {
        cm.dispose();
    }
}
