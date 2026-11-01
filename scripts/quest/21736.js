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
            qm.sendNext("¡Mucho tiempo sin verlo! Has subido mucho de nivel desde la última vez que nos vimos. Debes estar entrenando muy duro. Siempre trabajador. No me sorprende. Es exactamente lo que haría un héroe como tú. Estoy seguro de que Lilin estará feliz de saber sobre tu progreso.");
        } else if (status == 1) {
            qm.sendNextPrev("De todos modos, basta de charlas triviales. Me di cuenta de que también podría ser más eficaz buscar información en lugares fuera de la isla Victoria, así que comencé a investigar en Ossiria. Comencé con #bOrbis#k e inmediatamente gané el premio mayor.");
        } else if (status == 2) {
            qm.sendNextPrev("Parece que algo extraño está sucediendo en Orbis en Ossiria. Es un poco diferente de cuando estábamos lidiando con el titiritero, pero mis instintos me dicen que tiene que ver con los Black Wings. Dirígete a Orbis.");
        } else if (status == 3) {
            qm.sendAcceptDecline("#bLisa el hada#kEn Orbis deberíamos saber un par de cosas. Ve a ver a Lisa primero, ella conoce a alguien que sabe el paradero de la piedra selladora. esa persona#rle pedirá una contraseña#k, cuando se le solicite utilice el#bAlgo extraño está pasando en Orbis....#kpalabra clave para hablar con ella. ¿Comprendido?");
        } else if (status == 4) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}