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

/*
 * Author: kevintjuh93
 *
*/
function start(ms) {
    if (ms.getPlayer().getMapId() == 110000000 || (ms.getPlayer().getMapId() >= 100000000 && ms.getPlayer().getMapId() < 105040300)) {
        ms.explorerQuest(29005, "Explorador principiante");//Beginner Explorer
    } else if (ms.getPlayer().getMapId() >= 105040300 && ms.getPlayer().getMapId() <= 105090900) {
        ms.explorerQuest(29014, "Explorador de Sleepywood");//Sleepywood Explorer
    } else if (ms.getPlayer().getMapId() >= 200000000 && ms.getPlayer().getMapId() <= 211041800) {
        ms.explorerQuest(29006, "Explorador de las montañas de El Nath");//El Nath Mts. Explorer
    } else if (ms.getPlayer().getMapId() >= 220000000 && ms.getPlayer().getMapId() <= 222020000) {
        ms.explorerQuest(29007, "Explorador de Ludus Lake");//Ludus Lake Explorer
    } else if (ms.getPlayer().getMapId() >= 230000000 && ms.getPlayer().getMapId() <= 230040401) {
        ms.explorerQuest(29008, "Explorador submarino");//Undersea Explorer
    } else if (ms.getPlayer().getMapId() >= 250000000 && ms.getPlayer().getMapId() <= 251010500) {
        ms.explorerQuest(29009, "Explorador de Mu Lung");//Mu Lung Explorer
    } else if (ms.getPlayer().getMapId() >= 260000000 && ms.getPlayer().getMapId() <= 261030000) {
        ms.explorerQuest(29010, "Explorador del desierto de Nihal");//Nihal Desert Explorer
    } else if (ms.getPlayer().getMapId() >= 240000000 && ms.getPlayer().getMapId() <= 240050000) {
        ms.explorerQuest(29011, "Explorador del bosque de Minar");//Minar Forest Explorer
    }
    if (ms.getPlayer().getMapId() == 104000000) {
        ms.mapEffect("maplemap/enter/104000000");
    }
}
