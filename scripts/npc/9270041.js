/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Irene - Ticketing Usher
 -- By ---------------------------------------------------------------------------------------------
 Whoever written this script
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Whoever written this script
 2.0 - Second Version by Jayd
 ---------------------------------------------------------------------------------------------------
 **/

status = -1;
oldSelection = -1;

function start() {
    cm.sendSimple("Hola, soy Irene del aeropuerto de Singapur. Puedo ayudarle a llegar a Singapur en poco tiempo. ¿Quieres ir a Singapur?\r\n#b#L0#Me gustaría comprar un billete de avión a Singapur.\r\n#b#L1#Déjame entrar al punto de partida.");
}

function action(mode, type, selection) {
    status++;
    if (mode <= 0) {
        oldSelection = -1;
        cm.dispose();
    }

    if (status == 0) {
        if (selection == 0) {
            cm.sendYesNo("El billete te costará 5.000 mesos. ¿Comprarás el billete?");
        } else if (selection == 1) {
            cm.sendYesNo("¿Quieres entrar ahora? ¡Perderás tu boleto una vez que entres! Gracias por elegir Wizet Airline.");
        }
        oldSelection = selection;
    } else if (status == 1) {
        if (oldSelection == 0) {
            if (cm.getPlayer().getMeso() > 4999 && !cm.getPlayer().haveItem(4031731)) {
                if (cm.canHold(4031731, 1)) {
                    cm.gainMeso(-5000);
                    cm.gainItem(4031731);
                    cm.sendOk("¡Gracias por elegir Wizet Airline! ¡Disfruta de tu vuelo!");
                    cm.dispose();
                } else {
                    cm.sendOk("No tienes un espacio libre en tu inventario de ETC para el boleto, haz un espacio con anticipación.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("No tienes suficientes mesos o ya has comprado un billete.");
                cm.dispose();
            }
        } else if (oldSelection == 1) {
            if (cm.itemQuantity(4031731) > 0) {

                    cm.warp(540010000, 0);
                    cm.gainItem(4031731, -1);

            } else {
                cm.sendOk("Necesitas un#b#t4031731##k¡para subir al avión!");
            }
        }
        cm.dispose();
    }
}
