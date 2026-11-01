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
//Moose, Warps to exit

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        if (cm.isQuestStarted(6180) && cm.getQuestProgressInt(6180, 9300096) < 200) {
            cm.sendYesNo("Presta atención: durante el tiempo que permanezcas dentro del campo de entrenamiento asegúrate de#bhas equipado tu#t1092041##k, es de suma importancia. ¿Estás listo para proceder al área de entrenamiento?");
        } else {
            cm.sendOk("Sólo el personal asignado puede acceder al campo de entrenamiento.");
            cm.dispose();
        }
    } else if (status == 1) {
        if (cm.getPlayer().haveItemEquipped(1092041)) {
            cm.sendNext("¡Ten tu escudo equipado hasta el final de la misión, o tendrás que empezar de nuevo!");
        } else {
            cm.sendOk("Por favor equipe el#r#t1092041##kantes de entrar al campo de entrenamiento.");
            cm.dispose();
        }
    } else {
        cm.warp(924000001, 0);
        cm.dispose();
    }
}
