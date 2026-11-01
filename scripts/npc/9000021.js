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
/* 9000021 - Gaga
    BossRushPQ recruiter
    @author Ronan
 */

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendNext("¡Oye, viajero! Soy #p9000021# y mi trabajo es reclutar viajeros como tú, que buscan nuevos desafíos cada día. En este momento, mi equipo está realizando concursos que ponen a prueba a fondo las capacidades físicas y mentales de aventureros como tú.");
        } else if (status == 1) {
            cm.sendNext("Estos concursos implican#bpeleas secuenciales contra jefes#k, con algunos puntos de descanso entre algunos tramos. Estas requerirán algo de tiempo de estrategia y suficientes suministros a mano, ya que no son peleas comunes.");
        } else if (status == 2) {
            cm.sendAcceptDecline("Si crees que eres lo suficientemente poderoso, puedes unirte a otros como tú en el lugar donde organizamos las competencias de poder. ... Entonces, ¿cuál es tu decisión? ¿Vendrás a donde se están celebrando los concursos ahora mismo?");
        } else if (status == 3) {
            cm.sendOk("Muy bien. Recuerda, necesitas un grupo de al menos 2 jugadores para participar. ¡Buena suerte!");
        } else if (status == 4) {
            cm.getPlayer().saveLocation("BOSSPQ");
            cm.warp(970030000, "out00");
            cm.dispose();
        }
    }
}
