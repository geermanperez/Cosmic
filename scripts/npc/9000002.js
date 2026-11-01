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
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else if (mode == 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendNext("Bam bam bam bam!! Has ganado el juego del \r\n#bEVENT#k. ¡Felicitaciones por llegar hasta aquí!");
        } else if (status == 1) {
            cm.sendNext("Se te otorgará el#bPergamino de los secretos#kcomo premio ganador. En el pergamino tiene información secreta escrita en caracteres antiguos.");
        } else if (status == 2) {
            cm.sendNext("El Pergamino de los Secretos puede ser descifrado por#rChun Ji#ko\r\n#rGeanie#k en Ludibrium. Tráelo contigo y algo bueno seguramente sucederá.");
        } else if (status == 3) {
            if (cm.canHold(4031019)) {
                cm.gainItem(4031019);
                cm.warp(cm.getPlayer().getSavedLocation("EVENT"));
                cm.dispose();
            } else {
                cm.sendNext("Creo que tu ventana Etc está llena. Por favor, haz espacio y luego habla conmigo.");
            }
        } else if (status == 4) {
            cm.dispose();
        }
    }
}  
