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
/* 	Xan
	Lian Hua Hua Skin Care
        @author Moogra
*/
var skin = Array(0, 1, 2, 3, 4);
var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1)  // disposing issue with stylishs found thanks to Vcoc
    {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("Bueno, hola! ¡Bienvenido al cuidado de la piel Lian Hua Hua! ¿Te gustaría tener una piel firme, tersa y de aspecto saludable como la mía?  Con#b#tCupón de piel de CBD##k¡Puedes dejar que nosotros nos encarguemos del resto y tener el tipo de piel que siempre has deseado!\r\n\#L1#Ssuena bien! (usa#i5153010# #t5153010#)#l");
        } else if (status == 1) {
            if (!cm.haveItem(5153010)) {
                cm.sendOk("Parece que no tienes el cupón que necesitas para recibir el tratamiento. Lo siento, pero parece que no podemos hacerlo por usted.");
                cm.dispose();
                return;
            }
            cm.sendStyle("Con nuestro servicio especializado podrás ver con antelación cómo cuidarás el tratamiento. ¿Qué tipo de tratamiento para la piel te gustaría hacer? Anímate y elige el estilo de tu agrado...", skin);
        } else {
            cm.gainItem(5153010, -1);
            cm.setSkin(selection);
            cm.sendOk("¡Disfruta de tu piel nueva y mejorada!");

            cm.dispose();
        }
    }
}
