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
	Quest: Hughes the Fuse's Basic of Theory of Science
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
            qm.sendNext("Debo enseñarles los conceptos básicos de la Teoría de la Ciencia.");
        } else if (status == 1) {
            qm.sendNextPrev("Etapas de la ciencia donde la alquimia no cumple con los requisitos. Todos los elementos tienen constituciones moleculares. El#rnaturaleza de sus disposiciones y de cada unidad intrínseca de materia#kdefine las muchas propiedades que tendrá un elemento.");
        } else if (status == 2) {
            qm.sendNextPrev("Esto también es cierto en el escenario del #rMaker#k. Uno debe poder estudiar las trazas de cada componente que se utiliza para formar el producto, para poder saber si el experimento tendrá éxito o fracasará.");
        } else if (status == 3) {
            qm.sendNextPrev("Ténganlo en cuenta: la perspectiva principal de la ciencia, ese motor que la hace fluir más fuerte, sea cual sea el escenario, es el aspecto de#bentender el proceso#kque genere los resultados, no simplemente desperdiciar intentos a voluntad.");
        } else if (status == 4) {
            qm.sendNextPrev("Eso ha quedado claro, ¿verdad? Bien, entonces se acabó la clase. Despedido.");
        } else if (status == 5) {
            qm.gainMeso(-10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}