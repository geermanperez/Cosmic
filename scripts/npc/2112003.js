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
 * @npc: Juliet
 * @map: Magatia - Alcadno - Hidden Room (261000021)
 * @func: Magatia PQ (Alcadno)
 */

var status = 0;
var em = null;

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

        if (cm.getMapId() != 261000021) {
            if (status == 0) {
                cm.sendYesNo("Debemos seguir luchando para salvar a Romeo, por favor mantén el ritmo. Si no te sientes bien para continuar, tus compañeros y yo lo entenderemos... Entonces, ¿te vas a retirar?");
            } else if (status == 1) {
                cm.warp(926110700, 0);
                cm.dispose();
            }
        } else {
            if (status == 0) {
                em = cm.getEventManager("MagatiaPQ_A");
                if (em == null) {
                    cm.sendOk("El Magatia PQ (Alcadno) ha encontrado un error.");
                    cm.dispose();
                    return;
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<Misión del grupo: Romeo y Julieta>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\n¡Mi querido Romeo ha sido secuestrado! Aunque es zenumista, no puedo quedarme quieto y verlo sufrir sólo por este tonto choque. ¡Necesito que tú y tus colegas ayuden a salvarlo! ¡¡Por favor ayúdanos!! Por favor tenga su#blíder del partido#kháblame.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#Me gustaría escuchar más detalles.");
            } else if (status == 1) {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("Puedes participar en la misión del grupo solo si estás en un grupo.");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("El líder de tu grupo debe hablar conmigo para comenzar esta búsqueda del grupo.");
                        cm.dispose();
                    } else {
                        var eli = em.getEligibleParty(cm.getParty());
                        if (eli.size() > 0) {
                            if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                cm.sendOk("Otro partido ya ha entrado en el#rBúsqueda de fiesta#ken este canal. Prueba con otro canal o espera a que termine la fiesta actual.");
                            }
                        } else {
                            cm.sendOk("No puedes comenzar esta misión de grupo todavía porque tu grupo no está dentro del rango de tamaño, algunos de los miembros de tu grupo no son elegibles para intentarla o no están en este mapa. Si tienes problemas para encontrar miembros del grupo, prueba Party Search.");
                        }

                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("El estado de tu búsqueda de grupo es ahora: #b" + (psState ? "activado" : "desactivado") + "#k. Habla conmigo cuando quieras volver a cambiarlo.");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<Misión del grupo: Romeo y Julieta>#k#n\r\nNo hace mucho, un científico llamado Yulete ha sido desterrado de este pueblo debido a sus investigaciones sobre las alquimias combinadas de Alcadno y Zenumist. Debido a la inmensurable cantidad de poder que surge de esta combinación, la ley prohíbe estudiar ambos. Sin embargo, ignoró esta ley y participó en ambas investigaciones. A consecuencia de ello, ha sido exiliado.\r\nAhora está tomando represalias, ya se llevó a mi amada y su próximo objetivo soy yo, ya que somos grandes cuadros de Magatia, sucesores de ambas sociedades. Pero no tengo miedo. ¡Debemos recuperarlo a toda costa!\r\n");
                    cm.dispose();
                }
            }
        }
    }
}