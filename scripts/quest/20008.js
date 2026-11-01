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
	Author : Generic
	NPC Name: 		Kiku
	Map(s): 		Empress' Road : Training Forest I
	Description: 		Quest - The Path of a Knight
	Quest ID : 		20000
*/

var status = -1;
var choice1;

function start(mode, type, selection) {
    if (mode < 1) {
        qm.dispose();
    } else if (mode > 0) {
        status++;
    }
    if (status == 0) {
        qm.sendSimple("¿Estás listo para asumir una misión? Si no puedes pasar esta prueba, no podrás llamarte un verdadero Caballero. ¿Estás seguro de que puedes hacer esto? Si tienes miedo de hacer esto, dímelo. No se lo diré a Neinheart.\r\n #L0#Intentaré esto más tarde.#l \r\n #L1#No tengo miedo. Hagamos esto.#l");
    } else if (status == 1) {
        if (selection == 0) {
            qm.sendNext("Si te llamas Caballero, no lo dudes. Muéstrales a todos cuánto coraje tienes en ti.");
            qm.dispose();
        } else if (selection == 1) {
            choice1 = selection;
            qm.sendSimple("Me alegra que no te hayas escapado, pero... ¿estás seguro de que quieres convertirte en un Caballero en Entrenamiento? Lo que estoy preguntando es si estás de acuerdo con ser un Caballero Cygnus y, por lo tanto, estar atado a la Emperatriz en todo momento. Puede que sea una emperatriz, pero también es sólo una niña. ¿Estás seguro de que puedes luchar por ella? No se lo haré saber a Neinheart, así que dime lo que realmente sientes.\r\n #L2#Si la Emperatriz quiere la paz en Maple World, entonces estoy dispuesta a lo que sea.#l \r\n #L3#Mientras pueda convertirme en caballero, soportaré cualquier cosa.#l");
            qm.forceStartQuest();
            qm.forceCompleteQuest();
        }
    } else if (status == 2) {
        qm.dispose();
    }
}