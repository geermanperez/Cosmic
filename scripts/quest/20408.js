/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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

var status = -1;

function start(mode, type, selection) { // missing script for questid found thanks to Jade™
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendNext("#h0#... Antes que nada, gracias por tu gran trabajo. Si no fueras tú, yo... no estaría a salvo de la maldición de Black Witch. Muchas gracias.");
        } else if (status == 1) {
            qm.sendNextPrev("Al menos, esta cadena de eventos deja una cosa muy clara: has dedicado innumerables horas de arduo trabajo para mejorar y contribuir a los Cygnus Knights.");
        } else if (status == 2) {
            qm.sendAcceptDecline("Para celebrar su arduo trabajo y sus logros... me gustaría otorgarle un nuevo título y renovarle mis bendiciones. ¿Aceptarás... esto?");
        } else if (status == 3) {
            if (!qm.canHold(1142069, 1)) {
                qm.sendOk("Por favor, deja una habitación disponible en tu inventario EQUIP para la medalla.");
                qm.dispose();
                return;
            }

            qm.gainItem(1142069, 1);
            if (qm.getJobId() % 10 == 1) {
                qm.changeJobById(qm.getJobId() + 1);
            }

            qm.forceStartQuest();
            qm.forceCompleteQuest();

            qm.sendOk("#h0#. Por luchar valientemente contra el Mago Negro, te nombraré nuevo Caballero Jefe de los Caballeros Cygnus a partir de este momento. Utilice su poder y autoridad sabiamente para ayudar a proteger a los ciudadanos de Maple World.");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}
