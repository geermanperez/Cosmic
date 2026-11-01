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
var status;
var choice;
var guildName;

var allianceCost = 2000000;
var increaseCost = 1000000;
var allianceLimit = 5;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.getPlayer().getGuildId() < 1 || cm.getPlayer().getGuildRank() != 1) {
            cm.sendNext("¡Hola! Soy #bLenario#k. Sólo los maestros de gremio pueden intentar formar sindicatos de gremio.");
            cm.dispose();
            return;
        }

        cm.sendSimple("¡Hola! Soy#bLenario#k.\r\n#b#L0#¿Puedes decirme de qué se trata Guild Union?#l\r\n#L1#¿Cómo hago una unión de gremio?#l\r\n#L2#Quiero hacer una unión gremial.#l\r\n#L3#Quiero agregar más gremios para Guild Union.#l\r\n#L4#Quiero disolver la Unión del Gremio.#l");
    } else if (status == 1) {
        choice = selection;
        if (selection == 0) {
            cm.sendNext("Guild Union es tal como dice, una unión de varios gremios para formar un súper grupo. Estoy a cargo de gestionar estos sindicatos de gremios.");
            cm.dispose();
        } else if (selection == 1) {
            cm.sendNext("Para hacer una Unión de Gremio, dos y sólo#bdos Guild Masters deben estar en un grupo#ky#bAmbos deben estar presentes en esta sala.#ken el mismo canal. El líder de este grupo será asignado como Maestro de la Unión del Gremio.\r\n\r\nInicialmente,#bsolo dos gremios#kpuedes formar parte de la nueva Unión, pero con el tiempo podrás#rexpand#k la capacidad de la Unión hablando conmigo cuando llegue el momento e invirtiendo en una tarifa estipulada.");
            cm.dispose();
        } else if (selection == 2) {
            if (!cm.isLeader()) {
                cm.sendNext("Si desea formar un sindicato gremial, dígale al líder de su partido que hable conmigo. Él / Ella será asignado como Líder del Sindicato del Gremio.");
                cm.dispose();
                return;
            }
            if (cm.getPlayer().getGuild().getAllianceId() > 0) {
                cm.sendOk("No puedes crear una Unión de Gremio mientras tu gremio ya esté registrado en otra.");
                cm.dispose();
                return;
            }

            cm.sendYesNo("Oh, ¿estás interesado en formar una unión gremial? La tarifa actual para esta operación es #b" + allianceCost + "mesos#k.");
        } else if (selection == 3) {
            if (cm.getPlayer().getMGC() == null) {
                cm.sendOk("No puedes expandir una Unión de Gremio si no posees una.");
                cm.dispose();
                return;
            }

            var rank = cm.getPlayer().getMGC().getAllianceRank();
            if (rank == 1) {
                cm.sendYesNo("¿Quieres aumentar tu Alianza en#run gremio#k¿ranura? El costo de este trámite es#b" + increaseCost + "mesos#k.");
            } else {
                cm.sendNext("Solo el Guild Union Master puede ampliar el número de gremios en la Unión.");
                cm.dispose();
            }
        } else if (selection == 4) {
            if (cm.getPlayer().getMGC() == null) {
                cm.sendOk("No puedes disolver un sindicato de gremio si no eres propietario de uno.");
                cm.dispose();
                return;
            }

            var rank = cm.getPlayer().getMGC().getAllianceRank();
            if (rank == 1) {
                cm.sendYesNo("¿Estás seguro de que quieres disolver tu sindicato de gremio?");
            } else {
                cm.sendNext("Sólo el Maestro de la Unión del Gremio puede disolver la Unión del Gremio.");
                cm.dispose();
            }
        }
    } else if (status == 2) {
        if (choice == 2) {
            if (cm.getMeso() < allianceCost) {
                cm.sendOk("No tienes suficientes mesos para esta solicitud.");
                cm.dispose();
                return;
            }
            cm.sendGetText("Ahora ingrese el nombre de su nueva Unión de Gremio. (máximo 12 letras)");
        } else if (choice == 3) {
            if (cm.getAllianceCapacity() == allianceLimit) {
                cm.sendOk("Tu alianza ya alcanzó la capacidad máxima de gremios.");
                cm.dispose();
                return;
            }
            if (cm.getMeso() < increaseCost) {
                cm.sendOk("No tienes suficientes mesos para esta solicitud.");
                cm.dispose();
                return;
            }

            cm.upgradeAlliance();
            cm.gainMeso(-increaseCost);
            cm.sendOk("Tu alianza ahora puede aceptar un gremio más.");
            cm.dispose();
        } else if (choice == 4) {
            if (cm.getPlayer().getGuild() == null || cm.getPlayer().getGuild().getAllianceId() <= 0) {
                cm.sendNext("No puedes disolver una Unión de Gremios inexistente.");
                cm.dispose();
            } else {
                cm.disbandAlliance(cm.getClient(), cm.getPlayer().getGuild().getAllianceId());
                cm.sendOk("Su sindicato de gremio ha sido disuelto.");
                cm.dispose();
            }
        }
    } else if (status == 3) {
        guildName = cm.getText();
        cm.sendYesNo("Voluntad '" + guildName + "'¿Será el nombre de su sindicato de gremios?");
    } else if (status == 4) {
        if (!cm.canBeUsedAllianceName(guildName)) {
            cm.sendNext("Este nombre no está disponible, elija otro."); //Not real text
            status = 1;
            choice = 2;
        } else {
            if (cm.createAlliance(guildName) == null) {
                cm.sendOk("Verifique si usted y el otro líder de gremio de su grupo están aquí en esta sala en este momento y asegúrese de que ambos gremios no estén registrados actualmente en los sindicatos. Ningún otro líder de gremio debería estar presente contigo 2 en este proceso.");
            } else {
                cm.gainMeso(-allianceCost);
                cm.sendOk("Has formado con éxito un sindicato de gremio.");
            }
            cm.dispose();
        }
    }
}