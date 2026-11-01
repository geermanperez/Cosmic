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
	NPC Name: 		Parwen
	Description: 		Quest - Verifying the password
*/
var status = -1;
var pass;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            qm.sendNext("Vamos, date prisa. ¡Saca tu lápiz y papel si no eres tan inteligente!");
            qm.dispose();
            return;
        }

        if (status == 0) {
            qm.sendNext("¡Oh! ¡Por fin has llegado! Me alegra que estés aquí a tiempo. ¡Tengo la llave maestra para que abras el pasadizo secreto! ¡Jajajaja! ¿No es asombroso? ¡Dilo increíble!");
        } else if (status == 1) {
            qm.sendAcceptDecline("Muy bien, esta clave es muy larga y compleja. Necesito que lo memorices muy bien. No lo diré más, así que será mejor que lo escribas en alguna parte. ¿Estás listo?");
        } else if (status == 2) {
            pass = generateString();
            qm.sendOk("El código clave es #b" + pass + "#k. ¿Entendiste eso? Introduce la llave en la puerta del pasaje secreto y podrás caminar libremente por el pasaje.");
        } else if (status == 3) {
            qm.forceStartQuest();
            qm.setQuestProgress(3360, pass);
            qm.dispose();
        }
    }
}

function generateString() {
    var thestring = "";
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var rnum;
    for (var i = 0; i < 10; i++) {
        rnum = Math.floor(Math.random() * chars.length);
        thestring += chars.substring(rnum, rnum + 1);
    }
    return thestring;
}
