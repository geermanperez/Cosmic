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
/* NPC Base
	Map Name (Map ID)
	Extra NPC info.
 */

var status;
var ticketId = 5220000;
var mapName = ["Henesys", "Ellinia", "Perion", "Kerning City", "Sleepywood", "Mushroom Shrine", "Showa Spa (M)", "Showa Spa (F)", "Ludibrium", "New Leaf City", "El Nath", "Nautilus"];
var curMapName = "";

function start() {
    status = -1;
    curMapName = mapName[(cm.getNpc() != 9100117 && cm.getNpc() != 9100109) ? (cm.getNpc() - 9100100) : cm.getNpc() == 9100109 ? 9 : 11];

    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0 && mode == 1) {
            if (cm.haveItem(ticketId)) {
                cm.sendYesNo("Puedes usar el" + curMapName + "Gachapón. ¿Quieres utilizar tu billete de Gachapón?");
            } else {
                cm.sendSimple("Bienvenido a la" + curMapName + "Gachapón. ¿Cómo puedo ayudarte?\r\n\r\n#L0#¿Qué es Gachapón?#l\r\n#L1#¿Dónde se pueden comprar entradas para Gachapón?#l");
            }
        } else if (status == 1 && cm.haveItem(ticketId)) {
            if (cm.canHold(1302000) && cm.canHold(2000000) && cm.canHold(3010001) && cm.canHold(4000000)) { // One free slot in every inventory.
                cm.gainItem(ticketId, -1);
                cm.doGachapon();
            } else {
                cm.sendOk("Por favor tenga al menos una ranura en su#rEQUIPAR, USAR, CONFIGURAR,#ky#rETC#k inventarios libres.");
            }
            cm.dispose();
        } else if (status == 1) {
            if (selection == 0) {
                cm.sendNext("¡Juega a Gachapon para ganar pergaminos, equipos, sillas, libros de dominio y otros artículos interesantes! Todo lo que necesitas es un#bBoleto Gachapón#kser el ganador de una combinación aleatoria de artículos.");
            } else {
                cm.sendNext("Los boletos para Gachapón están disponibles en el#rTienda de efectivo#ky se puede comprar usando NX o Maple Points. Haga clic en la TIENDA roja en la esquina inferior derecha de la pantalla para visitar el#rTienda de efectivo#kdonde puedes adquirir entradas.");
            }
        } else if (status == 2) {
            cm.sendNextPrev("Encontrarás una variedad de artículos del" + curMapName + "Gachapon, pero lo más probable es que encuentres objetos y pergaminos relacionados con" + curMapName + ".");
        } else {
            cm.dispose();
        }
    }
}