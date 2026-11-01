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
            qm.sendNext("¿Has estado avanzando en tus niveles? Encontré una información interesante sobre Black Wings. Esta vez tendrás que viajar bastante. ¿Conoces un pueblo llamado#bMu-pulmón#k? Tendrás que dirigirte allí.");
        } else if (status == 1) {
            qm.sendAcceptDecline("Aparentemente,#bseñor hacer#ken Mu Lung de alguna manera se encontró con los Black Wings. No conozco los detalles. Vaya y descubra por qué los Black Wings contactaron al Sr. Do y qué sucedió exactamente entre ellos.");
        } else if (status == 2) {
            qm.sendNext("Se sabe que el Sr. Do es brusco, por lo que tendrás que tener paciencia mientras hablas con él. Habla con él con el#bEscuché que conociste al Caballero de las Sombras de las Alas Negras.#kpalabra clave.");
        } else if (status == 3) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
