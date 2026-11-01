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
/* Author: Xterminator
	NPC Name: 		Mr. Goldstein
	Map(s): 		Victoria Road : Lith Harbour (104000000)
	Description:		Extends Buddy List
*/
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            cm.sendNext("Ya veo... no tienes tantos amigos como pensé que tendrías. Jajaja, ¡es broma! De todos modos, si desea cambiar de opinión, no dude en volver y hablaremos de negocios. Si haces muchos amigos, entonces ya sabes... jeje...");
            cm.dispose();
            return;
        } else if (status >= 1 && mode == 0) {
            cm.sendNext("Ya veo... No creo que no tengas tantos amigos como pensé que tendrías. Si no, ¿no tienes 240.000 mesos contigo en este momento? De todos modos, si alguna vez cambias de opinión, vuelve y hablaremos de negocios. Eso es, por supuesto, una vez que haya obtenido algún alivio financiero. .. jeje...");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendYesNo("Espero poder ganar tanto como ayer... bueno, ¡hola! ¿No quieres ampliar tu lista de amigos? Pareces alguien que tendría muchos amigos... bueno, ¿qué piensas? Con algo de dinero puedo hacerlo realidad para ti. Sin embargo, recuerda que solo se aplica a un personaje a la vez, por lo que no afectará a ninguno de los demás personajes de tu cuenta. ¿Quieres ampliar tu lista de amigos?");
        } else if (status == 1) {
            cm.sendYesNo("Muy bien, ¡buena decisión! En realidad no es tan caro.#b240.000 mesos y agregaré 5 espacios más a tu lista de amigos#k. Y no, no los venderé individualmente. Una vez que lo compres, estará permanentemente en tu lista de amigos. Entonces, si eres de los que necesita más espacio allí, entonces también puedes hacerlo. ¿Qué opinas? ¿Gastaréis 240.000 mesos en ello?");
        } else if (status == 2) {
            var capacity = cm.getPlayer().getBuddylist().getCapacity();
            if (capacity >= 50 || cm.getMeso() < 240000) {
                cm.sendNext("Oye... ¿estás seguro de que tienes?#b240.000 mesos#k? Si es así, verifique si ha ampliado su lista de amigos al máximo. Incluso si pagas, lo máximo que puedes tener en tu lista de amigos es#b50#k.");
                cm.dispose();
            } else {
                var newcapacity = capacity + 5;
                cm.gainMeso(-240000);
                cm.getPlayer().setBuddyCapacity(newcapacity)
                cm.sendOk("¡Está bien! Tu lista de amigos ya tendrá 5 espacios adicionales. Compruébelo y compruébelo usted mismo. Y si aún necesitas más espacio en tu lista de amigos, ya sabes a quién encontrar. Por supuesto, no va a ser gratis... bueno, hasta luego...");
                cm.dispose();
            }
        }
    }
}