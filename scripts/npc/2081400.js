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
/*
 *@Author:  Moogra
 *@NPC:     4th Job Thief Advancement NPC
 *@Purpose: Handles 4th job.
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (cm.getLevel() < 120 || Math.floor(cm.getJobId() / 100) != 4) {
                cm.sendOk("Por favor, no me molestes ahora, estoy tratando de concentrarme.");
                cm.dispose();
            } else if (!cm.isQuestCompleted(6934)) {
                cm.sendOk("Aún no has pasado mis pruebas. No puedo adelantarte hasta que lo hagas.");
                cm.dispose();
            } else if (cm.getJobId() % 100 % 10 != 2) {
                cm.sendYesNo("Hiciste un trabajo maravilloso al aprobar mi examen. ¿Estás listo para avanzar a tu cuarto trabajo?");
            } else {
                cm.sendSimple("Si es necesario, puedo enseñarte el arte de tu clase.\r\n#b#L0#Enséñame las habilidades de mi clase.#l");
                //cm.dispose();
            }
        } else if (status == 1) {
            if (mode >= 1 && cm.getJobId() % 100 % 10 != 2) {
                if (cm.canHold(2280003, 1)) {
                    cm.changeJobById(cm.getJobId() + 1);
                    if (cm.getJobId() == 412) {
                        cm.teachSkill(4120002, 0, 10, -1);
                        cm.teachSkill(4120005, 0, 10, -1);
                        cm.teachSkill(4121006, 0, 10, -1);
                    } else if (cm.getJobId() == 422) {
                        cm.teachSkill(4220002, 0, 10, -1);
                        cm.teachSkill(4220005, 0, 10, -1);
                        cm.teachSkill(4221007, 0, 10, -1);
                    }
                    cm.gainItem(2280003, 1);
                } else {
                    cm.sendOk("Tenga un espacio disponible en el inventario #bUSE#k para recibir un libro de habilidades.");
                }
            } else if (mode >= 1 && cm.getJobId() % 100 % 10 == 2) {
                if (cm.getJobId() == 412) {
                    if (cm.getPlayer().getSkillLevel(4121008) == 0) {
                        cm.teachSkill(4121008, 0, 10, -1);
                    }
                    if (cm.getPlayer().getSkillLevel(4121004) == 0) {
                        cm.teachSkill(4121004, 0, 10, -1);
                    }
                } else if (cm.getJobId() == 422) {
                    if (cm.getPlayer().getSkillLevel(4221004) == 0) {
                        cm.teachSkill(4221004, 0, 10, -1);
                    }
                    if (cm.getPlayer().getSkillLevel(4221001) == 0) {
                        cm.teachSkill(4221001, 0, 10, -1);
                    }
                }
                cm.sendOk("Está hecho. Déjame ahora.");
            }

            cm.dispose();
        }
    }
}
