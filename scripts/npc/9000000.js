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
/*      Author:                 Xterminator, Moogra
	NPC Name: 		Paul
	Map(s): 		Maple Road: Southperry (60000)
	Description: 	        Event Assistant
*/
var status = 0;

function start() {
    cm.sendNext("Oye, soy #bPaul#k, si no estás ocupado y todo... entonces ¿puedo salir contigo? Escuché que hay gente reunida por aquí para un #revent#k pero no quiero ir solo... Bueno, ¿quieres ir a verlo conmigo?");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            cm.sendSimple("¿Eh? ¿Qué tipo de evento? Bueno, eso es...\r\n#L0##e1.#n#b¿Qué tipo de evento es?#k#l\r\n#L1##e2.#n#bExplícame el juego del evento.#k#l\r\n#L2##e3.#n#b¡Muy bien, vámonos!#k#l");
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendNext("¡Todo este mes, MapleStory Global celebra su tercer aniversario! Los GM llevarán a cabo eventos sorpresa para GM durante todo el evento, ¡así que mantente alerta y asegúrate de participar en al menos uno de los eventos para obtener grandes premios!");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendSimple("Hay muchos juegos para este evento. Te ayudará mucho saber cómo jugar antes de jugarlo. ¡Elige el que quieras saber más!#b\r\n#L0#vivir la vida#l\r\n#L1#Prueba de aptitud física MapleStory Maple#l\r\n#L2#bola de nieve#l\r\n#L3#Cosecha de coco#l\r\n#L4#Prueba de buey#l\r\n#L5#Búsqueda del tesoro#l#k");
            } else if (selection == 2) {
                cm.sendNext("O el evento no se ha iniciado, ya tienes el#bPergamino de los secretos#k, o ya has participado en este evento en las últimas 24 horas. ¡Inténtelo de nuevo más tarde!");
                cm.dispose();
            }
        } else if (status == 3) {
            if (selection == 0) {
                cm.sendNext("#b[Vive la vida]#kEs un juego donde los participantes suben escaleras para llegar a la cima. Sube y pasa al siguiente nivel eligiendo el portal correcto entre los numerosos portales disponibles.\r\n\r\nEl juego consta de tres niveles y el límite de tiempo es#b6 MINUTOS#k. Durante [Ola Ola], tú#bNo podrás saltar, teletransportarte, acelerar ni aumentar tu velocidad usando pociones u objetos.#k. También hay portales de trucos que te llevarán a un lugar extraño, así que ten cuidado con ellos.");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("#b[Prueba de aptitud física de MapleStory] es una carrera a través de una carrera de obstáculos#kmuy parecido al Bosque de la Paciencia. Puedes ganarlo superando varios obstáculos y llegar al destino final dentro del límite de tiempo.\r\n\r\nEl juego consta de cuatro niveles y el límite de tiempo es#b15 MINUTOS#k. Durante la [Prueba de aptitud física de MapleStory], no podrás usar el teletransporte ni la prisa.");
                cm.dispose();
            } else if (selection == 2) {
                cm.sendNext("#b[Bola de nieve]#kconsta de dos equipos, Maple Team y Story Team, y los dos equipos se enfrentan para ver#b¿Qué equipo hizo rodar la bola de nieve más lejos y más grande en un tiempo limitado?#k. Si el juego no se puede decidir dentro del período de tiempo, entonces gana el equipo que hizo rodar la bola de nieve más lejos.\r\n\r\nPara enrollar la nieve, atácala presionando#bCtrl#k. Todos los ataques de largo alcance y los ataques basados ​​en habilidades no funcionarán aquí.#bSólo los ataques de corto alcance funcionarán.#k. \r\n\r\nSi un personaje toca la bola de nieve, será enviado de regreso al punto de partida. Ataca al muñeco de nieve frente al punto de partida para evitar que el equipo contrario haga rodar la nieve hacia adelante. Aquí es donde funciona una estrategia bien planificada, ya que el equipo decidirá si atacar a la bola de nieve o al muñeco de nieve.");
                cm.dispose();
            } else if (selection == 3) {
                cm.sendNext("#b[Cosecha de coco]#kconsta de dos equipos, Maple Team y Story Team, y los dos equipos se enfrentan para ver#b¿Qué equipo recoge más cocos?#k. El límite de tiempo es#b5 MINUTOS#k. Si el juego termina en empate, se concederán 2 minutos adicionales para determinar el ganador. Si por alguna razón el marcador sigue empatado, el juego terminará en empate.\r\n\r\nTodos los ataques de largo alcance y los ataques basados ​​en habilidades no funcionarán aquí.#bSólo los ataques de corto alcance funcionarán.#k. Si no tienes un arma para los ataques a corta distancia, puedes comprarla a través de un NPC dentro del mapa del evento. No importa el nivel del personaje, el arma o las habilidades, todos los daños aplicados serán los mismos.\r\n\r\nCuidado con los obstáculos y trampas dentro del mapa. Si el personaje muere durante el juego, será eliminado del juego. Gana el jugador que golpee el último antes de que caiga el coco. Sólo cuentan los cocos que golpean el suelo, lo que significa que los que no se caen del árbol, o la explosión ocasional de los cocos NO CONTARÁ. También hay un portal oculto en uno de los caparazones en la parte inferior del mapa, ¡así que úsalo sabiamente!");
                cm.dispose();
            } else if (selection == 4) {
                cm.sendNext("#b[Prueba de BUEY]#kes un juego de inteligencia de MapleStory a través de X y O. Una vez que te unas al juego, enciende el minimapa presionando#bM#k para ver dónde están la X y la O. Un total de#r10 preguntas#kSe darán, y el personaje que las responda todas correctamente gana el juego.\r\n\r\nUna vez dada la pregunta, usa la escalera para ingresar al área donde puede estar la respuesta correcta, ya sea X u O. Si el personaje no elige una respuesta o queda colgado de la escalera más allá del límite de tiempo, el personaje será eliminado. Mantenga su posición hasta que [CORRECTO] desaparezca de la pantalla antes de continuar. Para evitar trampas de cualquier tipo, todos los tipos de chat se desactivarán durante el OX Quiz.");
                cm.dispose();
            } else if (selection == 5) {
                cm.sendNext("#b[Búsqueda del tesoro]#kes un juego en el que tu objetivo es encontrar el#brollos del tesoro#kque están escondidos por todo el mapa#ren 10 minutos#k. Habrá una serie de cofres del tesoro misteriosos escondidos y, una vez que los rompas, muchos elementos emergerán del cofre. Tu trabajo es seleccionar el pergamino del tesoro entre esos elementos.\r\nLos cofres del tesoro se pueden destruir usando#bataques regulares#k, y una vez que tengas el pergamino del tesoro en posesión, puedes cambiarlo por el Pergamino de los Secretos a través de un NPC que está a cargo del intercambio de artículos. El NPC comercial se puede encontrar en el mapa de Treasure Hunt, pero también puedes intercambiar tu pergamino.#bVikin#k de Lith Harbor.\r\n\r\nEste juego tiene su parte de portales ocultos y puntos de teletransportación ocultos. Para usarlos, presione el#bflecha arriba#ken un lugar determinado y serás teletransportado a un lugar diferente. Intenta saltar, ya que también puedes toparte con escaleras o cuerdas ocultas. También habrá un cofre del tesoro que te llevará a un lugar escondido y un cofre oculto que solo se puede encontrar a través del portal oculto, así que intenta mirar a tu alrededor.\r\n\r\nDurante el juego de Treasure Hunt, todas las habilidades de ataque serán#rdisabled#k, así que rompe el cofre del tesoro con el ataque normal.");
                cm.dispose();
            }
        }
    }
}