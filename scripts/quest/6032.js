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
	Quest: Meren's Class on the Actual Practice
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
            qm.sendNext("Entonces has venido a asistir a mi clase, ¿eh? Bien, lo haré rápido.");
        } else if (status == 1) {
            qm.sendNextPrev("Te enseñaré la aplicación real del#bMaker#método k. Todo lo que necesitas hacer es tener un artículo en mente para hacer, reunir todos los ingredientes del recibo y mezclarlos en un#rmanera científicamente alquimista#k. Fácil, ¿no?");
        } else if (status == 2) {
            qm.sendNextPrev("Tomemos como ejemplo producir el#bPendientes de peso#kcomo ejemplo. Hay una cosa bastante específica#rteoría de la ductilidad#kpara generarlo, como cualquier otro elemento \"único\", el nombre que aparece alrededor del#rfuerza física principal#kactuando sobre aquello en lo que estamos trabajando: en ese caso, el#bTeoría de la Ductilidad de la Gravedad#k(ya que son 'pendientes ponderados', ¿entendido?).");
        } else if (status == 3) {
            qm.sendNextPrev("Ok, ahora necesitas pasarme una tarifa, 10.000 mesos o sea, por esa información. La tarifa cobrada se utilizará para adquirir los materiales necesarios para aprender el fino arte del #bMaker#k.");
        } else if (status == 4) {
            qm.gainMeso(-10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}