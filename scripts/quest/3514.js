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
/* Author: PurpleMadness
 * The sorcerer who sells emotions
*/

var status = -1;

function start(mode, type, selection) {
    if (qm.getPlayer().getMeso() >= 1000000) {
        if (qm.canHold(2022337, 1)) {
            qm.gainItem(2022337, 1);
            qm.gainMeso(-1000000);

            //qm.sendOk("Es un placer hacer negocios contigo~~.");
            qm.startQuest(3514);
        } else {
            qm.sendOk("Primero busque un espacio en su inventario USE.");
        }
    } else {
        qm.sendOk("Oye, no tienes el dinero. yo cobro#r1.000.000 mesos#kpara la poción de emoción. Sin dinero no hay trato.");
    }

    qm.dispose();
}

function usedPotion(ch) {
    const BuffStat = Java.type('client.BuffStat');
    return ch.getBuffSource(BuffStat.HPREC) == 2022337;
}

function end(mode, type, selection) {
    if (mode == 0 && type == 0) {
        status--;
    } else if (mode == -1) {
        qm.dispose();
        return;
    } else {
        status++;
    }

    if (status == 0) {
        if (!usedPotion(qm.getPlayer())) {
            if (qm.haveItem(2022337)) {
                qm.sendOk("¿Tienes miedo de beber la poción? Te puedo asegurar que tiene solo un menor.#refecto secundario#k.");
            } else {
                if (qm.canHold(2022337)) {
                    qm.gainItem(2022337, 1);
                    qm.sendOk("¿Lo perdiste? Por suerte para ti logré recuperarlo. Tómalo.");
                } else {
                    qm.sendOk("¿Lo perdiste? Por suerte para ti logré recuperarlo. Haz un espacio para conseguirlo.");
                }
            }

            qm.dispose();

        } else {
            qm.sendOk("Parece que la poción funcionó y tus emociones ya no están congeladas. Y, oh Dios mío... Estás enfermo, #bpurge#k, dímelo rápido.");
        }
    } else if (status == 1) {
        qm.gainExp(891500);
        qm.completeQuest(3514);
        qm.dispose();
    }
}