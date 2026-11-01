/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Hak - Cabin <To Mu Lung>(200000141) / Mu Lung Temple(250000100) / Herb Town(251000000)
 -- By ---------------------------------------------------------------------------------------------
 Information
 -- Version Info -----------------------------------------------------------------------------------
 1.1 - Text and statement fix [Information]
 1.0 - First Version by Information
 ---------------------------------------------------------------------------------------------------
 **/

var menu = ["Mu Lung", "Orbis", "Herb Town", "Mu Lung"];
var cost = [1500, 1500, 500, 1500];
var hak;
var slct;
var display = "";
var btwmsg;
var method;


function start() {
    status = -1;
    hak = cm.getEventManager("Hak");
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();

    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        } else if (mode == 0) {
            cm.sendNext("DE ACUERDO. Si alguna vez cambias de opinión, házmelo saber.");
            cm.dispose();
            return;
        }
        status++;
        if (status == 0) {
            for (var i = 0; i < menu.length; i++) {
                if (cm.getPlayer().getMapId() == 200000141 && i < 1) {
                    display += "\r\n#L" + i + "##b" + menu[i] + "(" + cost[i] + " mesos)#k";
                } else if (cm.getPlayer().getMapId() == 250000100 && i > 0 && i < 3) {
                    display += "\r\n#L" + i + "##b" + menu[i] + "(" + cost[i] + " mesos)#k";
                }
            }
            if (cm.getPlayer().getMapId() == 200000141 || cm.getPlayer().getMapId() == 251000000) {
                btwmsg = "#bOrbis#k to #bMu Lung#k";
            } else if (cm.getPlayer().getMapId() == 250000100) {
                btwmsg = "#bMu Lung#k to #bOrbis#k";
            }
            if (cm.getPlayer().getMapId() == 251000000) {
                cm.sendYesNo("Hola. ¿Cómo va el viaje hasta ahora? He estado transportando a otros viajeros como tú a #b" + menu[3] + "#ken poco tiempo, y... ¿estás interesado? No es tan estable como el barco, así que tendrás que agarrarte fuerte, pero puedo llegar mucho más rápido que el barco. Te llevaré allí siempre que pagues.#b" + cost[2] + "mesos#k.");
                status++;
            } else if (cm.getPlayer().getMapId() == 250000100) {
                cm.sendSimple("Hola. ¿Cómo va el viaje hasta ahora? Entiendo que caminar sobre dos piernas es mucho más difícil de cubrir en comparación con alguien como yo que puede navegar por los cielos. He estado transportando a otros viajeros como tú a otras regiones en poco tiempo, y... ¿estás interesado? Si es así, selecciona la ciudad a la que te gustaría dirigirte.\r\n" + display);
            } else {
                cm.sendSimple("Hola. ¿Cómo va el viaje hasta ahora? He estado transportando a otros viajeros como tú a otras regiones en poco tiempo, y... ¿estás interesado? Si es así, seleccione la ciudad a la que desea dirigirse.\r\n" + display);
            }
        } else if (status == 1) {
            slct = selection;
            cm.sendYesNo("¿Te mudarás a #b?" + menu[selection] + "#k¿ahora? si tienes#b" + cost[selection] + "mesos#k, te llevaré allí ahora mismo.");

        } else if (status == 2) {
            if (slct == 2) {
                if (cm.getMeso() < cost[2]) {
                    cm.sendNext("¿Estás seguro de que tienes suficientes mesos?");
                    cm.dispose();
                } else {
                    cm.gainMeso(-cost[2]);
                    cm.warp(251000000, 0);
                    cm.dispose();
                }
            } else {
                if (cm.getMeso() < cost[slct]) {
                    cm.sendNext("¿Estás seguro de que tienes suficientes mesos?");
                    cm.dispose();
                } else {
                    if (cm.getPlayer().getMapId() == 251000000) {
                        cm.gainMeso(-cost[2]);
                        cm.warp(250000100, 0);
                        cm.dispose();
                    } else {
                        var em = cm.getEventManager("Hak");
                        if (!em.startInstance(cm.getPlayer())) {
                            cm.sendOk("Uh... Actualmente estamos aceptando solicitudes de demasiados maplers... Por favor, inténtalo de nuevo en un momento.");
                            cm.dispose();
                            return;
                        }

                        cm.gainMeso(-cost[slct]);
                        cm.dispose();
                    }
                }
            }
        }
    }
}  