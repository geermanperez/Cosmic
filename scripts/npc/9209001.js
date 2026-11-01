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
var sel, sel2;

function start() {
    cm.sendOk("Hola, el mercado del séptimo día de Maple no está disponible actualmente.");
    cm.dispose();
    return;

    cm.sendSimple("Hola, el mercado del séptimo día de Maple abre hoy.#b\r\n#L0#Mover al mapa del Mercado del 7mo Día de Maple\r\n#L1#Escuche una explicación sobre el mercado del séptimo día de Maple.");
}

function action(mode, type, selection) {
    status++;
    if (status == 6 && mode == 1) {
        sel2 = undefined;
        status = 0;
    }
    if (mode != 1) {
        if (mode == 0 && type == 0) {
            status -= 2;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (sel == undefined) {
            sel = selection;
        }
        if (selection == 0) {
            cm.sendNext("Bien, te enviaremos al mapa del mercado del séptimo día de Maple.");
        } else {
            cm.sendSimple("¿Qué le gustaría saber sobre el mercado del séptimo día de Maple?#b\r\n#L0#¿Dónde se lleva a cabo el mercado del séptimo día de Maple?\r\n#L1#¿Qué puedes hacer en el mercado del séptimo día de Maple?\r\n#L2#No tengo ninguna pregunta.");
        }
    } else if (status == 1) {
        if (sel == 0) {
            cm.getPlayer().saveLocation("EVENT");
            cm.warp(680100000 + parseInt(Math.random() * 3));
            cm.dispose();
        } else if (selection == 0) {
            cm.sendNext("El mercado del séptimo día de Maple abre solo los domingos. Puedes entrar si me encuentras en cualquier pueblo, Henesys, New Leaf City, Leafre, Kerning City, Ludibrium, ¡estoy en casi todas partes!");
            status -= 2;
        } else if (selection == 1) {
            cm.sendSimple("Puede encontrar productos raros que son difíciles de encontrar en otros lugares en Maple 7th Day Market.#b\r\n#L0#Comprar artículos especiales\r\n#L1#Ayude al propietario de la granja avícola");
        } else {
            cm.sendNext("Supongo que no tienes ninguna pregunta. Por favor, manténganos en sus pensamientos y pregúntenos si tiene curiosidad sobre algo.");
            cm.dispose();
        }
    } else if (status == 2) {
        if (sel2 == undefined) {
            sel2 = selection;
        }
        if (sel2 == 0) {
            cm.sendNext("Puedes encontrar muchos artículos en el Maple 7th Day Market. Los precios están sujetos a cambios, ¡así que será mejor que los consigas cuando estén baratos!");
        } else {
            cm.sendNext("Además de los comerciantes, también puedes encontrar a la hija perezosa del dueño de la granja avícola en el Maple 7th Day Market. ¡Ayuda a Mimi a incubar su huevo hasta que se convierta en una gallina!");
        }
    } else if (status == 3) {
        if (sel2 == 0) {
            cm.sendNextPrev("Las compras realizadas aquí se pueden vender al intermediario comercial, Abdula. No aceptará nada que tenga más de una semana, ¡así que asegúrese de revenderlo antes del sábado!");
        } else {
            cm.sendNextPrev("Como no puede confiarle el huevo a nadie, pedirá un depósito. Págale el depósito y cuida bien el huevo.");
        }
    } else if (status == 4) {
        if (sel2 == 0) {
            cm.sendNextPrev("Abdula también ajusta sus tarifas de reventa, por lo que sería prudente vender cuando pueda obtener la mayor ganancia. Los precios tienden a fluctuar cada hora, así que recuerda consultar con frecuencia.");
        } else {
            cm.sendNextPrev("Si logras convertir el huevo en gallina con éxito y se lo llevas a Mimi, Mimi te recompensará. Puede que sea vaga, pero no desagradecida.");
        }
    } else if (status == 5) {
        if (sel2 == 0) {
            cm.sendNextPrev("Pon a prueba tu ingenio comercial comprando productos a precios bajos en el mercado del séptimo día de Maple y vendiéndolos al comerciante intermediario cuando su valor suba.");
        } else {
            cm.sendNextPrev("Puedes hacer clic en el huevo para comprobar su crecimiento. Tienes que ser diligente con el huevo ya que la EXP que ganas y el huevo crecerán juntos.");
        }
    }
}