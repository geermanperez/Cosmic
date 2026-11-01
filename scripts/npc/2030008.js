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
/* Adobis
 * 
 * El Nath - The Door to Zakum (211042300)
 * 
 * Vs Zakum Recruiter NPC
 * 
 * Custom Quest 100200 = Whether you can start Zakum PQ
 * Custom Quest 100201 = Whether you have done the trials
*/

var status;
var em;
var selectedType;
var gotAllDocs;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.haveItem(4001109, 1)) {
            cm.warp(921100000, "out00");
            cm.dispose();
            return;
        }

        if (!(cm.isQuestStarted(100200) || cm.isQuestCompleted(100200))) {   // thanks Vcoc for finding out a need of reapproval from the masters for Zakum expeditions
            if (cm.getPlayer().getLevel() >= 50) {  // thanks Z1peR for noticing not-so-clear unmet requirements message here.
                cm.sendOk("Cuidado, porque el poder de antaño no ha sido olvidado... Si buscas derrotar#rZakum#k algun dia, gane el#bConsejo de Residencia del Jefe#kaprobación primero y luego#benfrentar las pruebas#k, sólo entonces serás elegible para luchar.");
            } else {
                cm.sendOk("Cuidado, porque el poder de antaño no ha sido olvidado...");
            }

            cm.dispose();
            return;
        }

        em = cm.getEventManager("ZakumPQ");
        if (em == null) {
            cm.sendOk("El Zakum PQ ha encontrado un error.");
            cm.dispose();
            return;
        }

        if (status == 0) {
            cm.sendSimple("#e#b<Misión del grupo: Campaña Zakum>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nCuidado, porque el poder de antaño no ha sido olvidado...#b\r\n#L0#Ingrese a la mina muerta desconocida (Etapa 1)#l\r\n#L1#Enfréntate al aliento de lava (Etapa 2)#l\r\n#L2#Forjando los ojos de fuego (Etapa 3)#l");
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
                if (cm.haveItem(4031061) && !cm.haveItem(4031062)) {
                    cm.sendYesNo("¿Le gustaría intentar el#bAliento de lava#k?  Si fallas, existe una posibilidad muy real de que mueras.");
                } else {
                    if (cm.haveItem(4031062)) {
                        cm.sendNext("Ya tienes el#bAliento de lava#k, no es necesario realizar esta etapa.");
                    } else {
                        cm.sendNext("Primero complete las pruebas anteriores.");
                    }

                    cm.dispose();
                }
            } else {
                if (cm.haveItem(4031061) && cm.haveItem(4031062)) {
                    if (!cm.haveItem(4000082, 30)) {
                        cm.sendOk("Has completado las pruebas, sin embargo todavía existe la necesidad de#b30 #t4000082##kforjar 5#t4001017#.");
                    } else {
                        cm.completeQuest(100201);
                        cm.gainItem(4031061, -1);
                        cm.gainItem(4031062, -1);
                        cm.gainItem(4000082, -30);

                        cm.gainItem(4001017, 5);
                        cm.sendNext("Tú#rhan completado las pruebas#k, de ahora en adelante teniendo mi aprobación para desafiar a Zakum.");
                    }

                    cm.dispose();
                } else {
                    cm.sendOk("Te faltan algunos de los elementos necesarios para forjar el#b#t4001017##k.");
                    cm.dispose();
                }
            }
        } else if (status == 2) {
            cm.warp(280020000, 0);
            cm.dispose();
        }
    }
}
