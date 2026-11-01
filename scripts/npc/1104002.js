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

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        var mapobj = cm.getMap();

        if (mode == 0 && type > 0) {
            cm.getPlayer().dropMessage(5, "Eleanor: Oh, ¿perdiste a la Emperatriz y todavía nos desafías? ¡Ahora lo has hecho! Prepárate!!!");

            const LifeFactory = Java.type('server.life.LifeFactory');
            const Point = Java.type('java.awt.Point');
            mapobj.spawnMonsterOnGroundBelow(LifeFactory.getMonster(9001010), new Point(850, 0));
            mapobj.destroyNPC(1104002);

            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (!cm.isQuestStarted(20407)) {
                cm.sendOk("... Caballero, todavía#bParece inseguro para enfrentar esta pelea.#k, ¿no? No hay gracia en desafiar a alguien cuando todavía no está mentalmente preparado para la batalla. Habla en paz con ese pájaro grande y torpe tuyo, tal vez te dé algo de valor.");
                cm.dispose();
                return;
            }

            cm.sendAcceptDecline("¡Jajajajaja! La Emperatriz de este lugar ya está bajo mi dominio, eso seguramente es un gran avance en el#bAlas Negras#k' derrocamiento hacia Maple World... ¿Y tú, ahí? ¿Aún quiere enfrentarnos? O, mejor aún, ya que pareces lo suficientemente fuerte como para ser un refuerzo suplementario a nuestro servicio,#r¿Cumplirás con nuestras expectativas y te apetece unirte a nosotros?#kya que no hay nada más que puedas hacer?");
        } else if (status == 1) {
            cm.sendOk("Je, los cobardes no tienen lugar en el#rmago negro#kejército. ¡Comenzó!");
            cm.dispose();
        }
    }
}
