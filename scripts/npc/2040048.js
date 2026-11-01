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
var pay = 1800;
var ticket = 4031134;
var msg;
var check;
var access = false;
var status = 0;

function start() {
    cm.sendSimple("¿Has oído hablar de la playa con una vista espectacular al océano llamada#b#m110000000##k, ubicado un poco lejos de#m" + cm.getPlayer().getMapId() + "#? Puedo llevarte allí ahora mismo para #b" + pay + "mesos#k, o si tienes#b#t" + ticket + "##kcontigo, en cuyo caso entrarás gratis.\r\n\r\n#L0##bvoy a pagar" + pay + "mesos.#k#l\r\n#L1##bTengo#t" + ticket + "##k#l\r\n#L2##bQué es#t" + ticket + "#?#k#l");
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 0 && status == 1) {
            cm.sendNext("Debes tener algunos asuntos que atender aquí. Debes estar cansado de tanto viajar y cazar. Ve a descansar y si tienes ganas de cambiar de opinión, ven a hablar conmigo.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (selection == 0 || selection == 1) {
                check = selection;
                if (selection == 0) {
                    msg = "You want to pay #b" + pay + " mesos#k and leave for #m110000000#?";
                } else if (selection == 1) {
                    msg = "So you have #b#t" + ticket + "##k? You can always head over to #m110000000# with that.";
                }
                cm.sendYesNo(msg + "¡¡Bueno!! Sin embargo, ten en cuenta que es posible que te encuentres con algunos monstruos por ahí, así que asegúrate de que no te pillen desprevenido. Bien, ¿te gustaría dirigirte a #m110000000# ahora mismo?");
            } else if (selection == 2) {
                cm.sendNext("Debes sentir curiosidad por#b#t" + ticket + "##k. Sí, puedo ver eso.#t" + ticket + "# es un artículo que, mientras lo tengas en posesión, podrás acceder a #m110000000# de forma gratuita. Es un artículo tan raro que incluso nosotros tuvimos que comprarlo, pero desafortunadamente perdí el mío hace unas semanas durante un fin de semana largo.");
                status = 3;
            }
        } else if (status == 2) {
            if (check == 0) {
                if (cm.getPlayer().getMeso() < pay) {
                    cm.sendOk("Creo que te falta mesos. Hay muchas maneras de reunir algo de dinero, ya sabes, como... vender tu armadura... derrotar a los monstruos... hacer misiones... ya sabes de lo que estoy hablando.");
                    cm.dispose();
                } else {
                    cm.gainMeso(-pay);
                    access = true;
                }
            } else if (check == 1) {
                if (!cm.haveItem(ticket)) {
                    cm.sendOk("Hmmm, ¿dónde está exactamente?#b#t" + ticket + "##k?? ¿Estás seguro de que los tienes? Por favor vuelva a verificar.");
                    cm.dispose();
                } else {
                    access = true;
                }
            }
            if (access == true) {
                cm.getPlayer().saveLocation("FLORINA");
                cm.warp(110000000, "st00");
                cm.dispose();
            }
        } else if (status == 3) {
            cm.sendNext("Debes sentir curiosidad por#b#t" + ticket + "##k. Sí, puedo ver eso.#t" + ticket + "# es un artículo que, mientras lo tengas en posesión, podrás acceder a #m110000000# de forma gratuita. Es un artículo tan raro que incluso nosotros tuvimos que comprarlo, pero desafortunadamente perdí el mío hace unas semanas durante un fin de semana largo.");
        } else if (status == 4) {
            cm.sendPrev("Regresé sin él y se siente horrible no tenerlo. Ojalá alguien lo recogiera y lo guardara en algún lugar seguro. De todos modos, esta es mi historia y quién sabe, es posible que puedas retomarla y darle un buen uso. Si tienes alguna pregunta, no dudes en preguntar.");
        } else if (status == 5) {
            cm.dispose();
        }
    }
}
