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
 -- Odin JavaScript --------------------------------------------------------------------------------
 Arwen the Fairy - Victoria Road : Ellinia (101000000)
 -- By ---------------------------------------------------------------------------------------------
 Xterminator
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Xterminator
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var item;
var selected;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 1 && mode == 0) {
            cm.dispose();
            return;
        } else if (status == 2 && mode == 0) {
            cm.sendNext("No es fácil hacer" + item + ". Por favor prepare los materiales.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            if (cm.getLevel() >= 40) {
                cm.sendNext("Sí... soy el maestro alquimista de las hadas. Pero se supone que las hadas no deben estar en contacto con un ser humano durante un largo período de tiempo... Sin embargo, una persona fuerte como tú estará bien. Si me consigues los materiales, te haré un artículo especial.");
            } else {
                cm.sendOk("Puedo hacer artículos raros y valiosos, pero desafortunadamente no puedo entregárselos a un extraño como tú.");
                cm.dispose();
            }
        } else if (status == 1) {
            cm.sendSimple("¿Qué quieres hacer?#b\r\n#L0#Roca lunar#l\r\n#L1#Roca estrella#l\r\n#L2#Pluma negra#l");
        } else if (status == 2) {
            selected = selection;
            if (selection == 0) {
                item = "Moon Rock";
                cm.sendYesNo("¿Entonces quieres hacer una Roca Lunar? Para hacer eso necesitas refinar uno de cada uno de estos:#bPlaca de bronce#k, #bPlaca de acero#k,\r\n#bPlaca de mitril#k, #bPlaca de Adamantium#k, #bPlaca de plata#k, #bPlaca de Orihalcón#ky#bPlaca de oro#k. Añade 10.000 mesos y te lo haré.");
            } else if (selection == 1) {
                item = "Star Rock";
                cm.sendYesNo("¿Entonces quieres hacer una Star Rock? Para hacer eso necesitas refinar uno de cada uno de estos:#bGarnet#k,#bAmethyst#k,#bAquaMarine#k,#bEmerald#k,#bOpal#k,#bSapphire#k,#bTopaz#k,#bDiamond#k y#bCristal negro#k. Añade 15.000 mesos y te lo hago.");
            } else if (selection == 2) {
                item = "Black Feather";
                cm.sendYesNo("¿Entonces quieres hacer una Pluma Negra? Para hacer eso necesitas#b1 pluma llameante#k, #b1 roca lunar#ky#b1 cristal negro#k. Añade 30.000 mesos y te lo haré. Oh, sí, este trozo de pluma es un objeto muy especial, por lo que si por casualidad lo dejas caer, desaparecerá y no podrás regalárselo a nadie más.");
            }
        } else if (status == 3) {
            if (selected == 0) {
                if (cm.haveItem(4011000) && cm.haveItem(4011001) && cm.haveItem(4011002) && cm.haveItem(4011003) && cm.haveItem(4011004) && cm.haveItem(4011005) && cm.haveItem(4011006) && cm.getMeso() >= 10000) {
                    cm.gainMeso(-10000);
                    for (var i = 4011000; i < 4011007; i++) {
                        cm.gainItem(i, -1);
                    }
                    cm.gainItem(4011007, 1);
                    cm.sendNext("Ok aquí, toma" + item + ". Está bien hecho, probablemente porque estoy usando buenos materiales. Si necesitas mi ayuda en el futuro, no dudes en volver.");
                } else {
                    cm.sendNext("¿Estás seguro de que tienes suficientes mesos? Por favor verifique y vea si tiene el refinado#bPlaca de bronce#k, #bPlaca de acero#k,\r\n#bPlaca de mitril#k, #bPlaca de Adamantium#k, #bPlaca de plata#k, #bPlaca de Orihalcón#ky#bPlaca de oro#k, uno de cada uno.");
                }
            } else if (selected == 1) {
                if (cm.haveItem(4021000) && cm.haveItem(4021001) && cm.haveItem(4021002) && cm.haveItem(4021003) && cm.haveItem(4021004) && cm.haveItem(4021005) && cm.haveItem(4021006) && cm.haveItem(4021007) && cm.haveItem(4021008) && cm.getMeso() >= 15000) {
                    cm.gainMeso(-15000);
                    for (var j = 4021000; j < 4021009; j++) {
                        cm.gainItem(j, -1);
                    }
                    cm.gainItem(4021009, 1);
                    cm.sendNext("Ok aquí, toma" + item + ". Está bien hecho, probablemente porque estoy usando buenos materiales. Si necesitas mi ayuda en el futuro, no dudes en volver.");
                } else {
                    cm.sendNext("¿Estás seguro de que tienes suficientes mesos? Por favor verifique y vea si tiene el refinado#bGarnet#k,#bAmethyst#k,#bAquaMarine#k,#bEmerald#k,#bOpal#k,#bSapphire#k,#bTopaz#k,#bDiamond#k y#bCristal negro#k, uno de cada uno.");
                }
            } else if (selected == 2) {
                if (cm.haveItem(4001006) && cm.haveItem(4011007) && cm.haveItem(4021008) && cm.getMeso() >= 30000) {
                    cm.gainMeso(-30000);
                    for (var k = 4001006; k < 4021009; k += 10001) {
                        cm.gainItem(k, -1);
                    }
                    cm.gainItem(4031042, 1);
                    cm.sendNext("Ok aquí, toma" + item + ". Está bien hecho, probablemente porque estoy usando buenos materiales. Si necesitas mi ayuda en el futuro, no dudes en volver.");
                } else {
                    cm.sendNext("¿Estás seguro de que tienes suficientes mesos? Por favor verifique y vea si tiene el refinado#bGarnet#k,#bAmethyst#k,#bAquaMarine#k,#bEmerald#k,#bOpal#k,#bSapphire#k,#bTopaz#k,#bDiamond#k y#bCristal negro#k, uno de cada uno.");
                }
            }
            cm.dispose();
        }
    }
}