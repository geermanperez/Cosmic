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

status = -1;
var sel;
var pickup = -1;

function start() {
    cm.sendSimple("Soy Abdula y soy un comerciante intermediario que se ocupa de bienes raros. ¿Qué tienes para mí?#b\r\n#L0#Quiero vender productos.\r\n#L1#Quiero saber sobre los precios actuales del mercado.\r\n#L2#¿Un intermediario comercial? ¿Qué es eso?");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        } else if (mode == 0 && sel == 0 && status == 2) {
            cm.sendNext("¿No quieres venderlo ahora? Puedes venderlo más tarde, pero recuerda que los artículos especiales sólo tienen valor durante una semana.");
            cm.dispose();
            return;
        } else if (mode == 0 && sel == 2) {
            status -= 2;
        }
    }
    if (status == 0) {
        if (sel == undefined) {
            sel = selection;
        }
        if (selection == 0) {
            var text = "Let's see what you brought...#b";
            for (var i = 0; i < 5; i++) {
                text += "\r\n#L" + i + "##t" + (3994090 + i) + "#";
            }
            cm.sendSimple(text);
        } else if (selection == 1) {
            var text = "";
            for (var i = 0; i < 5; i++) {
                text += "The current market price for #t" + (i + 3994090) + "# is #rNOT DONE#k mesos\r\n";
            }
            cm.sendNext(text);
            cm.dispose();
        } else {
            cm.sendNext("Compro los productos en el Maple 7th Day Market y los vendo en otras ciudades. Cambio recuerdos, especias, taxidermia de tiburones y más... pero no huevos de Lazy Daisy.");
        }
    } else if (status == 1) {
        if (sel == 0) {
            if (cm.haveItem(3994090 + selection)) {
                pickup = 3994090 + selection;
                cm.sendYesNo("El precio actual es de 180 mesos. ¿Quieres venderlo ahora?"); //Make a price changer by hour.
            } else {
                cm.sendNext("No tienes nada. Deja de hacerme perder el tiempo... Soy una persona ocupada.");
                cm.dispose();
            }
        } else {
            cm.sendNextPrev("Maple 7th Day Market Los domingos son mis días libres. Si necesitas verme, tendrás que venir de lunes a viernes...");
        }
    } else if (status == 2) {
        if (sel == 0) {
            cm.sendGetNumber("¿Cuántos te gustaría vender?", 0, 0, 200);
        } else {
            cm.sendPrev("Ah, y los precios están sujetos a cambios. No puedo conseguir el extremo más corto del palo, ¡tengo que seguir en el negocio! Vuelve conmigo con frecuencia, ¡mis precios cambian cada hora!");
        }
    } else if (status == 3) {
        if (sel == 0) {
            if (selection != 1) {
                cm.sendNext("Algo no está bien. Compruébalo de nuevo.");
            } else {
                cm.sendNext("La transacción se ha completado. Nos vemos la próxima vez.");
                cm.gainMeso(180);
                cm.gainItem(pickup, -1);
            }
        }
        cm.dispose();
    }
}