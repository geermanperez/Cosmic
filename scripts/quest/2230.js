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
	Author : 		Generic
	NPC Name: 		Mar the Fairy
	Map(s): 		Everywhere
	Description: 		Quest - A Mysterious Small Egg
	Quest ID: 		2230
*/

var status = -1;
var canComplete;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            qm.sendNext("Pongo esta pequeña y preciosa vida en tus manos... Guárdala con tu vida...");
        } else if (status == 1) {
            qm.sendYesNo("Cuidar otra vida... Ésa es la misión inevitable que te ha sido encomendada... Sigue la fuerza que te lleva hacia mí.");
        } else if (status == 2) {
            qm.sendOk("Pon tu mano en tu bolsillo. Creo que tu amigo ya te encontró.\r\nLa campanilla morada que toma el sol entre los árboles rascacielos...Sigue el camino hacia lo desconocido que te lleva a la campanilla. Te esperaré aquí.");
            qm.forceStartQuest();
            qm.gainItem(4032086, 1); // Mysterious Egg * 1
        } else if (status == 3) {
            qm.dispose();
        }
    }
}

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            qm.sendSimple("Hola viajero... Por fin has venido a verme. ¿Has cumplido con tus deberes?\r\n #b#L0#¿Qué deberes? ¿Quién eres?#l#k");
        } else if (selection == 0 && status == 1) {
            qm.sendNext("¿Has encontrado un pequeño huevo en tu bolsillo? Ese huevo es tu deber, tu responsabilidad. La vida es dura cuando estás solo. En momentos como este, no hay nada como tener un amigo que estará ahí para ti en todo momento. ¿Has oído hablar de un #bpet#k?\r\nLa gente cría mascotas para aliviar la carga, la tristeza y la soledad, porque saber que tienes a alguien, o algo en este asunto, a tu lado realmente te traerá tranquilidad. Pero todo tiene consecuencias, y con ellas viene la responsabilidad...");
        } else if (status == 2) {
            qm.sendNextPrev("Criar una mascota requiere una gran responsabilidad. Recuerde que una mascota también es una forma de vida, por lo que deberá alimentarla, ponerle un nombre, compartir sus pensamientos con ella y, en última instancia, formar un vínculo. Así es como los dueños se encariñan con estas mascotas.");
        } else if (status == 3) {
            qm.sendNextPrev("Quería inculcarte esto y por eso te envié un bebé que aprecio. El huevo que has traído es#bCaracol runa#k, una criatura que nace gracias al poder del Mana. Como lo cuidaste mucho cuando trajiste el huevo aquí, el huevo eclosionará pronto.");
        } else if (status == 4) {
            qm.sendNextPrev("Rune Snail es una mascota con muchas habilidades. Recogerá objetos, te alimentará con pociones y hará otras cosas que te sorprenderán. La desventaja es que dado que Rune Snail nació del poder de Mana, su vida útil es muy corta. Una vez que se convierta en muñeca, nunca podrá revivir.");
        } else if (status == 5) {
            qm.sendYesNo("¿Ahora lo entiendes? Cada acción tiene consecuencias y las mascotas no son una excepción. El huevo del caracol eclosionará pronto.");
        } else if (status == 6) {
            canComplete = qm.canHold(5000054, 1);
            if (!canComplete) {
                qm.sendNext("Libere un espacio en su inventario de EFECTIVO antes de intentar recibir la mascota...");
                return;
            }

            qm.sendNext("Este caracol sólo estará vivo por#b5 horas#k. Báñalo con amor. Tu amor será correspondido al final.");
        } else if (status == 7) {
            if (canComplete) {
                qm.gainItem(4032086, -1); // Mysterious Egg * -1
                qm.forceCompleteQuest();
                qm.gainItem(5000054, 1, false, true, 5 * 60 * 60 * 1000);  // rune snail (5hrs), missing expiration time detected thanks to cljnilsson
            }

            qm.dispose();
        }
    }
}