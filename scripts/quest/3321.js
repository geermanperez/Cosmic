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
            qm.sendNext("Como ya sabrá, soy el Dr. De Lang. Alguna vez fui un alquimista influyente entre las filas de la sociedad de Alcadno, pero me desconectaron de su sociedad debido al desastre posterior a mis experimentos fallidos, que ahora se puede ver en toda Magatia.");
        } else if (status == 1) {
            qm.sendNextPrev("Los huroides, mi creación, fueron diseñados originalmente para cumplir con asuntos domésticos, científicos y militares, sin embargo, un mal funcionamiento crítico en los chips de su unidad de procesamiento principal los volvió inestables y violentos, causando rápidamente agitaciones y estragos por todas partes. Debido a eso, me despojaron de mi condición de alquimista e investigador de Alcadno y obtuve una orden de arresto.");
        } else if (status == 2) {
            qm.sendAcceptDecline("Aun así, ¡no deben detenerme ahora! ¡Mis creaciones todavía deambulan causando destrucción y bajas todos los días, sin grandes esperanzas de expulsarlas de la ciudad! Pueden replicarse demasiado rápido y las armas normales no pueden detenerlos. Desde entonces he estado investigando incansablemente una forma de acabar con ellos todos a la vez, tratando de encontrar una manera de detener esta locura. ¿Seguramente puedes entender mi situación?");
        } else if (status == 3) {
            qm.sendNext("Mi gratitud por entender mi punto. Debes haber conocido a Parwen, ya que sabes dónde estoy. Hazle consciente de la situación actual.");
        } else if (status == 4) {
            qm.sendNext("Ah, y tengo que pedirte un favor personal, si no es demasiado. Estoy preocupado por mi esposa#b#p2111004##k. Desde el incidente con los huroides pude enviarle un mensaje, eso debe haberle pasado factura... Por favor, si pudiera, ¿podría conseguirme?#bColgante de Plata#kme fui#bde vuelta en casa#k¿Y dárselo a ella en mi lugar? Lamento no haberle dado el artículo de inmediato, era su cumpleaños... Tal vez dárselo ahora pueda darle una buena noche de sueño, al menos.");
        } else if (status == 5) {
            qm.sendNext("#r¡Asegúrate de recordar este patrón!#kHe escondido el colgante en mi casa, en un contenedor.#bdetrás de las tuberías de agua#k. Los tubos deben girarse#ben orden#k: arriba, abajo, medio. Y luego, ingrese la contraseña secreta: '#rmi amor phylia#k'.");
            qm.forceStartQuest();
        } else if (status == 6) {
            qm.dispose();
        }
    }
}