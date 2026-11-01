/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

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
    status++;
    if (mode != 1) {
        if (mode == 0 && type == 1) {
            qm.sendNext("¡Ey! ¡Al menos di que lo intentaste!");
        }
        qm.dispose();
        return;
    }
    if (status == 0) {
        qm.sendNext("Espera... ¿No es eso... ¿Recuerdas cómo hacer Red Jade?\r\nWow... puede que seas estúpido y propenso a la amnesia, pero es por eso que no puedo abandonarte. ¡Ahora dame el jade!"); //Giant Polearm
    } else if (status == 1) {
        qm.sendNextPrev("Bien, ahora que he vuelto a tener el Red Jade, déjame trabajar para despertar más de tus habilidades. Quiero decir, tu nivel ha subido mucho más desde la última vez que nos vimos, ¡así que estoy seguro de que puedo hacer mi magia un poco más esta vez!");
    } else if (status == 2) {
        if (!qm.isQuestCompleted(21302)) {
            if (!qm.canHold(1142131)) {
                qm.sendOk("Vaya, su inventario #bequip#k está lleno. Necesito que hagas al menos 1 espacio vacío para completar esta misión.");
                qm.dispose();
                return;
            }

            if (qm.haveItem(4032312, 1)) {
                qm.gainItem(4032312, -1);
            }

            qm.gainItem(1142131, true);
            qm.changeJobById(2111);

            const YamlConfig = Java.type('config.YamlConfig');
            if (YamlConfig.config.server.USE_FULL_ARAN_SKILLSET) {
                qm.teachSkill(21110002, 0, 20, -1);   //full swing
            }

            qm.completeQuest();
        }

        qm.sendNext("¡Vamos, sigue entrenando para que puedas recuperar todas tus habilidades y así podremos explorar juntos una vez más!");
    } else if (status == 3) {
        qm.dispose();
    }
}