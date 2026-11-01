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
/* Aura
 * 
 * Adobis's Mission I: Unknown Dead Mine (280010000)
 * 
 * Zakum PQ NPC (the one and only)
*/

var status;
var selectedType;
var gotAllDocs;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        var eim = cm.getPlayer().getEventInstance();

        if (status == 0) {
            if (!eim.isEventCleared()) {
                cm.sendSimple("...#b\r\n#L0#¿Qué se supone que debo hacer aquí?#l\r\n#L1#¡Traje artículos!#l\r\n#L2#¡Quiero salir!#l");
            } else {
                cm.sendNext("Completaste esta terrible experiencia, ahora recibe tu premio.");
            }
        } else if (status == 1) {
            if (!eim.isEventCleared()) {
                selectedType = selection;
                if (selection == 0) {
                    cm.sendNext("Para revelar el poder de Zakum, tendrás que recrear su núcleo. Escondido en algún lugar de esta mazmorra hay un#b\"Mineral de fuego\"#kque es uno de los materiales necesarios para ese núcleo. Encuéntralo y tráemelo.\r\n\r\nAh y ¿podrías hacerme un favor? También hay una serie de#bDocumentos en papel#kyaciendo debajo de las rocas por aquí. Si puedes conseguir 30 de ellos, puedo recompensarte por tus esfuerzos.");
                    cm.dispose();

                } else if (selection == 1) {
                    if (!cm.isEventLeader()) {
                        cm.sendNext("Por favor, deja que tu líder me traiga los materiales para completar esta terrible experiencia.");
                        cm.dispose();
                        return;
                    }

                    if (!cm.haveItem(4001018)) { //fire ore
                        cm.sendNext("Por favor trae el#bMineral de fuego#kcontigo.");
                        cm.dispose();
                    } else {
                        gotAllDocs = cm.haveItem(4001015, 30);
                        if (!gotAllDocs) { //documents
                            cm.sendYesNo("Entonces, ¿trajiste el mineral de fuego contigo? En ese caso, puedo darte a ti y a cada miembro de tu grupo una parte, eso debería ser más que suficiente para formar el núcleo de Zakum. Asegúrese de que todo su grupo tenga espacio en su inventario antes de continuar.");
                        } else {
                            cm.sendYesNo("Entonces, ¿trajiste el mineral de fuego y los documentos? En ese caso, puedo darte a ti y a cada miembro de tu grupo una parte, eso debería ser más que suficiente para formar el núcleo de Zakum. Además, ya que usted#rtrajo los documentos#kcontigo, también puedo proporcionarte un artículo especial que#bllevarte a la entrada de la mina en cualquier momento#k. Asegúrese de que todo su grupo tenga espacio en su inventario antes de continuar.");
                        }
                    }
                } else if (selection == 2) {
                    cm.sendYesNo("¿Estás seguro de que quieres salir? Si eres el líder del partido, tu partido también será eliminado de las minas.");
                }
            } else {
                if (eim.getProperty("gotDocuments") == 1) {
                    if (eim.gridCheck(cm.getPlayer()) == -1) {
                        if (cm.canHoldAll([2030007, 4031061], [5, 1])) {
                            cm.gainItem(2030007, 5);
                            cm.gainItem(4031061, 1);

                            eim.gridInsert(cm.getPlayer(), 1);
                        } else {
                            cm.sendOk("Asegúrese de tener espacio en su inventario antes de continuar.");
                        }
                    } else {
                        cm.sendOk("Ya has recibido tu parte. Ahora puedes salir de las minas a través del portal de allí.");
                    }
                } else {
                    if (eim.gridCheck(cm.getPlayer()) == -1) {
                        if (cm.canHold(4031061, 1)) {
                            cm.gainItem(4031061, 1);

                            eim.gridInsert(cm.getPlayer(), 1);
                        } else {
                            cm.sendOk("Asegúrese de tener espacio en su inventario antes de continuar.");
                        }
                    } else {
                        cm.sendOk("Ya has recibido tu parte. Ahora puedes salir de las minas a través del portal de allí.");
                    }
                }

                cm.dispose();
            }

        } else if (status == 2) {
            if (selectedType == 1) {
                cm.gainItem(4001018, -1);

                if (gotAllDocs) {
                    cm.gainItem(4001015, -30);

                    eim.setProperty("gotDocuments", 1);
                    eim.giveEventPlayersExp(20000);
                } else {
                    eim.giveEventPlayersExp(12000);
                }

                eim.clearPQ();
                cm.dispose();
            } else if (selectedType == 2) {
                cm.warp(211042300);
                cm.dispose();
            }
        }
    }
}