/* 
 * This file is part of the OdinMS Maple Story Server
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

/* 
 * @Author Lerk
 * 
 * Shawn, Victoria Road: Excavation Site<Camp> (101030104)
 * 
 * Guild Quest Info
 */

var status;
var selectedOption;

function start() {
    selectedOption = -1;
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (mode == 1 && status == 3) {
            status = 0;
        }
        if (status == 0) {
            var prompt = "\r\n#b#L0# What's Sharenian?#l\r\n#b#L1# #t4001024#? What's that?#l\r\n#b#L2# Guild Quest?#l\r\n#b#L3# No, I'm fine now.#l";
            if (selectedOption == -1) {
                prompt = "We, the Union of Guilds, have been trying to decipher 'Emerald Tablet,' a treasured old relic, for a long time. As a result, we have found out that Sharenian, the mysterious country from the past, lay asleep here. We also found out that clues of #t4001024#, a legendary, mythical jewelry, may be here at the remains of Sharenian. This is why the Union of Guilds have opened Guild Quest to ultimately find #t4001024#." + prompt;
            } else {
                prompt = "Do you have any other questions?" + prompt;
            }
            cm.sendSimple(prompt);
        } else if (status == 1) {
            selectedOption = selection;
            if (selectedOption == 0) {
                cm.sendNext("Sharenian era una civilización alfabetizada del pasado que tenía control sobre todas las áreas de la Isla Victoria. El Templo de Golem, el Santuario en la parte profunda del Calabozo y otras antiguas construcciones arquitectónicas donde nadie sabe quién lo construyó, en realidad fueron hechas durante la época Sharenia.");
            } else if (selectedOption == 1) {
                cm.sendNext("#t4001024# es una joya legendaria que aporta la eterna juventud a quien la posee. Irónicamente, parece que todos los que tenían #t4001024# terminaron oprimidos, lo que debería explicar la caída de Sharenian.");
                status = -1;
            } else if (selectedOption == 2) {
                cm.sendNext("Envié grupos de exploradores a Sharenian antes, pero ninguno de ellos regresó, lo que nos impulsó a iniciar Guild Quest. Hemos estado esperando gremios que sean lo suficientemente fuertes como para afrontar desafíos difíciles, gremios como el tuyo.");
            } else if (selectedOption == 3) {
                cm.sendOk("¿En realidad? Si tienes algo más que preguntar, no dudes en hablar conmigo.");
                cm.dispose();
            } else {
                cm.dispose();
            }
        } else if (status == 2) { //should only be available for options 0 and 2
            if (selectedOption == 0) {
                cm.sendNextPrev("El último rey de Sharenian fue un caballero llamado Sharen III, y aparentemente era un rey muy sabio y compasivo. Pero un día, todo el reino se derrumbó y no se dio ninguna explicación al respecto.");
            } else if (selectedOption == 2) {
                cm.sendNextPrev("El objetivo final de esta Guild Quest es explorar Sharenian y encontrar #t4001024#. Ésta no es una tarea en la que el poder lo solucione todo. El trabajo en equipo es más importante aquí.");
            } else {
                cm.dispose();
            }
        }
    }
}