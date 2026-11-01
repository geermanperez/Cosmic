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
/**
 * @author: Ronan
 * @npc: Abdula
 * @map: Multiple towns on Maplestory
 * @func: Job Skill / Mastery Book Drop Announcer
 */

var status;
var selected = 0;
var skillbook = [], masterybook = [], table = [];

function start() {
    status = -1;
    selected = 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            var greeting = "Hello, I'm #p9209000#, the Skill & Mastery Book announcer! ";

            if (cm.getPlayer().isCygnus()) {
                cm.sendOk(greeting + "No hay libros de habilidades o dominio disponibles para Cygnus Knights.");
                cm.dispose();
                return;
            }

            var jobrank = cm.getJob().getId() % 10;
            if (jobrank < 2) {
                cm.sendOk(greeting + "Sigue entrenándote hasta llegar al#r4to trabajo#kde tu clase. ¡Nuevas oportunidades de mejora llegarán cuando alcances esa hazaña!");
                cm.dispose();
                return;
            }

            skillbook = cm.getAvailableSkillBooks();
            masterybook = cm.getAvailableMasteryBooks();

            if (skillbook.length == 0 && masterybook.length == 0) {
                cm.sendOk(greeting + "No hay libros disponibles para mejorar aún más tus habilidades laborales por ahora. O tu#bmaximizó todo#ko#bNo alcanzaste los requisitos mínimos para usar algunos libros de habilidades.#ktodavía.");
                cm.dispose();
            } else if (skillbook.length > 0 && masterybook.length > 0) {
                var sendStr = greeting + "New opportunities for skill improvement have been located for you to improve your skills! Pick a type to take a look onto.\r\n\r\n#b";

                sendStr += "#L1# Skill Book#l\r\n";
                sendStr += "#L2# Mastery Book#l\r\n";

                cm.sendSimple(sendStr);
            } else if (skillbook.length > 0) {
                selected = 1;
                cm.sendNext(greeting + "¡Se han localizado nuevas oportunidades para mejorar tus habilidades! Por ahora, solo está disponible el aprendizaje de habilidades.");
            } else {
                selected = 2;
                cm.sendNext(greeting + "¡Se han localizado nuevas oportunidades para mejorar tus habilidades! Sólo están disponibles las mejoras de habilidades.");
            }

        } else if (status == 1) {
            var sendStr = "The following books are currently available:\r\n\r\n";
            if (selected == 0) {
                selected = selection;
            }

            if (selected == 1) {
                table = skillbook;
                for (var i = 0; i < table.length; i++) {
                    if (table[i] > 0) {
                        var itemid = table[i];
                        sendStr += "  #L" + i + "# #i" + itemid + "#  #t" + itemid + "##l\r\n";
                    } else {
                        var skillid = -table[i];
                        sendStr += "  #L" + i + "# #s" + skillid + "#  #q" + skillid + "##l\r\n";
                    }
                }
            } else {
                table = masterybook;
                for (var i = 0; i < table.length; i++) {
                    var itemid = table[i];
                    sendStr += "  #L" + i + "# #i" + itemid + "#  #t" + itemid + "##l\r\n";
                }
            }

            cm.sendSimple(sendStr);

        } else if (status == 2) {
            selected = selection;

            var sendStr;
            if (table[selected] > 0) {
                var mobList = cm.getNamesWhoDropsItem(table[selected]);

                if (mobList.length == 0) {
                    sendStr = "No mobs drop '#b#t" + table[selected] + "##k'.\r\n\r\n";
                } else {
                    sendStr = "The following mobs drop '#b#t" + table[selected] + "##k':\r\n\r\n";

                    for (var i = 0; i < mobList.length; i++) {
                        sendStr += "  #L" + i + "# " + mobList[i] + "#l\r\n";
                    }

                    sendStr += "\r\n\r\n";
                }
            } else {
                sendStr = "\r\n\r\n";
            }

            sendStr += cm.getSkillBookInfo(table[selected]);

            cm.sendNext(sendStr);
            cm.dispose();
        }
    }
}
