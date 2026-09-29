/*
    Big Headward - Henesys Ruins (Gate to the Future)
    NPC ID: 2142003
*/

var status = -1;
var beauty = 0;

var mhair_r = Array(30010, 30070, 30080, 30090, 30100, 30690, 30760, 33000);
var fhair_r = Array(31130, 31530, 31820, 31920, 31940, 34000, 34030);

var mhair_v = Array(30010, 30070, 30080, 30090, 30100, 30480, 30560, 30690, 30760, 30850, 30890, 30930, 30950);
var fhair_v = Array(31020, 31130, 31510, 31530, 31820, 31860, 31890, 31920, 31940, 31950, 34000);

var hairnew = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        cm.sendSimple("Even here in the ruins, style is our ultimate weapon against despair! I am #p2142003#, the Prince of Hair!\r\n#b#L0##i5150040##t5150040##l\r\n#L1##i5150044##t5150044##l\r\n#L2#Just having a chat.#l");
    } else if (status == 1) {
        if (selection == 0) {
            beauty = 1;
            cm.sendYesNo("If you use this REGULAR coupon, your hair may transform into a random new look... Do you still want to do it using #b#t5150040##k?");
        } else if (selection == 1) {
            beauty = 2;
            hairnew = Array();
            if (cm.getPlayer().getGender() == 0) {
                for (var i = 0; i < mhair_v.length; i++) {
                    pushIfItemExists(hairnew, mhair_v[i] + parseInt(cm.getPlayer().getHair() % 10));
                }
            } else {
                for (var i = 0; i < fhair_v.length; i++) {
                    pushIfItemExists(hairnew, fhair_v[i] + parseInt(cm.getPlayer().getHair() % 10));
                }
            }
            cm.sendStyle("Using the SPECIAL coupon you can choose your desired hair style. Pick the one you like best:", hairnew);
        } else {
            cm.sendOk("Never let adversity ruin your sense of fashion! Keep your head held high!");
            cm.dispose();
        }
    } else if (status == 2) {
        if (beauty == 1) {
            if (cm.haveItem(5150040)) {
                hairnew = Array();
                if (cm.getPlayer().getGender() == 0) {
                    for (var i = 0; i < mhair_r.length; i++) {
                        pushIfItemExists(hairnew, mhair_r[i] + parseInt(cm.getPlayer().getHair() % 10));
                    }
                } else {
                    for (var i = 0; i < fhair_r.length; i++) {
                        pushIfItemExists(hairnew, fhair_r[i] + parseInt(cm.getPlayer().getHair() % 10));
                    }
                }

                cm.gainItem(5150040, -1);
                cm.setHair(hairnew[Math.floor(Math.random() * hairnew.length)]);
                cm.sendOk("Fabulous! Enjoy your stunning new hairstyle!");
            } else {
                cm.sendOk("Looks like you don't have the required coupon (#t5150040#). Come back once you acquire one!");
            }
        } else if (beauty == 2) {
            if (cm.haveItem(5150044)) {
                cm.gainItem(5150044, -1);
                cm.setHair(hairnew[selection]);
                cm.sendOk("Magnificent! Enjoy your new style!");
            } else {
                cm.sendOk("Looks like you don't have the required coupon (#t5150044#). Come back once you acquire one!");
            }
        }
        cm.dispose();
    }
}
