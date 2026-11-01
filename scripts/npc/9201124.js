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
    9201124 - Bowman Statue, Lith Harbor
    |- Warps you to 100000201 (Bowman School)

    Version
    |- 1.0 First Version by Jayd
    |- 1.1 Edited by Ronan - check job requirements
 */

var status;
var map = 100000201;
var job = "Bowman";
var jobType = 3;
var no = "Come back to me if you decided to be a #b" + job + "#k.";

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.sendOk(no);
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.sendOk(no);
            cm.dispose();
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (cm.getJob() == "BEGINNER") {
                if (cm.getLevel() >= 10 && cm.canGetFirstJob(jobType)) {
                    cm.sendYesNo("Ey#h#, puedo enviarte a#b#m" + map + "##ksi quieres ser un#b" + job + "#k. ¿Quieres ir ahora?");
                } else {
                    cm.sendOk("Si quieres ser un #b" + job + "#k, entrénate más hasta llegar#bnivel 10," + cm.getFirstJobStatRequirement(jobType) + "#k.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("Eres mucho más fuerte ahora. ¡Sigue entrenando!");
                cm.dispose();
            }
        } else if (status == 1) {
            cm.warp(map, 0);
            cm.dispose();
        }
    }
}