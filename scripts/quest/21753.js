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
            qm.sendNext("Aran, he descubierto algunas noticias inquietantes... Dijiste que venías de la sección del bosque oriental, ¿verdad? Rastreamos y estudiamos la magia que se utiliza para sostener el portal allí. Resulta que es de un#rtemporal#tipo k. Las prendas que estás usando... nunca antes se habían visto por ahí. Eso debe significar,#rdebes haber venido del futuro#k.");
        } else if (status == 1) {
            qm.sendNext("Ahora sobre el problema: la Piedra Sello que parece haber faltado en tu línea de tiempo... Es un artefacto poderoso, que impide que el ejército de los#rmago negro#kde sitiar nuestro mundo. Si esa piedra desaparece, nada más podrá impedirlo. Como se trata de un asunto de gran importancia, busque la#ryo mío#kdel futuro. en realidad soy un#rfairy#k con una gran esperanza de vida, debo estar vivo incluso en tu línea de tiempo. Entiendo,#rTráeme del futuro#k!");
        } else if (status == 2) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
