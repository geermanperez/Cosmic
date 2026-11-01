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
*	Author : Raz
*	Author : Ronan
*
*	NPC = 9103001 - Rolly
*	Map =  Ludibrium - <Ludibrium>
*	NPC MapId = 220000000
*	Function = Start LMPQ
*
*/

var status = 0;

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
            em = cm.getEventManager("LudiMazePQ");
            if (em == null) {
                cm.sendOk("El Ludibrium Maze PQ ha encontrado un error.");
                cm.dispose();
                return;
            } else if (cm.isUsingOldPqNpcStyle()) {
                action(1, 0, 0);
                return;
            }

            cm.sendSimple("#e#b<Misión del grupo: Laberinto de juguetes>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\nEsta es la entrada al Laberinto Ludibrium. ¡Disfrutar!\r\n#b#L0#Entra en el laberinto de Lubidrium#l\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#¿Qué es el Laberinto de Ludibrium?");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.getParty() == null) {
                    cm.sendOk("Intenta emprender Maze Quest con tu grupo.");
                    cm.dispose();
                } else if (!cm.isLeader()) {
                    cm.sendOk("Si decides abordarlo, ¡pídele al líder de tu grupo que me lo notifique!");
                    cm.dispose();
                } else {
                    var eli = em.getEligibleParty(cm.getParty());
                    if (eli.size() > 0) {
                        if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                            cm.sendOk("Otro partido ya ha entrado en el#rBúsqueda de fiesta#ken este canal. Prueba con otro canal o espera a que termine la fiesta actual.");
                        }
                    } else {
                        cm.sendOk("Tu grupo debe estar formado por al menos 3 miembros para poder afrontar este laberinto.");
                    }

                    cm.dispose();
                }
            } else if (selection == 1) {
                var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                cm.sendOk("El estado de tu búsqueda de grupo es ahora: #b" + (psState ? "activado" : "desactivado") + "#k. Habla conmigo cuando quieras volver a cambiarlo.");
                cm.dispose();
            } else {
                cm.sendOk("#e#b<Misión del grupo: Laberinto de juguetes>#k#n\r\nEste laberinto está disponible para todos los grupos de 3 o más miembros, y todos los participantes deben estar entre los niveles 51 y 70.  Tendrás 15 minutos para escapar del laberinto.  En el centro de la habitación, habrá un Portal Warp configurado para transportarte a una habitación diferente.  Estos portales te transportarán a otras habitaciones donde (con suerte) encontrarás la salida.  Pietri te estará esperando en la salida, así que todo lo que tienes que hacer es hablar con él y te dejará salir.  Rompe todas las cajas ubicadas en la habitación y un monstruo dentro de la caja dejará caer un cupón.  Después de escapar del laberinto, recibirás EXP según los cupones recolectados.  Además, si el líder posee al menos 30 cupones, entonces unSe presentará un regalo especial a la fiesta.  Si no puedes escapar del laberinto dentro de los 15 minutos asignados, recibirás 0 EXP por tu tiempo en el laberinto.  Si decides cerrar sesión mientras estás en el laberinto, serás expulsado automáticamente del laberinto.  Incluso si los miembros del grupo se van en medio de la misión, los miembros restantes podrán continuar con la misión, excepto si se quedan sin la cantidad mínima de miembros del grupo en el laberinto.  Si estás en estado crítico y no puedes cazar a los monstruos, puedes evitarlos para salvarte.  ¡Tu espíritu de lucha y tu ingenio serán puestos a prueba!  ¡Buena suerte!");
                cm.dispose();
            }
        }
    }
}