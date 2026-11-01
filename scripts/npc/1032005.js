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
/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 VIP Cab - Victoria Road : Ellinia (101000000)
 -- By ---------------------------------------------------------------------------------------------
 Xterminator
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Xterminator
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var cost = 10000;

function start() {
    cm.sendNext("¡Hola! Este taxi es sólo para clientes VIP. En lugar de simplemente llevarlo a diferentes ciudades como los taxis regulares, ofrecemos un servicio mucho mejor digno de una clase VIP. Es un poco caro, pero... por sólo 10.000 mesos, te llevamos sano y salvo al\r\n#bTúnel de hormigas#k.");
}

function action(mode, type, selection) {
    status++;
    if (mode == -1) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        cm.sendOk("Este pueblo también tiene mucho que ofrecer. Encuéntrenos cuando sienta la necesidad de ir al Ant Tunnel Park.");
        cm.dispose();
        return;
    }
    if (status == 1) {
        cm.sendYesNo(cm.getJobId() == 0 ? "Tenemos un descuento especial del 90% para principiantes. El túnel de hormigas está ubicado en lo profundo de la mazmorra que se encuentra en el centro de la isla Victoria, donde se encuentra la tienda móvil abierta las 24 horas. ¿Te gustaría ir allí por#b1.000 mesos#k?" : "La tarifa regular se aplica a todos los no principiantes. El túnel de hormigas está ubicado en lo profundo de la mazmorra que se encuentra en el centro de la isla Victoria, donde se encuentra la tienda móvil las 24 horas. ¿Te gustaría ir allí por#b10.000 mesos#k?");
        cost /= ((cm.getJobId() == 0) ? 10 : 1);
    } else if (status == 2) {
        if (cm.getMeso() < cost) {
            cm.sendNext("Parece que no tienes suficientes mesos. Lo sentimos, pero no podrás usarlo sin él.")
        } else {
            cm.gainMeso(-cost);
            cm.warp(105070001);
        }
        cm.dispose();
    }
}