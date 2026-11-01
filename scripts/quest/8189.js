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
/* 	Author: 		Blue
	Name:	 		Garnox
	Map(s): 		New Leaf City : Town Center
	Description: 		Quest - Pet Re-Evolution
*/

var status = -1;

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            if (qm.getMeso() < 10000) {
                qm.sendOk("¡Ey! Necesito#b10.000 mesos#k¡Para hacer la reevolución de tu mascota!");
                qm.dispose();
                return;
            }

            qm.sendYesNo("Muy bien, entonces hagamos esto de nuevo, ¿de acuerdo? Como siempre, será aleatorio y te quitaré una de tus Rocas de Evoluciones.\r\n\r #r#e¿Listo?#n#k");
        } else if (status == 1) {
            qm.sendNextPrev("¡Entonces aquí vamos...!#r¡HYAHH!#k");
        } else if (status == 2) {
            var petidx = -1;
            var petItemid;
            for (var i = 0; i < 3; i++) {
                var pet = qm.getPlayer().getPet(i);
                if (pet != null) {
                    var id = pet.getItemId();
                    if (id >= 5000029 && id <= 5000033) {
                        petItemid = 5000030;
                        petidx = i;
                        break;
                    } else if (id >= 5000048 && id <= 5000053) {    // thanks Conrad for noticing Robo pets not being able to re-evolve
                        petItemid = 5000049;
                        petidx = i;
                        break;
                    }
                }
            }

            if (petidx == -1) {
                qm.sendOk("Algo anda mal, inténtalo de nuevo.");
                qm.dispose();
                return;
            }

            var pool = (petItemid == 5000030) ? 10 : 11;
            do {
                var rand = 1 + Math.floor(Math.random() * pool);
                var after = 0;
                if (rand >= 1 && rand <= 3) {
                    after = petItemid;
                } else if (rand >= 4 && rand <= 6) {
                    after = petItemid + 1;
                } else if (rand >= 7 && rand <= 9) {
                    after = petItemid + 2;
                } else if (rand == 10) {
                    after = petItemid + 3;
                } else {
                    after = petItemid + 4;
                }
            } while (after == pet.getItemId());

            /*if (name.equals(ItemInformationProvider.getInstance().getName(id))) {
    name = ItemInformationProvider.getInstance().getName(after);
} */

            qm.gainMeso(-10000);
            qm.gainItem(5380000, -1);
            qm.evolvePet(petidx, after);
            qm.completeQuest();

            qm.sendOk("¡Cortejar! ¡Funcionó de nuevo!#rPuede encontrar su nueva mascota en su inventario 'EFECTIVO'.\r #kSolía ​​ser un#b#i" + id + "##t" + id + "##k, y ahora es\ra#b #i" + after + "##t" + after + "##k! \r\n¡Vuelve con 10.000 mesos y otra Roca de Evolución si no te gusta!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v" + after + "# #t" + after + "#");
        } else if (status == 3) {
            qm.dispose();
        }
    }
}