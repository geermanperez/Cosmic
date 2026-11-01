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
 * @Author : iAkira, Kevintjuh93
 **/
var status = 0;
var selected = 0;

function start() {
    if (cm.getPlayer().getMapId() == 100000000) {
        cm.sendNext("¡Allá! ¿Viste eso? ¿No lo hiciste? Acaba de pasar un OVNI... ¡¡allí!! Mira, alguien está siendo arrastrado hacia el OVNI... arrrrrrgh, ¡es Gaga!#r¡Gaga acaba de ser secuestrada por un OVNI!#k");
    }
}

function action(m, t, s) {
    if (m > 0) {
        status++;
        if (cm.getPlayer().getMapId() == 100000000) { // warper completed
            if (status == 1) {
                if (cm.getPlayer().getLevel() >= 12) {
                    cm.sendYesNo("¿Qué hacemos ahora? Es sólo un rumor todavía, pero... He oído que te suceden cosas aterradoras si eres secuestrado por extraterrestres... ¡puede ser que eso sea lo que le está pasando a Gaga ahora mismo! ¡Por favor, rescata a Gaga!\r\n #bGaga puede ser un poco indeterminada y despistada, pero#ktiene muy buen corazón. No puedo permitir que le pase algo terrible. ¡Bien! ¡El abuelo de la luna podría saber cómo rescatarlo! ¡¡¡Te enviaré a la luna, así que ve a encontrarte con el abuelo y rescata a Gaga!!!");
                } else {
                    cm.sendOk("¡Oh! Parece que no alcanzas el nivel requerido para salvar a Gaga. Vuelve cuando tengas el nivel 12 o superior.");
                }

            } else if (status == 2) {
                cm.sendNext("Muchas gracias. ¡Por favor rescata a Gaga! El abuelo de la luna te ayudará.");
            } else if (status == 3) {
                cm.warp(922240200, 0);
                cm.dispose();
            }
        }
    } else if (m < 1) {
        cm.dispose();
    }
}