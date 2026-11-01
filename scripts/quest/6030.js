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
/* 
	Quest: Carson's Fundamentals of Alchemy
 */

var status = -1;

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
            qm.sendNext("Debo enseñarte sobre los fundamentos de la Alquimia.");
        } else if (status == 1) {
            qm.sendNextPrev("Si bien la ciencia es buena para observar el lado reflexivo de los elementos que componen los artículos, por sí sola no es suficiente para diseñar un artículo.");
        } else if (status == 2) {
            qm.sendNextPrev("De hecho, para poder 'contar las piezas' hasta convertirse en un todo, ¿cómo se debe hacer? Los métodos rústicos de la herrería acaban embruteciendo algunas potencialidades latentes de los objetos.");
        } else if (status == 3) {
            qm.sendNextPrev("Se puede emplear la alquimia para esta tarea. Limpia y rápidamente,#rfusiona las partes que forman un artículo casi sin inconvenientes#k, aprovechando al máximo el proceso casi sin desperdicios, si se hace correctamente. Se necesita un tiempo para dominarlo, pero una vez hecho, todo saldrá perfectamente.");
        } else if (status == 4) {
            qm.sendNextPrev("Y recuerda esto: el máximo de #bExchange#k, el área de los fundamentos de la Alquimia donde la cantidad total del material no cambia, es que ningún objeto puede crearse de la nada. ¿Comprendido?");
        } else if (status == 5) {
            qm.gainMeso(-10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}