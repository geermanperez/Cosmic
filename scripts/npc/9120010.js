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
var status = 0;
var eQuestChoices = [4000064, 4000065, 4000066, 4000075, 4000077, 4000089, 4000090, 4000091, 4000092, 4000093, 4000094];
var eQuestPrizes = [];
eQuestPrizes[0] = [[2000000, 1], [2000006, 1], [2000003, 5], [2000002, 5], [4020006, 2], [4020000, 2], [4020004, 2], [2000003, 10], [2000003, 20], [2000002, 10], [2000002, 20], [2022026, 15], [2022024, 15], [1002393, 1]];	// Crow feather
eQuestPrizes[1] = [[2000006, 1], [2000002, 5], [4020006, 2], [2000002, 10], [2000003, 10], [2000002, 20], [2000003, 20], [2022024, 15], [2022026, 15]];	// Raccoon firewood
eQuestPrizes[2] = [[2000006, 1], [2000002, 5], [2000003, 5], [4020000, 2], [2000003, 10], [2000002, 10], [2000003, 20], [2000002, 20], [2022024, 15], [1002393, 1]];	// Cloud foxtail
eQuestPrizes[3] = [[2060003, 1000], [4010004, 2], [4010006, 2], [2022022, 5], [2022022, 10], [2022022, 15], [2022019, 5], [2022019, 10], [2022019, 15], [2001002, 15], [2001001, 15], [1102040, 1], [1102043, 1]];	// Tringular bandana of the nightghost
eQuestPrizes[4] = [[2000003, 1], [2022019, 5], [2000006, 5], [4010002, 2], [4010003, 2], [2000006, 10], [2000006, 15], [2022019, 10], [2022019, 15], [2060003, 1000], [2061003, 1000], [1082150, 1], [1082149, 1]];	// Dark cloud foxtail
eQuestPrizes[5] = [[2000006, 1], [2000003, 5], [2000002, 5], [2000003, 10], [2000003, 20], [2000002, 10], [2000002, 15], [2060003, 1000], [2061003, 1000], [2022026, 15], [1002395, 1]];   // Littleman A's badge
eQuestPrizes[6] = [[2022019, 5], [2000006, 5], [4010003, 2], [2022019, 10], [2022019, 15], [2000006, 10], [2000006, 15], [2060003, 1000], [2061003, 1000]];                // Littleman B's name plate
eQuestPrizes[7] = [[2000003, 1], [2000006, 1], [2022019, 1], [2000006, 5], [4010002, 2], [4020001, 2], [2022019, 10], [2022019, 15], [2000006, 10], [2000006, 15], [2060003, 1000], [2061003, 1000]];       // Littleman C's necklace
eQuestPrizes[8] = [[2022019, 5], [2022022, 5], [4010006, 2], [2022019, 10], [2022019, 15], [2022022, 10], [2022022, 15], [2001002, 15], [2001001, 15], [1102043, 1]];	// Leader A's shades
eQuestPrizes[9] = [[4010004, 5], [2022019, 5], [2022022, 15], [2022019, 15], [2001002, 15], [2001001, 15], [1102043, 1]];	// Leader B's charm
eQuestPrizes[10] = [[1102207, 1], [1442026, 1], [1302037, 1], [2070007, 1], [2340000, 1], [2330005, 1], [2022060, 25], [2022061, 20], [2022062, 15]];	// Boss pomade
var requiredItem = 0;
var lastSelection = 0;
var prizeItem = 0;
var prizeQuantity = 0;
var info;
var itemSet;
var reward;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.sendOk("¿En realidad? Déjame saber si alguna vez cambias de opinión.");
            cm.dispose();
            return;
        }
        if (mode == 0 && status == 1) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        }
        if (status == 0) {
            cm.sendYesNo("Si está buscando a alguien que pueda identificar las características de varios elementos, está buscando uno ahora mismo. Actualmente estoy buscando algo. ¿Te gustaría escuchar mi historia?");
        } else if (status == 1) {
            var eQuestChoice = makeChoices(eQuestChoices);
            cm.sendSimple(eQuestChoice);
        } else if (status == 2) {
            requiredItem = eQuestChoices[selection];
            reward = eQuestPrizes[selection];
            itemSet = (Math.floor(Math.random() * reward.length));
            prizeItem = reward[itemSet][0];
            prizeQuantity = reward[itemSet][1];
            if (!cm.canHold(prizeItem)) {
                cm.sendNext("No puedo darte la recompensa si tu inventario de equipo, uso, etc. está lleno. Por favor, eche un vistazo ahora mismo.");
            } else if (cm.hasItem(requiredItem, 100)) {   // check they have >= 100 in Inventory
                cm.gainItem(requiredItem, -100);
                cm.gainItem(prizeItem, prizeQuantity);
                cm.sendOk("Hmmm... si no fuera por este pequeño rasguño... suspiro. Me temo que sólo puedo considerarlo un artículo de calidad estándar. Bueno, aquí está \r\n#t" + prizeItem + "# para ti.");
            } else {
                cm.sendOk("Oye, ¿qué crees que estás haciendo? Vaya a mentirle a alguien que NO sabe de lo que está hablando. ¡Yo no!");
            }
            cm.dispose();
        }
    }
}

function makeChoices(a) {
    var result = "The items I'm looking for are 1,2,3 ... phew, too many to\r\nmention. Anyhow, if you gather up 100 of the same items,\r\nthen i may trade it with something similiar. What? You may\r\nnot know this, but i keep my end of the promise, so you\r\nneed not worry. Now, shall we trade?\r\n";
    for (var x = 0; x < a.length; x++) {
        result += " #L" + x + "##v" + a[x] + "##t" + a[x] + "##l\r\n";
    }
    return result;
}