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

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Konpei - Showa Town(801000000)
 -- By ---------------------------------------------------------------------------------------------
 Information
 -- Version Info -----------------------------------------------------------------------------------
 1.1 - Fixed by Moogra
 1.0 - First Version by Information
 ---------------------------------------------------------------------------------------------------
 **/
var status = 0;

function start() {
    cm.sendSimple("¿Qué quieres de mí?\r #L0##bReúne información sobre el escondite.#l\r\n#L1#Llévame al escondite#l\r\n#L2#Nada#l#k");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            if (selection == 0) {
                cm.sendNext("Puedo llevarte al escondite, pero el lugar está infestado de matones que buscan problemas. Tendrás que ser increíblemente fuerte y valiente para entrar en la premisa. En el escondite, encontrarás al jefe que controla a todos los demás jefes de esta área. Es fácil llegar al escondite, pero solo se puede ingresar a la habitación en el último piso del lugar UNA VEZ al día. La Sala del Jefe no es un lugar para perder el tiempo. Te sugiero que no te quedes allí por mucho tiempo; Tendrás que encargarte rápidamente del negocio una vez dentro. El jefe en sí es un enemigo difícil, ¡pero te encontrarás con enemigos increíblemente poderosos en tu camino hacia el jefe! No será fácil.");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("Ay, el valiente. He estado esperando tu llegada. Si estos\r\nlos matones no se controlan, no se sabe qué va a pasar\r\nsucede en este barrio. Antes de que eso suceda, espero\r\nte encargas de todos ellos y vences al jefe, que reside\r\nen el quinto piso. Tendrás que estar alerta en todo momento, ya que\r\nEl jefe es demasiado duro para que lo manejen incluso los sabios.\r\nAl mirar tus ojos, sin embargo, puedo ver ese ojo del\r\ntigre, los ojos que me dicen que puedes hacer esto. ¡Vamos!");
            } else {
                cm.sendOk("¡Soy una persona ocupada! ¡Déjame en paz si eso es todo lo que necesitas!");
                cm.dispose();
            }
        } else {
            cm.warp(801040000, "in00");
            cm.dispose();
        }
    }
}