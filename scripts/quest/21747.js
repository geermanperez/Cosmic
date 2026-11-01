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
            qm.sendAcceptDecline("¿Quién hubiera pensado que el sucesor del héroe reaparecería después de cientos de años...? ¿Traerás prosperidad a Maple World o pondrás fin a su existencia? Supongo que realmente no importa. Muy bien, te diré lo que sé sobre la Piedra Sello de Mu Lung.");
        } else if (status == 1) {
            qm.sendNext("La Piedra Sello de Mu Lung se encuentra en el Templo Sellado. Encontrarás la entrada en lo profundo del templo Mu Lung. Puedes ingresar al Templo Sellado si encuentras el pilar con la palabra \"Entrada\" escrita en él. La contraseña es:#bLas acciones hablan mejor que las palabras.#k. Tal vez encuentres al Caballero de las Sombras allí, ya que probablemente me esté esperando allí. Creo que el sucesor del héroe es más capaz de enfrentarlo que yo, así que prepárate.");
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
            qm.sendNext("Entonces has derrotado al Caballero de las Sombras. Nunca he dudado de tu trabajo y manejaste bien la tarea.");
        } else if (status == 1) {
            qm.sendNext("Pero aún así, algo te hizo infeliz. ¿Qué podría ser? ... No... ¿Alas Negras se llevó la piedra del Sello? Me temo que ya no se puede hacer nada. Te sugiero que regreses con el estratega de tu grupo, ¿verdad?, y le cuentes la situación ahora. Cuéntale sobre la pérdida aquí en Mu Lung. ¡No hay tiempo que perder, date prisa!");
        } else if (status == 2) {
            qm.gainExp(16000);
            qm.forceCompleteQuest();

            qm.dispose();
        }
    }
}