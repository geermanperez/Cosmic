/*
 * VIP Beauty Salon (NPC 9900000) - EverleafMS / YunaMS
 * GraalJS compatible: no regex, safe v83 style IDs only
 * Removed: 33xxx/35xxx male hairs, 34xxx/37xxx female hairs,
 *           23xxx male faces, 24xxx female faces, all specialFaces (22/25/26xxx)
 */

var status = -1;
var category = -1;
var subPage = 0;
var pageList = [];
var COST_NX = 10000;

// Skin: 0=Light 1=Tanned 2=Dark 3=Pale — all safe in v83
var skin = [0, 1, 2, 3];

// Male hairs — ONLY 30xxx range (confirmed v83 client)
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
    [30750, 30760, 30770, 30780, 30790, 30800, 30810, 30820]
];

// Female hairs — ONLY 31xxx range (confirmed v83 client)
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
    [31750, 31760, 31770, 31780, 31790, 31800, 31810, 31820]
];

// Male faces — ONLY 20xxx (removed 23xxx — not in base v83)
var maleFaces = [
    [20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007],
    [20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015],
    [20016, 20017, 20018, 20019, 20020, 20021, 20022, 20023],
    [20024, 20025, 20026, 20027, 20028, 20029, 20030, 20031],
    [20032, 20033, 20035, 20036, 20037, 20038, 20039, 20040]
];

// Female faces — ONLY 21xxx (removed 24xxx — not in base v83)
var femaleFaces = [
    [21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007],
    [21008, 21009, 21010, 21011, 21012, 21013, 21014, 21015],
    [21016, 21017, 21018, 21019, 21020, 21021, 21022, 21023],
    [21024, 21025, 21026, 21027, 21028, 21029, 21030, 21031],
    [21033, 21034, 21035, 21036, 21037, 21038, 21041, 21042]
];

// specialFaces REMOVED entirely (22xxx/25xxx/26xxx crash clients)

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

function isGM() {
    return cm.getPlayer().getGMLevel() > 0;
}

function canAfford() {
    return isGM() || cm.getNX() >= COST_NX;
}

function buildStyleList(base) {
    var result = [];
    for (var i = 0; i < base.length; i++) {
        result.push(base[i]);
    }
    return result;
}

function start() {
    status = -1;
    category = -1;
    subPage = 0;
    pageList = [];
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
        var msg = "           #e#b[ VIP Beauty Salon ]#k#n\r\n";
        msg += "Customize your look! Cost: #r10,000 NX#k (Free for GMs)\r\n";
        msg += "Your NX: #b" + formatNumber(cm.getNX()) + " NX#k\r\n\r\n";
        msg += "#L0##bChange Skin Tone#k#l\r\n";
        msg += "#L1##bChange Hair Color (keeps your style, changes color)#k#l\r\n";
        msg += "#L2##bChange Eye Color (keeps your face, changes eyes)#k#l\r\n";
        msg += "#L3##bHairstyle Catalog#k#l\r\n";
        msg += "#L4##bFace Catalog#k#l\r\n";
        cm.sendSimple(msg);

    // ── STATUS 1: Category picked ────────────────────────────────────────────
    } else if (status == 1) {
        category = selection | 0;

        if (category == 0) {
            // Skin
            pageList = buildStyleList(skin);
            cm.sendStyle("Pick your skin tone:\r\nCost: #r10,000 NX#k", pageList);

        } else if (category == 1) {
            // Hair color (recolor current style, colors 0-7)
            var curHair = cm.getPlayer().getHair() | 0;
            var baseHair = curHair - (curHair % 10);
            var colors = [];
            for (var c = 0; c <= 7; c++) colors.push(baseHair + c);
            pageList = buildStyleList(colors);
            cm.sendStyle("Pick a hair dye color:\r\nCost: #r10,000 NX#k", pageList);

        } else if (category == 2) {
            // Eye color (recolor current face, eye slots 0-600 step 100)
            var curFace = cm.getPlayer().getFace() | 0;
            var baseFace = curFace - (Math.floor((curFace / 100) % 10) * 100);
            var eyes = [];
            for (var ec = 0; ec <= 600; ec += 100) eyes.push(baseFace + ec);
            pageList = buildStyleList(eyes);
            cm.sendStyle("Pick an eye color:\r\nCost: #r10,000 NX#k", pageList);

        } else if (category == 3) {
            // Hairstyle catalog — pick a page
            var isMale = cm.getPlayer().getGender() == 0;
            var list = isMale ? maleHairs : femaleHairs;
            var gStr = isMale ? "Male" : "Female";
            var msg = "         #e#b[ " + gStr + " Hairstyle Catalog ]#k#n\r\n";
            msg += "Select a collection (Cost: 10,000 NX):\r\n\r\n";
            for (var i = 0; i < list.length; i++) {
                msg += "#L" + i + "#Hairstyles " + (i * 8 + 1) + "-" + (i * 8 + 8) + "#l\r\n";
            }
            cm.sendSimple(msg);

        } else if (category == 4) {
            // Face catalog — pick a page
            var isMale = cm.getPlayer().getGender() == 0;
            var flist = isMale ? maleFaces : femaleFaces;
            var msg = "         #e#b[ Face Catalog ]#k#n\r\n";
            msg += "Select a collection (Cost: 10,000 NX):\r\n\r\n";
            for (var i = 0; i < flist.length; i++) {
                msg += "#L" + i + "#Faces " + (i * 8 + 1) + "-" + (i * 8 + 8) + "#l\r\n";
            }
            cm.sendSimple(msg);

        } else {
            cm.dispose();
        }

    // ── STATUS 2: Style picked from direct list OR page picked from catalog ──
    } else if (status == 2) {
        if (category == 0 || category == 1 || category == 2) {
            doApply(selection);

        } else if (category == 3) {
            // Page selected → show hair styles
            subPage = selection | 0;
            var isMale = cm.getPlayer().getGender() == 0;
            var hairGroup = isMale ? maleHairs : femaleHairs;
            if (subPage < 0 || subPage >= hairGroup.length) { cm.dispose(); return; }
            var curColor = (cm.getPlayer().getHair() | 0) % 10;
            var hairs = [];
            for (var h = 0; h < hairGroup[subPage].length; h++) {
                hairs.push((hairGroup[subPage][h] | 0) + curColor);
            }
            pageList = buildStyleList(hairs);
            cm.sendStyle("Pick a hairstyle:\r\nCost: #r10,000 NX#k", pageList);

        } else if (category == 4) {
            // Page selected → show faces
            subPage = selection | 0;
            var isMale = cm.getPlayer().getGender() == 0;
            var faceGroup = (isMale ? maleFaces : femaleFaces)[subPage];
            if (!faceGroup) { cm.dispose(); return; }
            var curFace = cm.getPlayer().getFace() | 0;
            var curEyeColor = Math.floor((curFace / 100) % 10) * 100;
            var faces = [];
            for (var f = 0; f < faceGroup.length; f++) {
                faces.push((faceGroup[f] | 0) + curEyeColor);
            }
            pageList = buildStyleList(faces);
            cm.sendStyle("Pick a face:\r\nCost: #r10,000 NX#k", pageList);

        } else {
            cm.dispose();
        }

    // ── STATUS 3: Style picked from sub-collection ───────────────────────────
    } else if (status == 3) {
        doApply(selection);

    } else {
        cm.dispose();
    }
}

function doApply(idx) {
    idx = idx | 0;

    if (idx < 0 || idx >= pageList.length) {
        cm.dispose();
        return;
    }

    if (!canAfford()) {
        cm.sendOk("You need #r10,000 NX#k to change your style.\r\nYour NX: #b" + formatNumber(cm.getNX()) + "#k.");
        // Next action click → status > 3 → dispose
        return;
    }

    var chosen = pageList[idx] | 0;

    if (category == 0) {
        cm.setSkin(chosen);
    } else if (category == 1 || category == 3) {
        cm.setHair(chosen);
    } else if (category == 2 || category == 4) {
        cm.setFace(chosen);
    }

    if (!isGM()) {
        cm.gainNX(-COST_NX);
    }

    cm.dispose();
}
