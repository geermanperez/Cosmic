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
/* Icebyrd Slimm
	Masteria: New Leaf City (600000000)
	Handles the quiz quest. (4900)
 */

var minlevel = 10;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0 && mode == 1) {
            if (cm.isQuestCompleted(4911)) {
                cm.sendNext("¡Buen trabajo! Has resuelto todas mis preguntas sobre NLC. ¡Disfruta tu viaje!");
                cm.dispose();
            } else if (cm.isQuestCompleted(4900) || cm.isQuestStarted(4900)) {  // thanks imbee for pointing out the quiz leak
                cm.sendNext("¡Oye, presta atención, estoy intentando interrogarte sobre otra pregunta, familia!");
                cm.dispose();
            } else {
                var selStr = "What up! Name's Icebyrd Slimm, mayor of New Leaf City! Happy to see you accepted my invite. So, what can I do for you?#b"
                var info = ["What is this place?", "Who is Professor Foxwit?", "What's a Foxwit Door?", "Where are the MesoGears?", "What is the Krakian Jungle?", "What's a Gear Portal?", "What do the street signs mean?", "What's the deal with Jack Masque?", "Lita Lawless looks like a tough cookie, what's her story?", "When will new boroughs open up in the city?", "I want to take the quiz!"];
                for (var i = 0; i < info.length; i++) {
                    selStr += "\r\n#L" + i + "# " + info[i] + "#l";
                }
                cm.sendSimple(selStr);
            }
        } else if (status == 1) {
            switch (selection) {
                case 0:
                    cm.sendNext("Siempre he soñado con construir una ciudad. No una ciudad cualquiera, sino una donde todos fueran bienvenidos. Solía ​​vivir en Kerning City, así que decidí ver si podía crear una ciudad. A medida que avanzaba en la búsqueda de los medios para hacerlo, me encontré con muchas personas, algunas de las cuales he llegado a considerar como amigos. Como el profesor Foxwit: es nuestro genio residente; lo salvó de un grupo de plantas devoradoras de hombres. Jack Masque es un viejo compañero de caza de Amoria, un conversador casi demasiado suave para su propio bien. Lita y yo somos viejos amigos de Kerning City; ella me salvó varias veces con esa arma suya; Así que pensé que era la elección perfecta para Sheriff de la ciudad. Fue necesario un poco de persuasión, pero llegó a creer que su destino está aquí. Acerca de nuestro explorador residente, Barricade vino buscando algo; accedió a llevar todo lo que encontrara al museo. Había oído historias sobre él y su hermano cuando todavía estaba en Kerning City. Y Elpam... bueno, digamos que no es de por aquí. En absoluto. Hemos hablado antes y parece tener buenas intenciones, así que le permití quedarse. ¡Me acabo de dar cuenta de que he divagado bastante! ¿Qué más te gustaría saber?");
                    status -= 2;
                    break;
                case 1:
                    cm.sendNext("Un tipo bastante vivaz para tener 97 años. Es un viajero en el tiempo con el que me encontré un día fuera de la ciudad. El viejo tuvo algunos problemas con algunas criaturas de la jungla, como si intentaran comérselo. A cambio de que lo salvara, accedió a construir un museo del tiempo. Tengo la sensación de que ha venido aquí por otra razón, ya que ha mencionado más de una vez que New Leaf City tiene un papel interesante que desempeñar en el futuro. Quizás puedas descubrir un poco más...");
                    status -= 2;
                    break;
                case 2:
                    cm.sendNext("Je, pregunté lo mismo cuando vi al profesor construyéndolos. Son puntos de deformación. Al presionar Arriba lo trasladará a otra ubicación. Recomiendo cogerles el truco, son nuestro sistema de transporte.");
                    status -= 2;
                    break;
                case 3:
                    cm.sendNext("Los MesoGears están debajo del Bigger Ben. Es una sección del Bigger Ben infestada de monstruos que descubrió Barricade. Parece residir en una sección separada de la torre, algo bastante extraño si me preguntas. He oído que necesita un poco de ayuda para explorarlo, deberías verlo. Pero ten cuidado, las arañas lobo que hay allí no son una broma.");
                    status -= 2;
                    break;
                case 4:
                    cm.sendNext("Ah... bueno. La Krakian Jungle está ubicada en las afueras de New Leaf City. Muchas criaturas nuevas y poderosas deambulan por esas áreas, por lo que será mejor que estés preparado para luchar si te diriges allí. Está en el extremo derecho de la ciudad. Abundan los rumores de que la Selva conduce a una ciudad perdida, pero aún no hemos encontrado nada.");
                    status -= 2;
                    break;
                case 5:
                    cm.sendNext("Bueno, cuando John se encontró en la parte de MesoGears del Bigger Ben, se paró en uno y se dirigió a otro lugar. Sin embargo, sólo podía ir y venir; no circulan como la Puerta Foxwit. Tecnología antigua para ti.");
                    status -= 2;
                    break;
                case 6:
                    cm.sendNext("Bueno, los verás en casi todas partes. Son áreas en construcción. Las luces rojas significan que no está terminado, pero las luces verdes significan que está abierto. Vuelve a consultar con frecuencia, ¡siempre estamos construyendo!");
                    status -= 2;
                    break;
                case 7:
                    cm.sendNext("Ah, Jack. ¿Conoces a esos chicos que son demasiado geniales para la escuela? ¿Los que siempre parecen salirse con la suya? ¿Y la chica? Bueno, ese es Jack, pero sin la chica. Él cree que desperdició su oportunidad y comenzó a usar esa máscara para ocultar su verdadera identidad. Mis labios están sellados sobre quién es él, pero es de Amoria. Quizás te cuente un poco más si le preguntas.");
                    status -= 2;
                    break;
                case 8:
                    cm.sendNext("Conozco a Lita desde hace tiempo, aunque recientemente hemos reavivado nuestra amistad. No la vi por bastante tiempo, pero entiendo por qué. Se entrenó durante muchísimo tiempo como ladrona. De hecho, ¡así fue como nos conocimos! Fui asediado por un grupo de hongos descarriados y ella saltó para ayudar. Cuando llegó el momento de elegir un sheriff, fue una obviedad. Ella ha prometido ayudar a otros en su entrenamiento y proteger la ciudad, así que si estás interesado en un poco de deber cívico, habla con ella.");
                    status -= 2;
                    break;
                case 9:
                    cm.sendNext("Pronto, amigo mío. Aunque no puedas verlos, los promotores de la ciudad están trabajando duro. Cuando estén listos, los abriremos. ¡Sé que lo estás esperando y yo también!");
                    status -= 2;
                    break;
                case 10:
                    if (cm.getLevel() >= minlevel) {
                        cm.sendNext("Ningún problema. ¡Te daré algo lindo si las respondes correctamente!");
                        cm.startQuest(4900);
                    } else {
                        cm.sendNext("¿Estamos ansiosos? ¿Qué tal si exploras un poco más antes de que te deje realizar el cuestionario?");
                    }

                    cm.dispose();
                    break;
            }
        }
    }
}