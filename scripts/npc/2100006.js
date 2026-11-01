/* Author: aaroncsn <MapleSea Like>
	NPC Name: 		Mazra
	Map(s): 		The Burning Road: Ariant(2600000000)
	Description: 	Hair Salon Owner

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
*/

var status = 0;
var beauty = 0;
var mhair_v = Array(30150, 30170, 30180, 30320, 30330, 30410, 30460, 30820, 30900);
var fhair_v = Array(31040, 31090, 31190, 31330, 31340, 31400, 31420, 31620, 31660);
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
    if (mode < 1) {  // disposing issue with stylishs found thanks to Vcoc
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendSimple("Jajaja... se necesita mucho estilo y talento para que alguien preste atención a su peinado en un desierto. Alguien como tú...si tienes#bCupón de peinado Ariant (VIP)#ko#bCupón de color de cabello Ariant (VIP)#k, Le daré a tu cabello un aspecto nuevo y fresco.\r\n#L0#Corte de pelo:#i5150027##t5150027##l\r\n#L1#Tiñe tu cabello:#i5151022##t5151022##l");
        } else if (status == 1) {
            if (selection == 0) {
                beauty = 1;
                hairnew = Array();
                if (cm.getChar().getGender() == 0) {
                    for (var i = 0; i < mhair_v.length; i++) {
                        pushIfItemExists(hairnew, mhair_v[i] + parseInt(cm.getChar().getHair()
                            % 10));
                    }
                }
                if (cm.getChar().getGender() == 1) {
                    for (var i = 0; i < fhair_v.length; i++) {
                        pushIfItemExists(hairnew, fhair_v[i] + parseInt(cm.getChar().getHair()
                            % 10));
                    }
                }
                cm.sendStyle("Jajaja ~ todo lo que necesitas es#bCupón de peinado Ariant (VIP)#kpara cambiar tu peinado. Elige el nuevo estilo y déjame hacer el resto.", hairnew);
            } else if (selection == 1) {
                beauty = 2;
                haircolor = Array();
                var current = parseInt(cm.getChar().getHair()
                    / 10) * 10;
                for (var i = 0; i < 8; i++) {
                    pushIfItemExists(haircolor, current + i);
                }
                cm.sendStyle("De vez en cuando, no está de más cambiar el color de tu cabello... es divertido. Permíteme, el gran Mazra, teñir tu cabello, así que tráeme#bCupón de color de cabello Ariant (VIP)#ky elige tu nuevo color de cabello.", haircolor);
            }
        } else if (status == 2) {
            cm.dispose();
            if (beauty == 1) {
                if (cm.haveItem(5150027) == true) {
                    cm.gainItem(5150027, -1);
                    cm.setHair(hairnew[selection]);
                    cm.sendOk("¡Disfruta de tu peinado nuevo y mejorado!");
                } else {
                    cm.sendNext("Creí haberte dicho que necesitas el cupón para que pueda hacer magia en tu cabello nuevamente.");
                }
            }
            if (beauty == 2) {
                if (cm.haveItem(5151022) == true) {
                    cm.gainItem(5151022, -1);
                    cm.setHair(haircolor[selection]);
                    cm.sendOk("¡Disfruta de tu nuevo y mejorado color de cabello!");
                } else {
                    cm.sendNext("Creí haberte dicho que necesitas el cupón para que pueda hacer magia en tu cabello nuevamente.");
                }
            }
        }
    }
}