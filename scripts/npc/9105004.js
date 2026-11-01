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

/* 
 * @Author Ronan
 * Snow Spirit
	Maplemas PQ coordinator
 */

var prizeTree = [[[2000002, 1002850], [20, 1]], [[2000006, 1012011], [20, 1]]];

var state;
var status;
var gift;
var pqType;

function start() {
    pqType = ((cm.getMapId() / 10) % 10) + 1;
    state = (cm.getMapId() % 10 > 0) ? 1 : 0;
    status = -1;
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

        if (state > 0) {
            insidePqAction(mode, type, selection);
        } else {
            recruitPqAction(mode, type, selection);
        }
    }
}

function recruitPqAction(mode, type, selection) {
    if (status == 0) {
        em = cm.getEventManager("HolidayPQ_" + pqType);
        if (em == null) {
            cm.sendOk("El PQ de vacaciones" + pqType + "ha encontrado un error.");
            cm.dispose();
        } else if (cm.isUsingOldPqNpcStyle()) {
            action(1, 0, 0);
            return;
        }

        cm.sendSimple("#e#b<Misión de grupo: Vacaciones>\r\n#k#n" + em.getProperty("fiesta") + "\r\n\r\n¿Qué tal si tú y los miembros de tu grupo completan una misión colectivamente? Aquí encontrarás obstáculos y problemas que no podrás superar sin un gran trabajo en equipo. Si quieres probarlo, por favor díselo al#blíder de tu partido#kpara hablar conmigo.#b\r\n#L0#Quiero participar en la búsqueda del grupo.\r\n#L1#Me gustaría" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "desactivar" : "permitir") + "Party Search.\r\n#L2#Me gustaría escuchar más detalles.");
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
                    if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), pqType)) {
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
            cm.sendOk("#e#b<Misión de grupo: Vacaciones>#k#n\r\n\r\nÚnete a tu equipo para construir el muñeco de nieve que protegerá a Happyville de las fechorías de Scrooge. Mientras esté dentro, trabaje con su equipo para protegerlo por cualquier medio necesario mientras recolecta Snow Vigor que ayudará en la construcción del muñeco de nieve.");
            cm.dispose();
        }
    }
}

function insidePqAction(mode, type, selection) {
    var eim = cm.getEventInstance();
    var difficulty = eim.getIntProperty("level");
    var stg = eim.getIntProperty("statusStg1");

    var mapobj = eim.getInstanceMap(889100001 + 10 * (difficulty - 1));

    if (status == 0) {
        if (stg == -1) {
            cm.sendNext("#b#h0##k... finalmente estás aquí. Este es el lugar donde los residentes de Happyville construyen el muñeco de nieve gigante. Pero los subordinados de Scrooge lo están atacando ahora mismo. ¡Ahora date prisa! Nuestra misión es que usted y su grupo protejan al muñeco de nieve de los hombres de Scrooge dentro del límite de tiempo. Si los eliminas, soltarán un objeto llamado Snow Vigor. Recógelos y déjalos caer sobre el muñeco de nieve, y literalmente lo verás crecer. Una vez que vuelva a su tamaño original, su tarea estará completa. Sólo ten cuidado con una cosa. Algunos de los subordinados pueden dejar caer un Snow Vigor falso. Un Snow Vigor falso hará que el muñeco de nieve se derrita incluso más rápido de lo habitual. Mucha suerte para ti.");
        } else if (stg == 0) {
            if (cm.getMap().getMonsterById(9400321 + 5 * difficulty) == null) {
                cm.sendNext("Por favor, derrota a los subordinados de Scrooge y haz crecer el muñeco de nieve, para que Scrooge no tenga otra forma de evitar aparecer.");
                cm.dispose();
            } else {
                cm.sendNext("¡Impresionante! Tal como esperaba, lograste derrotar a los subordinados de Scrooge. ¡Muchas gracias! (Se queda en silencio por un momento...) Desafortunadamente, Scrooge no parece que vaya a detenerse aquí. Uno de sus hombres ya le contó lo que pasó, lo que significa que... aparecerá pronto. Por favor, sigue luchando y, de nuevo, mucha suerte para ti.");
            }
        } else {
            if (!eim.isEventCleared()) {
                cm.sendNext("¡Por favor, derrota al Scrooge para que nuestro Maplemas se mantenga a salvo de cualquier daño!");
                cm.dispose();
            } else {
                cm.sendNext("¡¡Guau!! ¡Has derrotado a Scrooge! ¡Muchas gracias! ¡Has logrado que este Maplemas esté sano y salvo! ¡¡Gracias!!");
            }
        }
    } else if (status == 1) {
        const LifeFactory = Java.type('server.life.LifeFactory');
        const Point = Java.type('java.awt.Point');

        if (stg == -1) {
            if (!cm.isEventLeader()) {
                cm.sendOk("Por favor, deja que el líder de tu grupo hable conmigo para obtener más detalles sobre la misión.");
                cm.dispose();
                return;
            }

            mapobj.allowSummonState(true);
            var snowman = LifeFactory.getMonster(9400317 + (5 * difficulty));
            mapobj.spawnMonsterOnGroundBelow(snowman, new Point(-180, 15));
            eim.setIntProperty("snowmanLevel", 1);
            eim.dropMessage(5, "¡El muñeco de nieve apareció en el campo! ¡Protégelo utilizando todos los medios necesarios!");

            eim.setIntProperty("statusStg1", 0);
            cm.dispose();

        } else if (stg == 0) {
            if (!cm.isEventLeader()) {
                cm.sendOk("Por favor, deja que el líder de tu grupo hable conmigo para obtener más detalles sobre la misión.");
                cm.dispose();
                return;
            }

            mapobj.broadcastStringMessage(5, "As the snowman grows to it's prime, the Scrooge appears!");
            eim.getEm().getIv().invokeFunction("snowmanHeal", eim);

            var boss = LifeFactory.getMonster(9400318 + difficulty);
            mapobj.spawnMonsterOnGroundBelow(boss, new Point(-180, 15));
            eim.setProperty("spawnedBoss", "true");

            eim.setIntProperty("statusStg1", 1);
            cm.dispose();
        } else {
            gift = cm.haveItem(4032092, 1);
            if (gift) {
                var optStr = generateSelectionMenu(generatePrizeString());
                cm.sendSimple("Oh, trajiste un#b#t4032092##k¿contigo? Qué lindo, espera un poco... Aquí tienes tu regalo de Maplemas. Por favor seleccione el que le gustaría recibir:\r\n\r\n" + optStr);
            } else if (eim.gridCheck(cm.getPlayer()) == -1) {
                cm.sendNext("Aquí está tu regalo de Maplemas. Disfruta ~");
            } else {
                cm.sendOk("¡¡Feliz arce!!");
                cm.dispose();
            }
        }

    } else if (status == 2) {
        if (gift) {
            var selItems = prizeTree[selection];
            if (cm.canHoldAll(selItems[0], selItems[1])) {
                cm.gainItem(4032092, -1);
                cm.gainItem(selItems[0][0], selItems[1][0]);

                if (selection == 1) {
                    var rnd = (Math.random() * 9) | 0;
                    cm.gainItem(selItems[0][1] + rnd, selItems[1][1]);
                } else {
                    cm.gainItem(selItems[0][1], selItems[1][1]);
                }
            } else {
                cm.sendOk("Asegúrese de tener espacio en sus inventarios EQUIPAR y USAR antes de continuar.");
            }
        } else {
            if (eim.giveEventReward(cm.getPlayer(), difficulty)) {
                eim.gridInsert(cm.getPlayer(), 1);
            } else {
                cm.sendOk("Asegúrese de tener espacio en sus inventarios de EQUIPO, USO y ETC antes de continuar.");
            }
        }

        cm.dispose();
    }
}

function generatePrizeString() {
    var strTree = [];

    for (var i = 0; i < prizeTree.length; i++) {
        var items = prizeTree[i][0];
        var qtys = prizeTree[i][1];

        var strSel = "";
        for (var j = 0; j < items.length; j++) {
            strSel += ("#i" + items[j] + "# #t" + items[j] + "#" + (qtys[j] > 1 ? (" : " + qtys[j]) : ""));
        }

        strTree.push(strSel);
    }

    return strTree;
}

function generateSelectionMenu(array) {
    var menu = "";
    for (var i = 0; i < array.length; i++) {
        menu += "#L" + i + "#" + array[i] + "#l\r\n";
    }
    return menu;
}