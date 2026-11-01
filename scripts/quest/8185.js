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
	Description: 		Quest - Pet Evolution2
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
                qm.sendOk("¡Ey! Necesito#b10.000 mesos#kpara hacer la evolución de tu mascota!");
                qm.dispose();
                return;
            }

            qm.sendNext("#e#b¡Oye, lo lograste!#n#k \r\n#r¡Guau!#k¡Ahora podría completar mis estudios sobre tu mascota!");
        } else if (status == 1) {
            if (mode == 0) {
                qm.sendOk("Ya veo... Vuelve cuando desees hacerlo. Estoy muy emocionado de hacer esto.");
                qm.dispose();
            } else {
                qm.sendNextPrev("Solo digo que el color de tu nuevo dragón será#e#rrandom#k#n! O va a ser#gverde,#bazul,#rrojo,#do muy raramente#k, negro.\r\n\r\n#fUI/UIWindow.img/QuestIcon/5/0#\r\n\rSi no le gusta el nuevo color de su mascota, o si alguna vez desea cambiar el color de su mascota nuevamente,#e¡puedes cambiarlo!#nsimplemente solo#dcompra otra Roca de la Evolución, 10.000 mesos,#ky#dequipa a tu nueva mascota#kantes de volver a hablar conmigo, pero claro, no puedo devolverle tu mascota como un dragón bebé, sólo a otro dragón adulto.");
            }
        } else if (status == 2) {
            qm.sendYesNo("Ahora déjame intentar hacer evolucionar a tu mascota. ¿Estás listo? ¿Quieres ver a tu lindo bebé dragón convertirse en un dragón adulto maduro de color negro oscuro, azul, verde tranquilo o rojo fuego? Seguirá teniendo la misma cercanía, nivel, nombre, saciedad, hambre y equipamiento por si estás preocupado.\r\n\r #b#e¿Quieres continuar o tienes algunas cosas de última hora que hacer primero?#k#n");
        } else if (status == 3) {
            qm.sendNextPrev("¡Muy bien, aquí vamos...!#r¡HYAHH!#k");
        } else if (status == 4) {
            var rand = 1 + Math.floor(Math.random() * 10);
            var after = 0;
            var i = 0;

            for (i = 0; i < 3; i++) {
                if (qm.getPlayer().getPet(i) != null && qm.getPlayer().getPet(i).getItemId() == 5000029) {
                    var pet = qm.getPlayer().getPet(i);
                    break;
                }
            }
            if (i == 3) {
                qm.getPlayer().message("Pet could not be evolved.");
                qm.dispose();
                return;
            }


            if (rand >= 1 && rand <= 3) {
                after = 5000030;
            } else if (rand >= 4 && rand <= 6) {
                after = 5000031;
            } else if (rand >= 7 && rand <= 9) {
                after = 5000032;
            } else if (rand == 10) {
                after = 5000033;
            } else {
                qm.sendOk("Ocurre algo. Intentar otra vez.");
                qm.dispose();
                return;
            }

            /* if (name.equals(ItemInformationProvider.getInstance().getName(id))) {
        name = ItemInformationProvider.getInstance().getName(after);
} */

            //qm.unequipPet(qm.getClient());
            qm.gainItem(5380000, -1);
            qm.gainMeso(-10000);
            qm.evolvePet(i, after);

            //SpawnPetHandler.evolve(qm.getPlayer().getClient(), 5000029, after);

            qm.sendOk("#b¡DULCE! ¡FUNCIONÓ!#k¡Tu dragón ha crecido maravillosamente!#rPuede encontrar su nueva mascota en su inventario 'EFECTIVO'.\r #kSolía ​​ser un#b #i5000029##t5000029##k, y ahora es\ra#b#i" + after + "##t" + after + "##k!\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v" + after + "# #t" + after + "#");
        } else if (status == 5) {
            qm.dispose();
        }
    }
}