/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var status = 0;
var selected = -1;
var party = 0;

function start() {
    cm.sendOk("El PyramidPQ no está disponible actualmente.");
    cm.dispose();
}

/*function start() {
	status = -1;
	var text = "You should NOT talk to this NPC in this map.";
	if (cm.getMapId() == 926020001)
		text = "Stop! You've succesfully passed Nett's test. By Nett's grace, you will now be given the opportunity to enter Pharaoh Yeti's Tomb. Do you wish to enter it now?\r\n\r\n#b#L0# Yes, I will go now.#l\r\n#L1# No, I will go later.#l";
	else if (cm.getMapId() == 926010000)
		text = "I am Duarte.\r\n\r\n#b#L0# Ask about the Pyramid.#l\r\n#e#L1# Enter the Pyramid.#l#n\r\n\r\n#L2# Find a Party.#l\r\n\r\n#L3# Enter Pharaoh Yeti's Tomb.#l\r\n#L4# Ask about Pharaoh Yeti's treasures.#l\r\n#L5# Receive the <Protector of Pharaoh> Medal.#l";
	else 
		text = "Do you want to forfeit the challenge and leave?\r\n\r\n#b#L0# Leave#l";
		
	cm.sendSimple(text);
}
*/

function action(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode < 0 || (type == 4 && mode == 0)) {
        cm.dispose();
        return;
    } else {
        status++;
    }

    if (cm.getMapId() == 926010000) {
        if (status == 0) {
            if (selection > -1) {
                selected = selection;
            }
            if (selection == 0 || selected == 0) {
                cm.sendNext("Esta es la pirámide de Nett, el dios del caos y la venganza. Durante mucho tiempo estuvo enterrado en lo profundo del desierto, pero Nett ordenó que se elevara a la superficie. Si no tienes miedo al caos y a la posible muerte, puedes desafiar al faraón Yeti, que yace dormido dentro de la pirámide. Cualquiera que sea el resultado, la elección es suya.");
            } else if (selection == 1) {
                cm.sendSimple("¡Necios que no conocen el miedo a la ira de Nett, ahora es el momento de elegir su destino!\r\n\r\n#b#L0#Entra solo.#l\r\n#L1#Ingrese con un grupo de 2 o más.#l");
            } else if (selection == 2) {
                cm.openUI(0x16);
                cm.showInfoText("Use the Party Search (Hotkey O) window to search for a party to join anytime and anywhere!");
                cm.dispose();
            } else if (selection == 3) {
                cm.sendSimple("¿Qué joya has traído?\r\n\r\n#L0##i4001322# #t4001322##l\r\n#L1##i4001323# #t4001323##l\r\n#L2##i4001324# #t4001324##l\r\n#L3##i4001325# #t4001325##l");
            } else if (selection == 4) {
                cm.sendNext("Dentro de la Tumba del Faraón Yeti, puedes adquirir un#e#b#t2022613##k#ndemostrando que eres capaz de derrotar al#bFaraón Jr. Yeti#k, el clon del faraón. Dentro de esa caja se encuentra un tesoro muy especial. es el#e#b#t1132012##k#n.\r\n#i1132012:# #t1132012#\r\n\r\nY si de alguna manera eres capaz de sobrevivir al Modo Infierno, recibirás el#e#b#t1132013##k#n.\r\n\r\n#i1132013:# #t1132013#\r\n\r\nAunque, por supuesto, Nett no permitirá que eso suceda.");
            } else if (selection == 5) {
                var progress = cm.getQuestProgressInt(29932);
                if (progress >= 50000) {
                    cm.dispose();
                } else {
                    cm.sendNext("");
                }

            }
        } else if (status == 1) {
            if (selected == 0) {
                cm.sendNextPrev("Una vez que ingreses a la Pirámide, te enfrentarás a la ira de Nett. Como no pareces demasiado elegante, te ofreceré algunos consejos y reglas a seguir. Recuérdalos bien.#b\r\n\r\n1. Tenga cuidado de que su#e#rIndicador de acto#b#nno disminuye. La única forma de mantener tu nivel de calibre es luchar contra los monstruos sin parar.\r\n2. Quienes no puedan, lo pagarán caro. Tenga cuidado de no causar ningún#rMiss#b.\r\n3. Tenga cuidado con el Faraón Jr. Yeti con el#v04032424#marca. Comete el error de atacarlo y te arrepentirás.\r\n4. Sea prudente al utilizar la habilidad que se le otorga para los logros de Matar.");
            } else if (selected == 1) {
                party = selection;
                cm.sendSimple("¡Tú que no tienes miedo a la crueldad de la muerte, toma tu decisión!\r\n#L0##i3994115##l#L1##i3994116##l#L2##i3994117##l#L3##i3994118##l");
            } else if (selected == 3) {
                if (selection == 0) {
                    if (cm.haveItem(4001322)) {
                        return;
                    }
                } else if (selection == 1) {
                    if (cm.haveItem(4001323)) {
                        return;
                    }
                } else if (selection == 2) {
                    if (cm.haveItem(4001324)) {
                        return;
                    }
                } else if (selection == 3) {
                    if (cm.haveItem(4001325)) {
                        return;
                    }
                }
                cm.sendOk("Necesitarás una gema para entrar a la tumba del faraón Yeti. ¿Estás seguro de que tienes uno?");
                cm.dispose();
            } else if (selected == 5) {
            } else {
                cm.dispose();
            }
        } else if (status == 2) {
            if (selected == 0) {
                cm.sendNextPrev("Aquellos que sean capaces de resistir la ira de Nett serán honrados, pero aquellos que fracasen se enfrentarán a la destrucción. Este es todo el consejo que puedo darte. El resto está en tus manos.");
            } else if (selected == 1) {
                var mode = "EASY";
                //Finish this
                var pqparty = cm.getPlayer().getParty();
                if (party == 1) {
                    if (pqparty == null) {
                        cm.sendOk("Crea un puto maricón de fiesta.");//BE NICE
                        cm.dispose();
                        return;
                    } else {
                        if (pqparty.getMembers().size() < 2) {
                            cm.sendOk("Consigue más miembros...");
                            cm.dispose();
                            return;
                        } else {
                            var i = 0;
                            for (var a = 0; a < pq.getMembers().size(); a++) {
                                var pqchar = pq.getMembers().get(a);
                                if (i > 1) {
                                    break;
                                }
                                if (pqchar != null && pqchar.getMapId() == 926010000) {
                                    i++;
                                }
                            }
                            if (i < 2) {
                                cm.sendOk("Asegúrate de que 2 o más miembros del grupo estén en tu mapa.");
                                cm.dispose();
                                return;
                            }
                        }
                    }
                }

                if (cm.getPlayer().getLevel() < 40) {
                    cm.sendOk("Debes ser Lv. 40+ para ingresar a este PQ.");
                    cm.dispose();
                    return;
                }
                if (selection < 3 && cm.getPlayer().getLevel() > 60) {
                    cm.sendOk("Solo el modo Infierno está disponible para jugadores que superan el nivel Lv. 60.");
                    cm.dispose();
                    return;
                }
                if (selection == 1) {
                    mode = "NORMAL";
                } else if (selection == 2) {
                    mode = "HARD";
                } else if (selection == 3) {
                    mode = "HELL";
                }

                if (!cm.createPyramid(mode, party == 1)) {
                    cm.sendOk("Todas las salas están llenas para este modo, inténtelo nuevamente más tarde o en otro canal):");
                }
                cm.dispose();
            }
        } else if (status == 3) {
            cm.dispose();
        }
    } else if (cm.getMapId() == 926020001) {
        if (status == 0) {
            if (selection == 0) {
                cm.dispose();
            }//:(
            else if (selection == 1) {
                cm.sendNext("Te daré la gema del faraón Yeti. Podrás ingresar a la Tumba del Faraón Yeti en cualquier momento con esta gema. Verifique si tiene al menos 1 espacio vacío en su ventana Etc.");
            }

        } else if (status == 1) {
            var itemid = 4001325;
            if (cm.getPlayer().getLevel() >= 60) {
                itemid = 4001325;
            }
            if (cm.canHold(itemid)) {
                cm.gainItem(itemid);
                cm.warp(926010000);
            } else {
                cm.showInfoText("You must have at least 1 empty slot in your Etc window to receive the reward.");
            }

            cm.dispose();
        }
    } else {
        cm.warp(926010000);
        cm.getPlayer().setPartyQuest(null);
        cm.dispose();
    }
}/*Do you want to forfeit the challenge and leave?

Your allotted time has passed. Do you want to leave now?



*/