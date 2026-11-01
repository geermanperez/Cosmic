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

function start(mode, type, selection) {
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
            qm.sendNext("Hola, Aran. Pareces bastante fuerte, desde el momento en que te liberaste del glaciar. Lo suficientemente adecuado para#bmontar un lobo#k, si me preguntas.");
        } else if (status == 1) {
            qm.sendAcceptDecline("Elegiste tu interés, ¿eh? Muy bien, primero debes dirigirte a#bAqua#k, hay una persona ahí que hace#rcomida para cachorros de lobo#k. Tráeme una porción y consideraré que eres capaz de domesticar y cuidar una. ¿Qué dices? ¿Lo intentarás?");
        } else if (status == 2) {
            qm.forceStartQuest();
            qm.sendNext("Está bien. El que debes conocer es#bNanuke#k, ella está encima de un#rballena nevada#k, en algún lugar del océano. ¡Buena suerte!");
        } else if (status == 3) {
            qm.dispose();
        }
    }
}