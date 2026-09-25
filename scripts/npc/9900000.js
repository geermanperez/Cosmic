/*
 * VIP Beauty Salon & Style Changer (NPC 9900000)
 * Fully compatible with v83 client & EverleafMS / YunaMS
 * Supports: Hair, Face, Skin, Hair Dye, Eye Color
 * Payment: 10,000 NX strictly required (Free for GMs)
 */

var status = -1;
var category = -1;
var subPage = 0;
var currentList = [];
var COST_NX = 10000; // Minimum 10,000 NX per style change

var skin = [0, 1, 2, 3, 4];

// Hair categories - split into groups of 8 to prevent UI overflow or client crashes
var maleHairs = [
    [30000, 30010, 30020, 30030, 30040, 30050, 30060, 30070],
    [30080, 30090, 30100, 30110, 30120, 30130, 30140, 30150],
    [30160, 30170, 30180, 30190, 30200, 30210, 30220, 30230],
    [30240, 30250, 30260, 30270, 30280, 30290, 30300, 30310],
    [30320, 30330, 30340, 30350, 30360, 30370, 30380, 30400],
    [30410, 30420, 30430, 30440, 30450, 30460, 30470, 30480],
    [30510, 30520, 30530, 30540, 30550, 30560, 30570, 30580],
    [30590, 30600, 30610, 30620, 30630, 30640, 30650, 30660],
    [30670, 30680, 30690, 30700, 30710, 30720, 30730, 30740],
    [30750, 30760, 30770, 30780, 30790, 30800, 30810, 30820],
    [33000, 33010, 33020, 33030, 33040, 33050, 33060, 33070],
    [33080, 33090, 33100, 33110, 33120, 33130, 33140, 33150],
    [35000, 35010, 35020, 35030, 35040, 35050, 35060, 35070],
    [35080, 35090, 35100, 35110, 35120, 35130, 35140, 35150]
];

var femaleHairs = [
    [31000, 31010, 31020, 31030, 31040, 31050, 31060, 31070],
    [31080, 31090, 31100, 31110, 31120, 31130, 31140, 31150],
    [31160, 31170, 31180, 31190, 31200, 31210, 31220, 31230],
    [31240, 31250, 31260, 31270, 31280, 31290, 31300, 31310],
    [31320, 31330, 31340, 31350, 31360, 31380, 31400, 31410],
    [31420, 31430, 31440, 31450, 31460, 31470, 31480, 31490],
    [31510, 31520, 31530, 31540, 31550, 31560, 31570, 31580],
    [31590, 31600, 31610, 31620, 31630, 31640, 31650, 31660],
    [31670, 31680, 31690, 31700, 31710, 31720, 31730, 31740],
    [31750, 31760, 31770, 31780, 31790, 31800, 31810, 31820],
    [34000, 34010, 34020, 34030, 34040, 34050, 34060, 34070],
    [34080, 34090, 34100, 34110, 34120, 34130, 34140, 34150],
    [37000, 37010, 37020, 37030, 37040, 37050, 37060, 37070],
    [37080, 37090, 37100, 37110, 37120, 37130, 37140, 37150]
];

// Face categories - 8 per group
var maleFaces = [
    [20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007],
    [20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015],
    [20016, 20017, 20018, 20019, 20020, 20021, 20022, 20023],
    [20024, 20025, 20026, 20027, 20028, 20029, 20030, 20031],
    [20032, 20033, 20035, 20036, 20037, 20038, 20039, 20040],
    [23000, 23001, 23002, 23003, 23004, 23005, 23006, 23007]
];

var femaleFaces = [
    [21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007],
    [21008, 21009, 21010, 21011, 21012, 21013, 21014, 21015],
    [21016, 21017, 21018, 21019, 21020, 21021, 21022, 21023],
    [21024, 21025, 21026, 21027, 21028, 21029, 21030, 21031],
    [21033, 21034, 21035, 21036, 21037, 21038, 21041, 21042],
    [24001, 24002, 24003, 24004, 24005, 24006, 24007, 24008]
];

var specialFaces = [
    [22000, 22001, 22003, 22004, 22005, 22011, 25000, 25001],
    [25003, 25004, 25005, 25006, 25007, 25008, 25009, 25010],
    [26000, 26001, 26002, 26003, 26004, 26005, 26006, 26007]
];

function formatNumber(num) {
    return ("" + num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function canAfford() {
    if (cm.getPlayer().getGMLevel() > 0) return true;
    return cm.getNX() >= COST_NX;
}

function chargePlayer() {
    if (cm.getPlayer().getGMLevel() > 0) return "Free (GM)";
    if (cm.getNX() >= COST_NX) {
        cm.gainNX(-COST_NX);
        return "10,000 NX";
    }
    return null;
}

function filterPreviewStyles(styles) {
    var available = [];
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        if (!cm.isCosmeticEquipped(style) && available.indexOf(style) == -1) {
            available.push(style);
        }
    }
    if (available.length === 0) {
        return styles;
    }
    return available;
}

function start() {
    status = -1;
    category = -1;
    subPage = 0;
    currentList = [];
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;

    if (status == 0) {
        var msg = "           #e#b[ VIP Beauty Salon & Style Changer ]#k#n\r\n";
        msg += "Welcome! You can customize your character's appearance anytime.\r\n";
        msg += "#ePrice per change:#n #r10,000 NX#k (Free for GMs)\r\n";
        msg += "#eYour Current NX:#n #b" + formatNumber(cm.getNX()) + " NX#k\r\n\r\n";
        msg += "#L0##bChange Skin Tone (10,000 NX)#k#l\r\n";
        msg += "#L1##bChange Hair Color (10,000 NX)#k#l\r\n";
        msg += "#L2##bChange Eye Color (10,000 NX)#k#l\r\n";
        msg += "#L3##bHairstyles Catalog (10,000 NX)#k#l\r\n";
        msg += "#L4##bFaces & Eyes Catalog (10,000 NX)#k#l\r\n";

        cm.sendSimple(msg);
    } else if (status == 1) {
        category = selection;

        if (category == 0) {
            // Skin
            currentList = filterPreviewStyles(skin);
            cm.sendStyle("Choose your preferred skin tone:\r\nPrice: #r10,000 NX#k", currentList);
        } else if (category == 1) {
            // Hair Color
            var curHair = cm.getPlayer().getHair();
            var baseHair = curHair - (curHair % 10);
            var colorList = [];
            for (var c = 0; c <= 7; c++) {
                colorList.push(baseHair + c);
            }
            currentList = filterPreviewStyles(colorList);
            cm.sendStyle("Choose your desired hair dye color:\r\nPrice: #r10,000 NX#k", currentList);
        } else if (category == 2) {
            // Eye Color
            var curFace = cm.getPlayer().getFace();
            var baseFace = curFace - (Math.floor((curFace / 100) % 10) * 100);
            var eyeList = [];
            for (var ec = 0; ec <= 700; ec += 100) {
                eyeList.push(baseFace + ec);
            }
            currentList = filterPreviewStyles(eyeList);
            cm.sendStyle("Choose your desired eye lens color:\r\nPrice: #r10,000 NX#k", currentList);
        } else if (category == 3) {
            // Hair Catalog - select collection
            var isMale = cm.getPlayer().getGender() == 0;
            var list = isMale ? maleHairs : femaleHairs;
            var genderStr = isMale ? "Male" : "Female";

            var msg = "         #e#b[ " + genderStr + " Hairstyles Catalog ]#k#n\r\n";
            msg += "Select a collection to preview (Cost: 10,000 NX):\r\n\r\n";
            for (var i = 0; i < list.length; i++) {
                msg += "#L" + i + "#Hairstyle Collection #" + (i + 1) + "#l\r\n";
            }
            cm.sendSimple(msg);
        } else if (category == 4) {
            // Face Catalog
            var isMale = cm.getPlayer().getGender() == 0;
            var msg = "         #e#b[ Faces & Expressions Catalog ]#k#n\r\n";
            msg += "Select a face collection to preview (Cost: 10,000 NX):\r\n\r\n";
            var faceList = isMale ? maleFaces : femaleFaces;
            for (var i = 0; i < faceList.length; i++) {
                msg += "#L" + i + "#Standard Faces #" + (i + 1) + "#l\r\n";
            }
            for (var s = 0; s < specialFaces.length; s++) {
                msg += "#L" + (100 + s) + "#Special / Anime Faces #" + (s + 1) + "#l\r\n";
            }
            cm.sendSimple(msg);
        }
    } else if (status == 2) {
        if (category == 0 || category == 1 || category == 2) {
            // Chosen style from direct list
            applyChosenStyle(selection);
        } else if (category == 3) {
            // Selected hair page
            var isMale = cm.getPlayer().getGender() == 0;
            var hairGroup = isMale ? maleHairs : femaleHairs;
            subPage = selection;
            if (subPage < 0 || subPage >= hairGroup.length) {
                cm.dispose();
                return;
            }
            var curColor = cm.getPlayer().getHair() % 10;
            var listWithColor = [];
            for (var h = 0; h < hairGroup[subPage].length; h++) {
                listWithColor.push(hairGroup[subPage][h] + curColor);
            }
            currentList = filterPreviewStyles(listWithColor);
            cm.sendStyle("Choose your new hairstyle:\r\nPrice: #r10,000 NX#k", currentList);
        } else if (category == 4) {
            // Selected face page
            var isMale = cm.getPlayer().getGender() == 0;
            var faceGroup;
            if (selection >= 100) {
                faceGroup = specialFaces[selection - 100];
            } else {
                faceGroup = (isMale ? maleFaces : femaleFaces)[selection];
            }
            if (!faceGroup) {
                cm.dispose();
                return;
            }
            var curFace = cm.getPlayer().getFace();
            var curEyeColor = Math.floor((curFace / 100) % 10) * 100;
            var listWithColor = [];
            for (var f = 0; f < faceGroup.length; f++) {
                listWithColor.push(faceGroup[f] + curEyeColor);
            }
            currentList = filterPreviewStyles(listWithColor);
            cm.sendStyle("Choose your new face expression:\r\nPrice: #r10,000 NX#k", currentList);
        }
    } else if (status == 3) {
        // Chosen style from sub-collection
        applyChosenStyle(selection);
    }
}

function applyChosenStyle(selection) {
    if (selection < 0 || selection >= currentList.length) {
        cm.dispose();
        return;
    }

    if (!canAfford()) {
        cm.sendOk("You do not have enough NX for this style change.\r\n#eRequired:#n #r10,000 NX#k\r\n#eYour current NX:#n #b" + formatNumber(cm.getNX()) + " NX#k.");
        cm.dispose();
        return;
    }

    var chosen = currentList[selection];
    var costPaid = chargePlayer();

    if (category == 0) {
        // Skin
        cm.setSkin(chosen);
    } else if (category == 1) {
        // Hair color
        cm.setHair(chosen);
    } else if (category == 2) {
        // Eye color
        cm.setFace(chosen);
    } else if (category == 3) {
        // Hair style
        cm.setHair(chosen);
    } else if (category == 4) {
        // Face expression
        cm.setFace(chosen);
    }

    cm.showEffect("avatar/congratulation");
    cm.sendOk("Your new style has been applied successfully!\r\nPayment: #b" + costPaid + "#k.\r\nEnjoy your new look!");
    cm.dispose();
}
