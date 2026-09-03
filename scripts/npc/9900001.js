/* Cosplay & Special Styles - NimaKIN (9900001) - Strict v83 */
var status = 0;
var selected = -1;
var currentList = [];

var skin = [0, 1, 2, 3, 4, 5, 9, 10, 11];

var wigs1 = [32050, 32150, 32160, 32310, 32320, 32330, 32340, 32350, 32360, 32370, 32380, 32390, 32400, 32410, 32420, 32430, 32440, 32450, 32460, 32470, 32480, 32490, 32500, 32520, 32530, 32540, 32550, 32560, 32640, 32650, 32660, 32720, 32730];
var wigs2 = [32740, 32750, 32760, 39000, 39040, 39050, 39060, 39070, 39080, 39090, 39170, 39190, 39200, 39210, 39220, 39230, 39240, 39250, 39260, 39310, 39320, 39330, 39340, 39350, 39360, 39370, 39380, 39390, 39400, 39410, 39420, 39430, 39440];

var cosplayFace1 = [26046, 26047, 26048, 26049, 26050, 26051, 26052, 26053, 26054, 26055, 26056, 26057, 26058, 26059, 26060, 26061, 26062, 26063, 26064, 26065, 26066, 26067, 26073, 26074, 26075, 26076, 26077, 26078, 26079, 26080, 26081, 26082, 26083, 26084, 26085, 26086, 26089, 26090, 26091, 26094, 26095, 26096, 26097, 26099, 27006, 27007, 27008, 27009, 27010, 27011, 27013, 27014, 27015, 27016, 27017, 27018, 27019, 27020, 27021, 27022, 27023, 27024, 27025, 27035, 27036, 27037, 27038, 27039, 27040, 27041, 27048, 27051, 27052, 27053];
var cosplayFace2 = [27055, 27067, 27077, 27080, 27087, 27088, 27092, 27098, 27099, 28000, 28001, 28002, 28008, 28009, 28010, 28011, 28012, 28013, 28014, 28015, 28016, 28017, 28019, 28020, 28021, 28022, 28023, 28024, 28025, 28026, 28027, 28028, 28029, 28030, 28042, 28043, 28044, 28045, 28046, 28056, 28058, 28060, 28071, 28072, 28073, 28074, 28075, 28076, 28077, 28079, 28080, 28084, 28086, 28087, 28088, 28090, 28091, 28092, 28093, 28096, 28097, 28098, 29026, 29027, 29028, 29029, 29030, 29031, 29032, 29033, 29034, 29035, 29036, 29037];

function start() {
    status = 0;
    var msg = "\t\t#e#b[ Cosplay & Special Catalog - NimaKIN ]#k#n\r\n";
    msg += "#L0##bBody Makeup (Color de Piel)#k#l\r\n";
    msg += "#L1##bHair Dye (Color de Cabello)#k#l\r\n";
    msg += "#L2##bColor Contacts (Color de Ojos)#k#l\r\n\r\n";

    msg += "#e[Pelucas & Peinados Especiales]#n\r\n";
    msg += "#L10#Maple Wigs (" + wigs1.length + " estilos)#l\r\n";
    msg += "#L11#Anime & Special Wigs (" + wigs2.length + " estilos)#l\r\n\r\n";

    msg += "#e[Rostros Cosplay / Caras Especiales]#n\r\n";
    msg += "#L30#Cosplay Faces 1 (" + cosplayFace1.length + " estilos)#l\r\n";
    msg += "#L31#Cosplay Faces 2 (" + cosplayFace2.length + " estilos)#l\r\n";

    cm.sendSimple(msg);
}

function action(mode, type, selection) {
    if (mode != 1) {
        cm.dispose();
        return;
    }
    status++;
    if (status == 1) {
        selected = selection;
        currentList = [];

        if (selection == 0) {
            currentList = skin;
        } else if (selection == 1) {
            var curHair = cm.getPlayer().getHair();
            var baseHair = curHair - (curHair % 10);
            for (var c = 0; c <= 7; c++) {
                currentList.push(baseHair + c);
            }
        } else if (selection == 2) {
            var curFace = cm.getPlayer().getFace();
            var baseFace = curFace - (Math.floor((curFace / 100) % 10) * 100);
            for (var ec = 0; ec <= 700; ec += 100) {
                currentList.push(baseFace + ec);
            }
        } else if (selection == 10) {
            currentList = wigs1;
        } else if (selection == 11) {
            currentList = wigs2;
        } else if (selection == 30) {
            currentList = cosplayFace1;
        } else if (selection == 31) {
            currentList = cosplayFace2;
        }

        if (!currentList || currentList.length === 0) {
            cm.sendOk("No hay opciones disponibles en esta categoria.");
            cm.dispose();
            return;
        }

        cm.sendStyle("Elige tu estilo preferido:\r\nHay " + currentList.length + " estilos disponibles.", currentList);
    } else if (status == 2) {
        if (selection < 0 || selection >= currentList.length) {
            cm.dispose();
            return;
        }
        var chosen = currentList[selection];
        if (selected == 0) {
            cm.setSkin(chosen);
        } else if (selected == 1 || selected == 10 || selected == 11) {
            cm.setHair(chosen);
        } else if (selected == 2 || selected == 30 || selected == 31) {
            cm.setFace(chosen);
        }
        cm.dispose();
    }
}
