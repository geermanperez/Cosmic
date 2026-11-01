/*
	This file is part of the OdinMS Maple Story Server
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

var inMap = [540000000, 550000000, 551000000];
var toMap = [550000000, [551000000, 541000000], 550000000];
var cost = [42000, [10000, 0], 10000];
var toMapSp = [0, [2, 4], 4];

var location;
var text;

var travelCost;
var travelMap;
var travelSp;

var startedTravel = false;

var status = 0;

function start() {
    if (cm.getPlayer().getMap().getId() != 540000000) {
        text = "Hey I'm #p9201135#, your tour guide here in #rMalaysia#k. Where would you like to travel?\n\n";
    } else {
        text = "Hey I'm #p9201135#, a tour guide on #rMalaysia#k. Since you're not registered in our special travel package with our partner #bMaple Travel Agency#k, the ride will be significantly more expensive. So, would you like to ride now?\n\n";
        startedTravel = true;
    }

    for (var i = 0; i < toMap.length; i++) {
        if (inMap[i] == cm.getPlayer().getMap().getId()) {
            if (inMap[i] == 550000000) {
                toMap[1][1] = cm.getPlayer().peekSavedLocation("WORLDTOUR");
                if (toMap[1][1] == -1) {
                    toMap[1][1] = 541000000;
                }
            }

            location = i;
            break;
        }
    }

    if (toMap[location] instanceof Array) {
        var maps = toMap[location];
        var costs = cost[location];

        for (var i = 0; i < maps.length; i++) {
            text += "\t\r\n#b#L" + i + "##m" + maps[i] + "# " + (costs[i] > 0 ? "(" + costs[i] + "mesos)" : "") + "#l";
        }
    } else {
        text += "\t\r\n#b#L0##m" + toMap[location] + "# " + (cost[location] > 0 ? "(" + cost[location] + "mesos)" : "") + "#l";
    }

    text += "#k";

    cm.sendSimple(text);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        cm.sendNext("¡Ya sabes dónde venir si necesitas que te lleven!");
        cm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 1) {
        if (toMap[location] == null) {
            cm.dispose();
            return;
        }

        if (toMap[location] instanceof Array) {
            var maps = toMap[location];
            var costs = cost[location];
            var sps = toMapSp[location];

            travelCost = costs[selection];
            travelMap = maps[selection];
            travelSp = sps[selection];
        } else {
            travelCost = cost[location];
            travelMap = toMap[location];
            travelSp = toMapSp[location];
        }

        if (travelCost > 0) {
            cm.sendYesNo("¿Te gustaría viajar a#b#m" + travelMap + "##k? para dirigirse a#b#m" + travelMap + "##k, te costará#r" + cm.numberWithCommas(travelCost) + "mesos#k. ¿Quieres ir ahora mismo?");
        } else {
            cm.sendNext("¿Lo pasaste muy bien en #rMalaysia#k? Eso espero, ¡que tengas un buen viaje de regreso!");
        }
    } else if (status == 2) {
        if (cm.getMeso() < travelCost) {
            cm.sendNext("Parece que no tienes suficientes mesos.");
        } else {
            if (travelCost > 0) {
                cm.gainMeso(-travelCost);
                if (startedTravel) {
                    cm.getPlayer().saveLocation("WORLDTOUR");
                }
            } else {
                travelMap = cm.getPlayer().getSavedLocation("WORLDTOUR");
                if (travelMap == -1) {
                    travelMap = toMap[1][1];
                }
            }

            cm.warp(travelMap, travelSp);
        }
        cm.dispose();
    }
}
