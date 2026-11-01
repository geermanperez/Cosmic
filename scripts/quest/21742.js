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
            qm.sendNext("Bueno, en realidad no estoy ocupado con nada, pero no tengo ganas de preparar medicinas. ¿Puedes volver más tarde? Si no te importa, muévete.", 9);
        } else if (status == 1) {
            qm.sendNextPrev("Escuché que conociste al Caballero de las Sombras de las Alas Negras.", 3);
        } else if (status == 2) {
            qm.sendNextPrev("Ah, ¿te refieres a ese tipo vestido de negro con una arruga amenazadora en la frente? Pues sí, lo hice. Lo conocí. Eventualmente compré un artículo para él. Me pidió que se lo entregara a ese anciano, Mu Gong.", 9);
        } else if (status == 3) {
            qm.sendNextPrev("¿Un artículo?", 3);
        } else if (status == 4) {
            qm.sendNextPrev("Si, un grande#bPergamino colgante#k. Me lo dio sin decir mucho. Sólo me pidió que se lo entregara. Parecía aterrador, como si fuera a perseguirme si no hacía lo que decía. Uffiii, esa fue una experiencia.", 9);
        } else if (status == 5) {
            qm.sendNextPrev("Entonces, ¿le entregaste el Pergamino Colgante?", 3);
        } else if (status == 6) {
            qm.sendAcceptDecline("Bueno, la cosa es... Hay un pequeño problema, ¿quieres escuchar?");
        } else if (status == 7) {
            qm.sendNext("Entonces lo que pasó fue... estaba haciendo un nuevo tipo de medicina, así que llené una olla con agua y comencé a hervir algunas hierbas. Fue entonces cuando cometí el error de... dejar caer el pergamino colgante directamente en la olla. Oh Dios, lo saqué lo más rápido que pude, pero el Pergamino Colgante ya estaba empapado y la escritura ya había desaparecido.", 9);
        } else if (status == 8) {
            qm.sendNextPrev("Entonces pensé, bueno, ¿cuál es el punto de entregárselo a Mu Gong? Primero debo restaurar la escritura en el Pergamino Colgante. Por eso necesito que hagas algo por mí. El tipo que está ahí abajo escribiendo en el Pergamino Colgante... es#bJin Jin#k, el artista más grande de todo Mu Lung. Estoy seguro de que podrá restaurar la escritura en el Pergamino Colgante.", 9);
        } else {
            if (!qm.haveItem(4220151, 1)) {
                if (!qm.canHold(4220151, 1)) {
                    qm.sendOk("Libere una habitación en su inventario de ETC.", 9);
                    qm.dispose();
                    return;
                }

                qm.gainItem(4220151, 1);
            }

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
            qm.sendNext("Oh, trajiste la tinta. Ahora déjame servirlo, con cautela... Ya casi, casi. ... ..... ¡Kyaaa! La carta. Dice: \"Estaré allí para llevarte tu Roca Sello de Mu Lung\".");
        } else if (status == 1) {
            qm.gainItem(4032342, -8);
            qm.gainItem(4220151, -1);
            qm.gainExp(10000);

            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}