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
/*	
	Author: Traitor, XxOsirisxX, Moogra
*/

/**
 * Dojo Entrance NPC
 */
var status = -2;
var readNotice = 0;

function start() {
    cm.sendSimple("#e< Aviso >#n\r\nSi hay alguien que tenga el coraje de desafiar al Mu Lung Dojo, venga al Mu Lung Dojo.  -Mu Gong-\r\n\r\n\r\n#b#L0#Desafía al Mu Lung Dojo.#l\r\n#L1#Lea el aviso con más detalle.#l");
}

function action(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    }
    if (mode >= 0) {
        if (selection == 1 || readNotice == 1) {
            if (status == -1) {
                readNotice = 1;
                cm.sendNext("#e<Aviso: ¡Acepta el desafío! >#n\r\nMi nombre es Mu Gong, el dueño de My Lung Dojo. Desde hace mucho tiempo, he estado entrenando en Mu Lung hasta el punto en que mis habilidades han alcanzado la cima. A partir de hoy, aceptaré a todos los solicitantes de Mu Lung Dojo. Los derechos del Mu Lung Dojo se otorgarán únicamente a la persona más fuerte.\r\nSi hay alguien que desee aprender de mí, ¡acepte el desafío en cualquier momento! Si hay alguien que desee desafiarme, también es bienvenido. Te haré plenamente consciente de tu propia debilidad.");
            } else if (status == 0) {
                cm.sendPrev("PD: Puedes desafiarme por tu cuenta. Pero si no tienes ese tipo de coraje, sigue adelante y llama a todos tus amigos.");
            } else {
                cm.dispose();
            }
        } else {
            if (status == -1 && mode == 1) {
                cm.sendYesNo("(Una vez que puse mis manos en el tablón de anuncios, una energía misteriosa comenzó a envolverme). \r\n\r\n¿Te gustaría ir a Mu Lung Dojo?");
            } else if (status == 0) {
                if (mode == 0) {
                    cm.sendNext("#b(Cuando quité la mano del tablón de anuncios, la energía misteriosa que me cubría desapareció también).");
                } else {
                    cm.getPlayer().saveLocation("MIRROR");
                    cm.warp(925020000, 4);
                }
                cm.dispose();
            }
        }
    } else {
        cm.dispose();
    }
}