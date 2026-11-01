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
	Author : Generic
	NPC Name: 		Kiku
	Map(s): 		Empress' Road : Training Forest I
	Description: 		Quest - Kiku the Training Instructor
	Quest ID : 		20002
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode > 0) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendNext("¿Qué? ¿Neinheart te envió aquí? Ahh, debes ser un novato. Bienvenido, bienvenido. Mi nombre es Kiku y mi trabajo es entrenar y convertir a niños como tú en auténticos caballeros. Hmmm... ¿Por qué me miras así? Ahh, nunca debes haber visto a Piyos antes.");
        } else if (status == 1) {
            qm.sendNext("Pertenecemos a una raza llamada Piyos. Has hablado con Shinsoo antes, ¿verdad? El que está al lado de la Emperatriz. Sí, Shinsoo también es un Piyo. Puede que sea de una clase diferente, pero... bueno. Los piyos solo se encuentran en Ereve, por lo que puede que al principio te parezcan un poco extraños, pero te acostumbrarás a nosotros.");
        } else if (status == 2) {
            qm.sendAcceptDecline("Ah, no sé si eres consciente de esto, pero no encontrarás ningún monstruo aquí en Ereve. Ninguna forma de maldad podrá poner un pie en esta isla. No te preocupes, aún tendrás la oportunidad de entrenar aquí. Shinsoo creó una criatura de fantasía llamada Mimi, que será utilizada como compañera de entrenamiento. ¿Empezamos?");
        } else if (status == 3) {
            qm.forceStartQuest();
            qm.forceCompleteQuest();

            qm.gainExp(60);
            qm.gainItem(2000020, 10); // Red Potion for Noblesse * 10
            qm.gainItem(2000021, 10); // Blue Potion for Noblesse * 10
            qm.gainItem(1002869, 1);  // Elegant Noblesse Hat * 1

            qm.sendOk("Ja, me gusta tu entusiasmo, pero primero debes prepararte para el entrenamiento antes de comenzar. Asegúrate de estar equipado con armas y de que tus habilidades estén calibradas y listas para ser utilizadas. También te di algunas pociones, así que tenlas listas por si acaso. Avísame cuando estés listo. Desearás no haberte registrado para convertirte en Cygnus Knight.");
        } else if (status == 4) {
            qm.dispose();
        }
    }
}