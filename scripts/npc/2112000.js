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
/* Yulete
	Yulete's Office (926100203)
	Magatia NPC
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function playersTooClose() {
    var npcpos = cm.getMap().getMapObject(cm.getNpcObjectId()).getPosition();
    var listchr = cm.getMap().getPlayers();

    for (var iterator = listchr.iterator(); iterator.hasNext();) {
        var chr = iterator.next();

        var chrpos = chr.getPosition();
        if (Math.sqrt(Math.pow((npcpos.getX() - chrpos.getX()), 2) + Math.pow((npcpos.getY() - chrpos.getY()), 2)) < 310) {
            return true;
        }
    }

    return false;
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

        var eim = cm.getEventInstance();

        if (cm.getMapId() == 926100203) {
            if (status == 0) {
                var state = eim.getIntProperty("yuleteTalked");

                if (state == -1) {
                    cm.sendOk("Je, parece que ustedes tienen compañía. Diviértete con ellos, mientras solicito cortésmente mi permiso.");

                } else if (playersTooClose()) {
                    cm.sendOk("Ah, hola. Estuve#bmonitoreando tus movimientos#kdesde que entraron a este perímetro. Toda una hazaña llegar hasta aquí, los felicito a todos. Ahora, ahora, mira la hora, tengo una cita ahora mismo, me temo que tendré que pedir mi baja. Pero no te preocupes, mi#raccessors#k se ocupará de todos ustedes. Ahora, si me lo permites, me voy ahora.");

                    eim.setIntProperty("yuleteTalked", -1);
                } else if (eim.getIntProperty("npcShocked") == 0) {
                    cm.sendOk("Ho~ ¿No eres bastante astuto? Bueno, no importa. Estuve#bmonitoreando tus movimientos#kdesde que entraron a este perímetro. Toda una hazaña llegar hasta aquí, los felicito a todos. Ahora, ahora, mira la hora, tengo una cita ahora mismo, me temo que tendré que pedir mi baja. Pero no te preocupes, mi#raccessors#k se ocupará de todos ustedes. Ahora, si me lo permites, me voy ahora.");

                    eim.setIntProperty("yuleteTalked", -1);
                } else {
                    cm.sendOk("... ¡Ja! ¿Qué, qué...? ¡¿Cómo llegaste aquí?! ¡Pensé que había sellado todos los caminos aquí! No importa, esta situación se resolverá pronto. Chicos: IMPLEMENTAR el#rarma maestra#k!! ¡Tú! Sí, tú. ¿No crees que esto termina aquí? Mira a tus compañeros, ¡necesitan ayuda! Me retiraré por ahora.");

                    eim.setIntProperty("yuleteTalked", 1);
                }
            }

            cm.dispose();
        } else {
            if (status == 0) {
                if (eim.isEventCleared()) {
                    cm.sendOk("Nooooo… ¿me han golpeado? ¿Pero cómo? ¡Todo lo que hice fue por el desarrollo de una alquimia mayor! ¡No puedes encarcelarme, hice lo que haría cualquiera que estuviera en un lugar como el mío! Pero no, ¿simplemente decidieron frenar el progreso de la ciencia SÓLO PORQUE se consideraba peligrosa? ¡Vamos, vamos!");
                } else {
                    var state = eim.getIntProperty("yuletePassed");

                    const LifeFactory = Java.type('server.life.LifeFactory');
                    const Point = Java.type('java.awt.Point');
                    if (state == -1) {
                        cm.sendOk("¡Mirad! ¡El pináculo de los estudios de alquimia de Magatia! Jajajajajajaja...");
                    } else if (state == 0) {
                        cm.sendOk("Ustedes son un dolor, caray. Muy bien, les presento mi arma más nueva, traída por la mejor alquimia, #rFrankenroid#k.");
                        eim.dropMessage(5, "Yulete: ¡Te presento mi arma más nueva, traída por el mejor alquimista, Frankenroid!");

                        var mapobj = eim.getMapInstance(926100401);
                        var bossobj = LifeFactory.getMonster(9300139);

                        //mapobj.spawnMonsterWithEffect(bossobj, 13, new Packages.java.awt.Point(250, 100));
                        mapobj.spawnMonsterOnGroundBelow(bossobj, new Point(250, 100));

                        eim.setIntProperty("statusStg7", 1);
                        eim.setIntProperty("yuletePassed", -1);
                    } else {
                        cm.sendOk("Ustedes son un dolor, caray. Muy bien, les presento mi arma más nueva, traída por la más fina alquimia combinada de Alcadno y Zenumist, esas que la gente aburrida de las sociedades de Magatia ha prohibido traer, los#rpoderoso frankenroide#k!");
                        eim.dropMessage(5, "Yulete: Les presento mi arma más nueva, traída por la mejor alquimia combinada de Alcadno y Zenumist, esas que la gente aburrida de las sociedades de Magatia ha prohibido traer, ¡¡el poderoso Frankenroid!!");

                        var mapobj = eim.getMapInstance(926100401);
                        var bossobj = LifeFactory.getMonster(9300140);

                        //mapobj.spawnMonsterWithEffect(bossobj, 14, new Packages.java.awt.Point(250, 100));
                        mapobj.spawnMonsterOnGroundBelow(bossobj, new Point(250, 100));

                        eim.setIntProperty("statusStg7", 2);
                        eim.setIntProperty("yuletePassed", -1);
                    }
                }
            }

            cm.dispose();
        }
    }
}