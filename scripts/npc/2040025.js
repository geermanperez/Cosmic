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
/*  Author:         Xterminator
	NPC Name: 		Second Eos Rock
	Map(s): 		Ludibrium : Eos Tower 71st Floor (221022900)
	Description: 	Brings you to 100th Floor or 71st Floor
*/
var status = 0;
var map = 221024400;

function start() {
    if (cm.haveItem(4001020)) {
        cm.sendSimple("puedes usar#bPergamino de roca de Eos#kactivar#bSegunda roca de Eos#k. ¿A cuál de estas rocas te gustaría teletransportarte?#b\r\n#L0#Primera Roca Eos (Piso 100)#l\r\n#L1#Tercera Roca Eos (Piso 41)#l");
    } else {
        cm.sendOk("Hay una roca que te permitirá teletransportarte a#bPrimera Roca Eos o Tercera Roca Eos#k, pero no se puede activar sin el desplazamiento.");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (selection == 0) {
                cm.sendYesNo("puedes usar#bPergamino de roca de Eos#kactivar#bSegunda roca de Eos#k. ¿Te teletransportarás a#bPrimera roca Eos#ken el piso 100?");
            } else {
                cm.sendYesNo("puedes usar#bPergamino de roca de Eos#kactivar#bSegunda roca de Eos#k. ¿Te teletransportarás a#bTercera roca Eos#ken el piso 41?");
                map = 221021700;
            }
        } else if (status == 2) {
            cm.gainItem(4001020, -1);
            cm.warp(map, 3);
            cm.dispose();
        }
    }
}