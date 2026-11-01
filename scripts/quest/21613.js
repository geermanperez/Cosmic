/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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

var status = -1;

function start(mode, type, selection) {
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
            qm.sendNext("Somos una manada de lobos buscando a nuestro hijo perdido. He oído que estás cuidando de nuestro bebé. Apreciamos su amabilidad, pero es hora de devolvernos a nuestro bebé.", 9);
        } else if (status == 1) {
            qm.sendNextPrev("El hombre lobo es mi amigo, no puedo simplemente entregarle un amigo.", 3);
        } else if (status == 2) {
            qm.sendAcceptDecline("Lo entendemos, pero no nos iremos sin nuestro cachorro. Te diré una cosa, te pondremos a prueba para ver si eres digno de criar un lobo.#rPrepárate para ser probado por los lobos.#k");
        } else if (status == 3) {
            var em = qm.getEventManager("Aran_3rdmount");
            if (em == null) {
                qm.sendOk("Lo sentimos, pero la misión de la tercera montura (Lobos) está cerrada.");

            } else {
                var em = qm.getEventManager("Aran_3rdmount");
                if (!em.startInstance(qm.getPlayer())) {
                    qm.sendOk("Actualmente hay alguien en este mapa, vuelve más tarde.");
                } else {
                    qm.forceStartQuest();
                }
            }
        } else if (status == 4) {
            qm.dispose();
        }
    }
}
