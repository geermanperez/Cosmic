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

        if (status == 0) {  // thanks ZERO傑洛 for noticing this quest shouldn't need a pw -- GMS-like string data thanks to skycombat
            qm.sendNext("¿Qué es? Normalmente no doy la bienvenida a invitados no invitados, pero tienes un aura misteriosa que me hace sentir curiosidad por lo que tienes que decir.", 9);
        } else if (status == 1) {
            qm.sendNext("(Le cuentas sobre el gigante Nependeath.)", 3);
        } else if (status == 2) {
            qm.sendNext("¿Nepenmuerte gigante? Definitivamente es un gran problema, pero no creo que sea suficiente para afectar realmente a Orbis. Espera, ¿dónde dijiste que estaba el Gigante Nependeath?", 9);
        } else if (status == 3) {
            qm.sendNext("Ruta de paseo descuidada.", 3);
        } else if (status == 4) {
            qm.sendNext("...¿Camino de paseo olvidado? Si el Gigante Nependeath está allí, ¡alguien está intentando entrar en Sealed Garden! ¿Pero por qué? Y lo más importante ¿quién?", 9);
        } else if (status == 5) {
            qm.sendNext("¿Jardín Sellado?", 3);
        } else if (status == 6) {
            qm.sendAcceptDecline("No puedo hablarte de Sealed Garden. Si quieres saberlo, primero debo ver si eres digno de recibir la información. ¿Te importa si investigo tu destino?", 9);
        } else if (status == 7) {
            qm.sendOk("Bueno, ahora analicemos tu destino. Dame un segundo.");
        } else if (status == 8) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
