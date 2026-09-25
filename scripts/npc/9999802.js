/*
 * Jarvis - Multi-function Personal Assistant (EverleafMS / YunaMS)
 * NPC ID: 9999802
 * Accessible via:
 * 1. Trade Button (MTS) anywhere in-game
 * 2. Commands: @jarvis, @services, @bot
 * 3. Clicking the Jarvis computer NPC in Free Market (910000000)
 */

var status = -1;

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
        var msg = "             #e#b[ JARVIS - Personal Assistant ]#k#n\r\n";
        msg += "Hello #e#h ##n, I am Jarvis, your personal assistant. How may I help you today?\r\n\r\n";
        msg += "#L0##b[1] Universal Account Storage#k#l\r\n";
        msg += "#L1##b[2] VIP Beauty Salon & Style Changer#k#l\r\n";
        msg += "#L2##b[3] General Store & Consumables#k#l\r\n";
        msg += "#L3##b[4] Warp to Free Market Entrance#k#l\r\n";
        msg += "#L4##b[5] Unstuck Character (@dispose)#k#l\r\n";
        msg += "#L5##b[6] Server Information & Rates#k#l\r\n";

        cm.sendSimple(msg);
    } else if (status == 1) {
        if (selection == 0) {
            // Universal Account Storage
            cm.openStorage();
        } else if (selection == 1) {
            // VIP Beauty Salon
            cm.openNpc(9900000);
        } else if (selection == 2) {
            // General Store & Consumables (1012000)
            cm.openShopNPC(1012000);
        } else if (selection == 3) {
            // Warp to Free Market
            if (cm.getPlayer().getMapId() == 910000000) {
                cm.sendOk("You are already at the Free Market!");
                cm.dispose();
            } else {
                cm.warp(910000000, 0);
                cm.dispose();
            }
        } else if (selection == 4) {
            // Unstuck (@dispose)
            cm.enableActions();
            cm.sendOk("Your character actions and status have been refreshed successfully.");
            cm.dispose();
        } else if (selection == 5) {
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
    }
}
