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
/* Papulatus - 7103
 */

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.sendOk("Ah, de verdad. ¿Necesitas más tiempo? Estoy completamente seguro de que me ayudarás antes de que se forme la Esfera del Tiempo.");
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.sendOk("Ah, de verdad. ¿Necesitas más tiempo? Estoy completamente seguro de que me ayudarás antes de que se forme la Esfera del Tiempo.");
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendYesNo("Lo único que tenemos que hacer ahora... es hacer que #o8500002# desaparezca para siempre... ¿estás listo?");
        } else if (status == 1) {
            qm.sendNext("Te explicaré lo que debes hacer de ahora en adelante.\r\nPara ingresar a la sala de generación de energía, deberá pasar#bPasaje olvidado#ko el#bPasaje deformado#k. Una vez que derrotes al monstruo que está protegiendo el pasaje, podrás obtener#b#t4031172:##k, que es necesario para ingresar a la sala de generación de energía.");
        } else if (status == 2) {
            qm.sendNextPrev("Luego ingresa a la habitación por la puerta del medio. Va a ser MUCHO más silencioso de lo que imaginabas. La Esfera del Tiempo debería estar escondida en un estado indetectable a nuestros ojos... pero si sella la grieta en la dimensión, el #o8500002#, entrando en pánico porque su ruta de salida está sellada, hará su aparición allí.");
        } else if (status == 3) {
            if (!qm.haveItem(4031179, 1)) {
                if (!qm.canHold(4031179, 1)) {
                    qm.sendOk("Por favor tenga un#rRanura ETC disponible#kpara comenzar esta búsqueda.");
                    qm.dispose();
                    return;
                }

                qm.gainItem(4031179, 1);
            }

            qm.sendAcceptDecline("Suelta el#b#t4031179:##kque volví a ti para sellar cualquier grieta que veas#o8500002#puede haber utilizado para entrar en esta dimensión en primer lugar. Luego saldrá de la Esfera del Tiempo y mostrará a todos su verdadera apariencia. Por favor, mátalo y luego regresa.\r\n\r\nRecolectar#r1 #t4031172:##k\r\nEliminar#r#o8500001##k");
        } else if (status == 4) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
