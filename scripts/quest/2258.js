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
            qm.sendAcceptDecline("Las suricatas esparcen rumores como la pólvora... Al chantajearme a mí y a mi servicio de taxi, me están quitando clientes día tras día... Oye, no le cuentes a nadie sobre esto, si limpias un poco#rMeerkats#k desde mi camino te cuento una info sobre el#rCastillo de setas#k. ¿Qué dices?");
        } else if (status == 1) {
            qm.sendNext("Genial, tienes#r5 minutos#kmatar#b40 suricatas#kdentro de este tiempo. ¡Buena suerte!");
        } else if (status == 2) {
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
            qm.sendNext("¡Lo hiciste! ... Oye, #rMeerkats#k por aquí puede escuchar nuestra conversación. No voy a hablar de ESO ahora.");
        } else if (status == 1) {
            qm.forceCompleteQuest();
            qm.dispose();
        }
    }
}