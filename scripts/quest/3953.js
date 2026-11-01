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
            qm.sendSimple("Eh, ¿sigues diciendo que Deo es un monstruo? No, Deo no es un monstruo, es un líder pacífico del cactus real de la región.\r\n\r\n#L0##b¿Has oído que un grupo de comerciantes que cruzaban el desierto fueron atacados por los monstruos?#k");
        } else if (status == 1) {
            qm.sendSimple("¿Es eso así? Me pregunto por qué estos comerciantes deambulaban tan imprudentemente por el desierto. ¡Invadieron el territorio de los Cactus! En primer lugar, no deberían estar deambulando, primero deberían tener el permiso del Consejo Ariant.\r\n\r\n#L0##bTodo esto se debe a la negligencia de la Reina a la hora de mantener la seguridad de la ciudad.#k");
        } else if (status == 2) {
            qm.sendSimple("Ehh... Sí, a la ciudad realmente no le está yendo bien debido al gobierno actual, eso es de hecho un hecho. Si tan solo los Guardianes de los Desiertos regresaran para poner orden en este desastre...\r\n\r\n#L0##b¿Qué hace el Guardián de los Desiertos cuando estamos bajo la tiranía de la Reina?#k");
        } else if (status == 3) {
            qm.sendSimple("Han partido en una expedición para deshacerse de algunas amenazas importantes en el desierto que estaban asolando a Ariant, desde hace bastante tiempo... Es extraño, ya deberían haber regresado... Pensándolo bien ahora, el último ataque a los comerciantes fue en la dirección en la que partieron los Guardianes... No, eso no puede ser... ¿O sí?\r\n\r\n#L0##bQuizás Deo ya se haya convertido en un monstruo.#k");
        } else if (status == 4) {
            qm.forceCompleteQuest();
            qm.gainItem(4011008, -1);
            qm.gainExp(20000);

            qm.sendNext("Estamos en un gran problema, si es así. Y realmente lo parece. Si el Royal Cactus Deo se ha vuelto loco, Ariant está acabado. Tú, ¿puedes hacer algo para derrotar a Deo? Realmente necesitamos tu ayuda ahora.");
        } else if (status == 5) {
            qm.dispose();
        }
    }
}