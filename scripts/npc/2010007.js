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
/* guild creation npc */
var status = 0;
var sel;

function start() {
    cm.sendSimple("¿Qué te gustaría hacer?\r\n#b#L0#Crear un gremio#l\r\n#L1#Disuelve tu gremio#l\r\n#L2#Aumenta la capacidad de tu gremio#l#k");
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
        if (status == 1) {
            sel = selection;
            if (selection == 0) {
                if (cm.getPlayer().getGuildId() > 0) {
                    cm.sendOk("No puedes crear un nuevo gremio mientras estés en uno.");
                    cm.dispose();
                } else {
                    cm.sendYesNo("Crear un gremio cuesta#b1500000 mesos#k, ¿estás seguro de que quieres continuar?");
                }
            } else if (selection == 1) {
                if (cm.getPlayer().getGuildId() < 1 || cm.getPlayer().getGuildRank() != 1) {
                    cm.sendOk("Sólo puedes disolver un gremio si eres el líder de ese gremio.");
                    cm.dispose();
                } else {
                    cm.sendYesNo("¿Estás seguro de que quieres disolver tu gremio? No podrás recuperarlo después y todo tu médico de cabecera desaparecerá.");
                }
            } else if (selection == 2) {
                if (cm.getPlayer().getGuildId() < 1 || cm.getPlayer().getGuildRank() != 1) {
                    cm.sendOk("Sólo puedes aumentar la capacidad de tu gremio si eres el líder.");
                    cm.dispose();
                } else {
                    var Guild = Java.type("net.server.guild.Guild");  // thanks Conrad for noticing an issue due to call on a static method here
                    cm.sendYesNo("Aumentar la capacidad de tu gremio en #b5#k cuesta #b" + Guild.getIncreaseGuildCost(cm.getPlayer().getGuild().getCapacity()) + "mesos#k, ¿estás seguro de que quieres continuar?");
                }
            }
        } else if (status == 2) {
            if (sel == 0 && cm.getPlayer().getGuildId() <= 0) {
                cm.getPlayer().genericGuildMessage(1);
                cm.dispose();
            } else if (cm.getPlayer().getGuildId() > 0 && cm.getPlayer().getGuildRank() == 1) {
                if (sel == 1) {
                    cm.getPlayer().disbandGuild();
                    cm.dispose();
                } else if (sel == 2) {
                    cm.getPlayer().increaseGuildCapacity();
                    cm.dispose();
                }
            }
        }
    }
}
