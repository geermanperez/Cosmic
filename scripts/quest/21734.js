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
            qm.sendNext("Hola Aran. Recibimos un informe de que el Titiritero, uno de los miembros del Ala Negra, se encuentra actualmente#ben algún lugar del profundo bosque de Sleepywood#k. Tu misión es entrar al lugar y derrotarlo allí, de una vez por todas.");
        } else {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {
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
            qm.sendNext("¡Lo lograste, Aran! El Titiritero ya no perturbará más la paz en la Isla Victoria. Además, ahora podríamos investigar claramente las acciones del Ala Negra aquí, en Victoria.");
        } else if (status == 1) {
            qm.sendNext("Estaban detrás del#bsello de cristal de victoria#k. Estos sellos son lo que repele al Mago Negro a tomar los continentes a su alcance de una vez. Cada continente tiene uno, el de Victoria ahora está sano y salvo.");
        } else if (status == 2) {
            qm.sendNext("Por tu valentía aportada en esta serie de misiones, ahora te recompensaré adecuadamente. He aquí, el#rDrenaje combinado#kHabilidad: que te permite curar una parte del daño infligido a los monstruos.");
        } else if (status == 3) {
            qm.forceCompleteQuest();

            qm.gainExp(12500);
            qm.teachSkill(21100005, 0, 20, -1); // combo drain

            qm.dispose();
        }
    }
}