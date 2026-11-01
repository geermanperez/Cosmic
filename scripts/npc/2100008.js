/* Author: aaroncsn <MapleSea Like>
	NPC Name: 		Vard
	Map(s): 		The Burning Road: Ariant(2600000000)
	Description: 	Ariant Plastic Surgery

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
*/

var status = 0;
var beauty = 0;
var mface_v = Array(20000, 20004, 20005, 20012, 20013, 20031);
var fface_v = Array(21000, 21003, 21006, 21009, 21012, 21024);
var facenew = Array();

function pushIfItemExists(array, itemid) {
    if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
        array.push(itemid);
    }
}

function pushIfItemsExists(array, itemidList) {
    for (var i = 0; i < itemidList.length; i++) {
        var itemid = itemidList[i];

        if ((itemid = cm.getCosmeticItem(itemid)) != -1 && !cm.isCosmeticEquipped(itemid)) {
            array.push(itemid);
        }
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
            cm.sendSimple("¡Ah, bienvenidos a Ariant Plastic Surgery! ¿Te gustaría transformar tu rostro en algo nuevo? con un#b#t5152030##ko un#b#t5152047##k¡Puedo mejorar tu cara mucho!\r\n#L1#Cirugía plástica:#i5152030##t5152030##l\r\n#L2#Lente cosmética:#i5152047##t5152047##l\r\n#L3#Lentes cosméticas de una sola vez:#i5152101#(cualquier color)#l");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 0;

                facenew = Array();
                if (cm.getChar().getGender() == 0) {
                    for (var i = 0; i < mface_v.length; i++) {
                        pushIfItemExists(facenew, mface_v[i] + cm.getChar().getFace()
                            % 1000 - (cm.getChar().getFace()
                                % 100));
                    }
                }
                if (cm.getChar().getGender() == 1) {
                    for (var i = 0; i < fface_v.length; i++) {
                        pushIfItemExists(facenew, fface_v[i] + cm.getChar().getFace()
                            % 1000 - (cm.getChar().getFace()
                                % 100));
                    }
                }
                cm.sendStyle("Hmmm... El rostro de la belleza brilla incluso a cubierto y en el desierto ardiente. Elige la cara que quieras y sacaré mi extraordinaria habilidad para realizar un gran cambio de imagen.", facenew);
            } else if (selection == 2) {
                beauty = 1;

                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 21000;
                }
                colors = Array();
                pushIfItemsExists(colors, [current, current + 100, current + 300, current + 600, current + 700]);
                cm.sendStyle("Con la máxima delicadeza a juego con las brillantes arenas del desierto que abraza alegremente la azotea del Palacio, haremos que tus ojos brillen aún más con las nuevas lentes. Seleccione el que desea utilizar...", colors);
            } else if (selection == 3) {
                beauty = 3;
                if (cm.getPlayer().getGender() == 0) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 20000;
                }
                if (cm.getPlayer().getGender() == 1) {
                    var current = cm.getPlayer().getFace()
                        % 100 + 21000;
                }

                colors = Array();
                for (var i = 0; i < 8; i++) {
                    if (cm.haveItem(5152100 + i)) {
                        pushIfItemExists(colors, current + 100 * i);
                    }
                }

                if (colors.length == 0) {
                    cm.sendOk("No tienes ninguna lente cosmética de un solo uso para usar.");
                    cm.dispose();
                    return;
                }

                cm.sendStyle("¿Qué tipo de lente te gustaría usar? Por favor elige el estilo de tu agrado.", colors);
            }
        } else if (status == 2) {
            cm.dispose();

            if (beauty == 0) {
                if (cm.haveItem(5152030) == true) {
                    cm.gainItem(5152030, -1);
                    cm.setFace(facenew[selection]);
                    cm.sendOk("¡Disfruta de tu cara nueva y mejorada!");
                } else {
                    cm.sendNext("Erm... Parece que no tienes el cupón exclusivo para este hospital. Sin el cupón, me temo que no puedo hacerlo por ti.");
                }
            } else if (beauty == 1) {
                if (cm.haveItem(5152047) == true) {
                    cm.gainItem(5152047, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Hmm... parece que no tienes el cupón específico para este lugar. Lamento decirte esto, pero sin el cupón, no hay cirugía plástica para ti...");
                }
            } else if (beauty == 3) {
                var color = (colors[selection] / 100) % 10 | 0;

                if (cm.haveItem(5152100 + color)) {
                    cm.gainItem(5152100 + color, -1);
                    cm.setFace(colors[selection]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Lo siento, pero no creo que tengas nuestro cupón para lentes cosméticos contigo en este momento. Sin el cupón, me temo que no puedo hacerlo por ti.");
                }
            }
        }
    }
}