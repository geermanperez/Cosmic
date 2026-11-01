/* Author: aaroncsn <MapleSea Like>
	NPC Name: 		Aldin
	Map(s): 		The Burning Road: Ariant(2600000000)
	Description: 	Ariant Plastic Surgery

        GMS-like revised by Ronan -- contents found thanks to Mitsune (GamerBewbs), Waltzing, AyumiLove
*/

var status = 0;
var beauty = 0;
var mface_r = Array(20001, 20003, 20009, 20010, 20025, 20031);
var fface_r = Array(21002, 21009, 21011, 21013, 21016, 21029, 21030);
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
        if (type == 7) {
            cm.sendNext("Ya veo... tómate tu tiempo, mira si realmente lo quieres. Avísame cuando te decidas.");
        }

        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("Hola, soy el médico asistente de cirugía facial de por aquí. con un#b#t5152029##ko un#b#t5152048##kPuedo hacer que funcione muy bien, créeme. ¡Ah, no lo olvides, lo que viene después de la operación será aleatorio! Entonces, ¿a qué vas?\r\n#L1#Cirugía plástica:#i5152029##t5152029##l\r\n#L2#Lente cosmética:#i5152048##t5152048##l");
        } else if (status == 1) {
            if (selection == 1) {
                beauty = 0;

                facenew = Array();
                if (cm.getChar().getGender() == 0) {
                    for (var i = 0; i < mface_r.length; i++) {
                        pushIfItemExists(facenew, mface_r[i] + cm.getChar().getFace()
                            % 1000 - (cm.getChar().getFace()
                                % 100));
                    }
                }
                if (cm.getChar().getGender() == 1) {
                    for (var i = 0; i < fface_r.length; i++) {
                        pushIfItemExists(facenew, fface_r[i] + cm.getChar().getFace()
                            % 1000 - (cm.getChar().getFace()
                                % 100));
                    }
                }
                cm.sendYesNo("Si usas el cupón regular, tu rostro puede transformarse en una nueva apariencia aleatoria... ¿todavía quieres hacerlo usando#b#t5152029##k?");
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
                cm.sendYesNo("Si utiliza el cupón normal, se le otorgará un par de lentes cosméticos al azar. ¿Vas a utilizar un#b#t5152048##ky realmente hacer el cambio en tus ojos?");
            }
        } else if (status == 2) {
            cm.dispose();

            if (beauty == 0) {
                if (cm.haveItem(5152029) == true) {
                    cm.gainItem(5152029, -1);
                    cm.setFace(facenew[Math.floor(Math.random() * facenew.length)]);
                    cm.sendOk("¡Disfruta de tu cara nueva y mejorada!");
                } else {
                    cm.sendNext("Um... parece que no tienes el cupón específicamente para este lugar... lamento decirte esto, pero sin el cupón, no hay cirugía plástica para ti.");
                }
            } else if (beauty == 1) {
                if (cm.haveItem(5152048)) {
                    cm.gainItem(5152048, -1);
                    cm.setFace(colors[Math.floor(Math.random() * colors.length)]);
                    cm.sendOk("¡Disfruta de tus lentes cosméticos nuevos y mejorados!");
                } else {
                    cm.sendOk("Hmm... parece que no tienes el cupón específico para este lugar. Lamento decirte esto, pero sin el cupón, no hay cirugía plástica para ti...");
                }
            }
        }
    }
}