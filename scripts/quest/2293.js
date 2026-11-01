/*
	This file is part of the DietStory Maple Story Server
    Copyright (C) 2017
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
/* Author: Benji 
	NPC Name: 		Maestro Rho
	Map(s): 		Kerning Square Lobby
	Description: 	The Last Song
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (status == 0) {
        qm.sendNext("¿Recuerdas la última canción que tocó Spirit of Rock? Se me ocurren algunas canciones que quizás esté imitando, así que escúchalas con atención y dime cuál es.#bSólo tienes una oportunidad#kAsí que elige sabiamente.");
        qm.forceStartQuest();
    } else if (status == 1) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    if (mode == -1 || (mode == 0 && status == 0)) {
        qm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    // TODO: there are 10 different riffs; quest2288/0 through quest2288/9.
    // One of the riffs should play randomly upon the death of Spirit of Rock, but there is currently no system in place to achieve that in a reasonable way.
    // Spirit of Rock (4300013) spawns an invisible mob on death (Spirit of Rock's Soul, 4300017) which was likely used in some clever way in GMS.
    // The map (103040430) has two scripts which could be useful: onFirstUserEnter=Depart_Boss_F_Enter and onUserEnter=Depart_BossEnter
    // Currently, the best hypothesis is that one of the map scripts registers some form of "mob spawn" action/script that runs once the invisible mob spawns.
    // The script would randomly pick one of the 10 riffs and then register it with all chrs on the map (to later be used by this quest 2293) and play it.
    if (status == 0) {
        qm.sendSimple("Aquí te daré algunas muestras. Por favor escúchalos y elige uno. Escuche atentamente antes de hacer su elección.\r\n\
            \t#b#L1#Escuche la canción número 1.#l \r\n\
            \t#L2#Escuche la canción número 2#l \r\n\
            \t#L3#Escuche la canción número 3#l \r\n\
            \r\n\
            \t#e#L4#Ingresa la canción correcta.#l");
    } else if (status == 1) {
        if (selection == 1) {
            qm.playSound("Party1/Failed");
            qm.sendOk("Torpemente familiar...");
            status = -1;
        } else if (selection == 2) {
            qm.playSound("Coconut/Failed");
            qm.sendOk("¿Fue esto?");
            status = -1;
        } else if (selection == 3) {
            qm.playSound("quest2288/6");
            qm.sendOk("¿Escuchaste eso?");
            status = -1;
        } else if (selection == 4) {
            qm.sendGetNumber("Ahora por favor dime la respuesta. solo obtienes#buna oportunidad#k, así que elija sabiamente. Por favor ingresa#b1, 2 o 3#ken la ventana de abajo.\r\n", 1, 1, 3);
        }
    } else if (status == 2) {
        if (selection == 1) {
            qm.sendOk("Obviamente no te gusta la música.");
        } else if (selection == 2) {
            qm.sendOk("Supongo que podrías conseguir#b#eone#norte#kmás posibilidades.");
        } else if (selection == 3) {
            qm.sendOk("Así que esa era la canción que estaba tocando... Bueno, no era mi canción después de todo, pero me alegro de poder saberlo ahora con certeza. Muchas gracias.");
            qm.forceCompleteQuest();
            qm.gainExp(32500);
        } else {
            qm.dispose();
        }
    } else if (status == 3) {
        qm.dispose();
    }
}
