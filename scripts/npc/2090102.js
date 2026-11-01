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

/* Romi
	Orbis Skin Change.
*/
var status = 0;
var price = 1000000;
var skin = Array(0, 1, 2, 3, 4);

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {  // disposing issue with stylishs found thanks to Vcoc
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendSimple("Bueno, hola! ¡Bienvenido al cuidado de la piel Mu Lung! ¿Te gustaría tener una piel firme, tersa y de aspecto saludable como la mía?  Con#b#t5153006##k¡Puedes dejar que nosotros nos encarguemos del resto y tener el tipo de piel que siempre has deseado~!\r\n#L2#Protección de la piel:#i5153006##t5153006##l");
        } else if (status == 1) {
            if (selection == 2) {
                cm.sendStyle("Con nuestra máquina especializada, podrás ver cómo lucirás después del tratamiento ANTES del procedimiento. ¿Qué tipo de look estás buscando? ¡Adelante, elige el estilo que más te guste~!", skin);
            }
        } else if (status == 2) {
            cm.dispose();
            if (cm.haveItem(5153006)) {
                cm.gainItem(5153006, -1);
                cm.setSkin(skin[selection]);
                cm.sendOk("¡Disfruta de tu piel nueva y mejorada!");
            } else {
                cm.sendOk("Um...no tienes el cupón de cuidado de la piel que necesitas para recibir el tratamiento. Lo siento, pero me temo que no podemos hacerlo por usted...");
            }
        }
    }
}
