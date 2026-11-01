/* 
 * This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @Author Stereo, xQuasar, XkelvinchiaX (Kelvin) - For make it Fully Working.
 * 
 * Adobis - El Nath: Entrance to Zakum Altar (211042400)
 * 
 * Start of Zakum Bossfight
 */

var status;
var minLevel = 50;
var state;
var maxPlayers = 30;


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
            if ((cm.getPlayer().getLevel() < minLevel)) {
                cm.warp(211042300);
                cm.sendOk("Por favor regresa cuando estés preparado para la batalla. No deberías estar aquí todavía.");
                cm.dispose();
                return;
            }
            cm.sendSimple("La batalla para derrotar a Zakum comienza aquí. ¿Qué te gustaría hacer?#b\r\n#L0#Comienza una nueva batalla de Zakum#l\r\n#L1#Únete a la batalla Zakum de tu grupo#l");
        } else if (status == 1) {
            state = selection;
            if (selection == 0) {
                cm.sendGetText("Para comenzar la Batalla de Zakum, debes elegir un nombre para tu instancia.  Esta es la contraseña que permite a tus miembros unirse, así que dísela a todos los que quieran participar en la batalla.");
            } else if (selection == 1) {
                cm.sendGetText("Para unirte a una batalla de Zakum, debes ingresar la contraseña.  Si no sabes qué es, pregúntale a la persona que lidera la batalla.");
            }

        } else if (status == 2) {
            var em = cm.getEventManager("ZakumBattle");
            var passwd = cm.getText();
            if (em == null) {
                cm.sendOk("Este ensayo se encuentra actualmente en construcción.");
            } else {
                if (state == 0) { // Leader
                    if (getEimForString(em, passwd) != null) {
                        cm.sendOk("No puede utilizar esa contraseña.");
                    } else { // start Zakum Battle
                        //var em = cm.getEventManager("Zakum" + passwd);
                        if (!em.startInstance(cm.getPlayer())) {
                            cm.sendOk("En este caso ya hay un partido registrado.");
                        }

                        cm.dispose();
                        return;
                    }
                }
                if (state == 1) { // Member
                    var eim = getEimForString(em, passwd);
                    if (eim == null) {
                        cm.sendOk("Actualmente no hay ninguna batalla registrada con ese nombre.");
                    } else {
                        if (eim.getProperty("canEnter").toLowerCase() == "true") {
                            if (eim.getPlayers().size() < maxPlayers) {
                                eim.registerPlayer(cm.getPlayer());
                            } else {
                                cm.sendOk("Lo siento, pero esa batalla está actualmente llena.  Espere para unirse a otro.");
                            }
                        } else {
                            cm.sendOk("Lo siento, pero esa batalla está actualmente en curso.  Por favor regrese más tarde.");
                        }
                    }
                }
            }
            cm.dispose();
        }
    }
}

function getEimForString(em, name) {
    var stringId = "Zakum" + name;
    return em.getInstance(stringId);
}