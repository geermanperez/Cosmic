/**
 * @function AIO Style NPC
 * @npc Kin (9900001)
 * @note sendStyle can only take a 128 length array (signed byte)
 * @author Gijiko
 
Selections:
Skin (Body Makeup) = 0
Male Hair (Maple) = 1
Male Hair2 (Anime) = 2
Female Hair (Animal) = 4
Female Hair2 (Funky) = 5
Hair Color (Hair Dye) = 7
Specials (Face Makeup) = 12
Eye Color (Color Contacts) = 10
 */
 
// Gijiko: Removed 32020
 
var status = 0;
var selected;
var skin = [15, 16, 17, 14, 7, 4, 5, 9, 12, 13, 8];

var maleHair = new Array(37770, 37780, 37790, 36780, 36790, 36150, 33820, 34810, 33130, 34140, 34810, 34980, 36110, 36570, 37570, 36030, 34940, 34950, 38880, 38860, 36090, 33260, 36020, 36070, 33080, 34090, 36080, 34700, 34730, 33730, 33740, 37040, 37070, 33450, 34420,  36170, 36190, 33320, 34190, 34290, 34300, 33530, 34410, 36460, 37450, 37240, 37250, 37140, 37260, 37120, 37130, 36240, 36250, 35110, 35100, 38130, 37080, 37270, 36200, 37590, 37440, 36630, 37490, 36470, 36130, 36480, 37000, 37460, 38250, 38260, 35160, 35170, 39440, 37440, 36840, 36850, 37840, 35010, 37850, 37290, 37500, 39250, 39260, 35790, 35370, 33610, 34600, 34160);
var maleHair2 = new Array(32030, 32040, 32050, 32170, 32180, 32190, 32200, 32210, 32220, 32230, 32240, 32250, 32260, 32270, 32280, 32290, 32300, 32510, 32570, 32580, 32590, 32600, 32610, 32620, 32630, 32640, 32650, 32660, 32670, 32680, 32690, 33420, 33490, 34020, 34030, 34070, 34080, 34170, 34580, 34990, 35310, 38440, 35450, 36060, 36120, 36890, 37890, 36930, 37100, 37280, 37660, 37700, 37930, 37960, 36980, 38140, 38850, 39100, 39110, 39120, 39130, 39140, 39150, 39160, 39170, 39270, 39280, 39290, 39300, 39460, 39470, 39500, 39880);

var femaleHair = new Array(34450, 33430, 35400, 35440, 36320, 36660, 36690, 36770, 37400, 37690, 36900, 37920, 38310, 38840, 38920, 38950, 39180, 39230, 39510, 39580);
var femaleHair2 = new Array(35740, 39800, 39810, 39820, 36910, 39830, 39840, 39850, 32430, 32440, 32450, 32460, 32470, 32480, 32490, 32500);

var specialFace = new Array(25001, 25003, 25004, 25006, 25007, 25009, 25010, 25011, 25012, 25013, 26000, 26001, 26005, 26006, 26007, 26009, 26010, 26011, 26012, 26013, 26014, 20900, 20871, 21900, 22000, 22200, 22300, 22400, 22500, 22600, 22700, 22800, 28843, 28844, 23058, 28002, 28842);

var hairnew; // These are used so their selection is remembered for use in status 2
var haircolor;
var facenew;
var eyecolors;

function start() {
    cm.sendSimple("\t\t\t\t\t\t\t#eCosplay Catalog#n\r\n\t\t\t\t\t\t\t#L0#Body Makeup#l\r\n\t\t\t\t\t\t\t#L12#Face Makeup#l\r\n\t\t\t\t\t\t\t#L10#Color Contacts#l\r\n\t\t\t\t\t\t\t#L7#Hair Dye#l\r\n\r\n#L1#Maple Wigs #l\t\t\t\t\t\t#L2#Anime Wigs#l\r\n#L4#Animal Wigs#l\t\t\t\t\t\t#L5#Funky Wigs#l");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1){
        cm.dispose();
        return;
    }
    if (status == 1) {
        selected = selection;
        if (selection == 0) {
            skin = filterSkins(skin);
            cm.sendStyle("Choose a style!\r\nThere are " + skin.length + " styles to choose from.", skin);
        } else if (selection == 1 || selection == 2 || selection == 4 || selection == 5) {
			if (selection == 1 || selection == 4)
				hairnew = selection == 1 ? maleHair : femaleHair;
			else if (selection == 2 || selection == 5)
				hairnew = selection == 2 ? maleHair2 : femaleHair2;
            cm.sendStyle("Choose a style!\r\nThere are " + hairnew.length + " styles to choose from.", hairnew);
        } else if (selection == 7) {
			var setHairToBlack = setBlack(cm.getPlayer().getHair(), true);
			haircolor = range(setHairToBlack, setHairToBlack + 7, 1);
            cm.sendStyle("Which color?", haircolor);
        } else if (selection == 12) {
			facenew = specialFace;
            cm.sendStyle("Choose a style!\r\nThere are " + facenew.length + " styles to choose from.", facenew);
        } else if (selection == 10) {
			var setEyeToBlack = setBlack(cm.getPlayer().getFace(), false);
			eyecolors = range(setEyeToBlack, setEyeToBlack + 800, 100);
            cm.sendStyle("Which color?", eyecolors);
		}
    } else if (status == 2) {
        if (selected == 0)
            cm.setSkin(skin[selection]);
        else if (selected == 1 || selected == 2 || selected == 4 || selected == 5)
            cm.setHair(hairnew[selection]);
        else if (selected == 7)
            cm.setHair(haircolor[selection]);
        else if (selected == 12)
            cm.setFace(facenew[selection]);
        else if (selected == 10)
            cm.setFace(eyecolors[selection]);
        cm.dispose();
    }
}

function range(start, stop, increment) { // Apparently JavaScript does not come with this
	var arr = new Array();
	for (var i = start; i <= stop; i += increment)
		arr.push(i);
	return arr;
}

function filterSkins(styles) {
    var filtered = new Array();
    for (var i = 0; i < styles.length; i++) {
        if (cm.isSkinColorAvailable(styles[i])) {
            filtered.push(styles[i]);
        }
    }
    return filtered;
}

function setBlack(id, hair) {
	if (hair) {
		return id - (id % 10);
	} else { // eye
		return id - (Math.floor((id / 100) % 10) * 100);
	}
}
