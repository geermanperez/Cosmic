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
	NPC Name: 		Robin
	Map(s): 		Maple Road : Snail Hunting Ground I (40000)
	Description: 		Beginner Helper
*/
var status;
var sel;

function start() {
    status = -1;
    sel = -1;
    cm.sendSimple("Ahora... ¡¡pregúntame cualquier duda que tengas sobre viajes!!\r\n#L0##b¿Cómo me muevo?#l\r\n#L1#¿Cómo puedo derrotar a los monstruos?#l\r\n#L2#¿Cómo puedo recoger un artículo?#l\r\n#L3#¿Qué pasa cuando muero?#l\r\n#L4#¿Cuándo puedo elegir un trabajo?#l\r\n#L5#¡Cuéntame más sobre esta isla!#l\r\n#L6#¿Qué debo hacer para convertirme en guerrero?#l\r\n#L7#¿Qué debo hacer para convertirme en Bowman?#l\r\n#L8#¿Qué debo hacer para convertirme en Mago?#l\r\n#L9#¿Qué debo hacer para convertirme en ladrón?#l\r\n#L10#¿Cómo subo las estadísticas del personaje? (S)#l\r\n#L11#¿Cómo reviso los artículos que acabo de recoger?#l\r\n#L12#¿Cómo me pongo un artículo?#l\r\n#L13#¿Cómo reviso las prendas que llevo puesta?#l\r\n#L14#¿Qué son las habilidades? (K)#l\r\n#L15#¿Cómo llego a la Isla Victoria?#l\r\n#L16#¿Qué son los mesos?#l#k");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (mode == 0 && type != 4) {
            status -= 2;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        if (sel == -1) {
            sel = selection;
        }
        if (sel == 0) {
            cm.sendNext("Muy bien, así es como te mueves. Usar#bflecha izquierda, derecha#kpara moverse por las llanuras y los caminos inclinados, y presione#bAlt#k saltar. Un número selecto de zapatos mejora tu velocidad y tus habilidades de salto.");
        } else if (sel == 1) {
            cm.sendNext("Aquí se explica cómo acabar con un monstruo. Cada monstruo posee su propio HP y los derrotarás atacando con un arma o mediante hechizos. Por supuesto, cuanto más fuertes sean, más difícil será derrotarlos.");
        } else if (sel == 2) {
            cm.sendNext("Así es como recoges un objeto. Una vez que derribes a un monstruo, se dejará caer un objeto al suelo. Cuando eso suceda, párate frente al objeto y presiona#bZ#k o#b0 en el teclado numérico#kpara adquirir el artículo.");
        } else if (sel == 3) {
            cm.sendNext("¿Tienes curiosidad por saber qué sucede cuando mueres? Te convertirás en un fantasma cuando tu HP llegue a 0. Habrá una lápida en ese lugar y no podrás moverte, aunque sí podrás chatear.");
        } else if (sel == 4) {
            cm.sendNext("¿Cuándo puedes elegir tu trabajo? Jajaja, tómatelo con calma, amigo. Cada trabajo tiene un conjunto de requisitos que usted debe cumplir. Normalmente, un nivel entre 8 y 10 será suficiente, así que trabaja duro.");
        } else if (sel == 5) {
            cm.sendNext("¿Quieres saber sobre esta isla? Se llama Maple Island y flota en el aire. Ha estado flotando en el cielo por un tiempo, por lo que los desagradables monstruos no están realmente por ahí. Es una isla muy tranquila, ¡perfecta para principiantes!");
        } else if (sel == 6) {
            cm.sendNext("Quieres convertirte en un#bWarrior#k? Hmmm, entonces te sugiero que te dirijas a la Isla Victoria. Dirígete a una ciudad guerrera llamada#rPerion#k y ver#bBaila con Balrog#k. Él te enseñará todo sobre cómo convertirte en un verdadero guerrero. Ah, y una cosa MUY importante: ¡¡necesitarás tener al menos el nivel 10 para convertirte en un guerrero!!");
        } else if (sel == 7) {
            cm.sendNext("Quieres convertirte en un#bBowman#k? Tendrás que ir a la isla Victoria para avanzar en el trabajo. Dirígete a un pueblo de arqueros llamado#rHenesys#k y hablar con la bella#batenea pierce#ky aprende los pros y los contras de ser un arquero. Ah, y una cosa MUY importante: ¡¡necesitarás tener al menos el nivel 10 para convertirte en arquero!!");
        } else if (sel == 8) {
            cm.sendNext("Quieres convertirte en un#bMagician#k? Para hacer eso, tendrás que dirigirte a la Isla Victoria. Dirígete a un pueblo mágico llamado#rEllinia#k, y en la parte superior se encuentra la Biblioteca Mágica. En el interior, encontrarás al jefe de todos los magos,#bGrendel el realmente viejo#k, quien te enseñará todo sobre cómo convertirte en mago.");
        } else if (sel == 9) {
            cm.sendNext("Quieres convertirte en un#bThief#k? Para convertirte en uno, tendrás que dirigirte a la Isla Victoria. Dirígete a una ciudad de ladrones llamada#rCiudad de Kerning#k, y en el lado más sombrío de la ciudad, verás el escondite de un ladrón. Allí te encontrarás#bseñor oscuro#kquien te enseñará todo sobre ser un ladrón. Ah, y una cosa MUY importante: ¡¡necesitarás tener al menos el nivel 10 para convertirte en un ladrón!!");
        } else if (sel == 10) {
            cm.sendNext("¿Quieres saber cómo aumentar las estadísticas de habilidad de tu personaje? Primero presione #bS#k para ver la ventana de habilidades. Cada vez que subas de nivel, recibirás 5 puntos de habilidad, también conocidos como AP. Asigna esos AP a la habilidad que elijas. Es así de simple.");
        } else if (sel == 11) {
            cm.sendNext("Quieres saber cómo comprobar los artículos que has recogido, ¿eh? Cuando derrotas a un monstruo, dejará caer un objeto al suelo y podrás presionar #bZ#k para recogerlo. Ese artículo se almacenará en su inventario de artículos y podrá verlo simplemente presionando #bI#k.");
        } else if (sel == 12) {
            cm.sendNext("Quieres saber cómo usar las prendas, ¿verdad? Presione #bI#k para revisar su inventario de artículos. Coloque el cursor del mouse encima de un elemento y haga doble clic en él para colocarlo en su personaje. Si no puedes usar el artículo, es probable que tu personaje no cumpla con los requisitos de nivel y estadísticas. También puedes ponerte el artículo abriendo el inventario de equipo (#bE#k) y arrastrándolo hacia él. Para quitar un artículo, haga doble clic en el artículo en el inventario de equipos.");
        } else if (sel == 13) {
            cm.sendNext("Quieres comprobar los elementos equipados, ¿verdad? Presione #bE#k para abrir el inventario de equipos, donde verá exactamente lo que está usando en este momento. Para quitar un artículo, haga doble clic en el artículo. Luego, el artículo se enviará al inventario de artículos.");
        } else if (sel == 14) {
            cm.sendNext("Las \"habilidades\" especiales que se adquieren después de adquirir un trabajo se denominan habilidades. Adquirirás habilidades específicas para ese trabajo. Aún no estás en esa etapa, por lo que aún no tienes ninguna habilidad, pero recuerda que para verificar tus habilidades, presiona #bK#k para abrir el libro de habilidades. Te ayudará en el futuro.");
        } else if (sel == 15) {
            cm.sendNext("¿Cómo se llega a la Isla Victoria? Al este de esta isla hay un puerto llamado Southperry. Allí encontrarás un barco que vuela en el aire. Delante del barco se encuentra el capitán. Pregúntale al respecto.");
        } else if (sel == 16) {
            cm.sendNext("Es la moneda utilizada en MapleStory. Puedes comprar artículos a través de mesos. Para ganarlos, puedes derrotar a los monstruos, vender artículos en la tienda o completar misiones...");
        }
    } else if (status == 1) {
        if (sel == 0) {
            cm.sendNextPrev("Para poder atacar a los monstruos, necesitarás estar equipado con un arma. Cuando esté equipado, presione #bCtrl#k para usar el arma. Si lo haces en el momento adecuado, podrás acabar con los monstruos fácilmente.");
        } else if (sel == 1) {
            cm.sendNextPrev("Una vez que avance en el trabajo, adquirirá diferentes tipos de habilidades y podrá asignarlas a teclas de acceso rápido para un acceso más fácil. Si se trata de una habilidad de ataque, no necesitas presionar Ctrl para atacar, simplemente presiona el botón asignado como tecla de acceso rápido.");
        } else if (sel == 2) {
            cm.sendNextPrev("Sin embargo, recuerda que si tu inventario de artículos está lleno, no podrás adquirir más. Entonces, si tienes un artículo que no necesitas, véndelo para poder hacer algo con él. El inventario puede expandirse una vez que usted avance en el trabajo.");
        } else if (sel == 3) {
            cm.sendNextPrev("No hay mucho que perder cuando mueras si eres sólo un principiante. Sin embargo, una vez que tienes un trabajo, la historia es diferente. Perderás una parte de tu EXP cuando mueras, así que asegúrate de evitar el peligro y la muerte a toda costa.");
        } else if (sel == 4) {
            cm.sendNextPrev("Sin embargo, el nivel no es lo único que determina el avance. También necesitas aumentar los niveles de una habilidad particular según la ocupación. Por ejemplo, para ser un guerrero, tu FUE tiene que ser superior a 35, y así sucesivamente, ¿sabes a qué me refiero? Asegúrese de mejorar las habilidades que tengan implicaciones directas para su trabajo.");
        } else if (sel == 5) {
            cm.sendNextPrev("Pero, si quieres ser un jugador poderoso, mejor no pienses en quedarte aquí por mucho tiempo. De todos modos no podrás conseguir un trabajo. Debajo de esta isla se encuentra una enorme isla llamada Isla Victoria. Ese lugar es mucho más grande que aquí, ni siquiera tiene gracia.");
        } else if (sel == 8) {
            cm.sendNextPrev("Ah, por cierto, a diferencia de otros trabajos, para convertirte en mago solo necesitas estar en el nivel 8. Lo que implica avanzar temprano en el trabajo también viene con el hecho de que se necesita mucho para convertirse en un verdadero mago poderoso. Piensa detenidamente antes de elegir tu camino.");
        } else if (sel == 10) {
            cm.sendNextPrev("Coloque el cursor del mouse encima de todas las habilidades para obtener una breve explicación. Por ejemplo, STR para guerreros, DEX para arquero, INT para mago y LUK para ladrón. Eso en sí no es todo lo que necesitas saber, por lo que tendrás que pensar detenidamente cómo enfatizar las fortalezas de tu personaje mediante la asignación de puntos.");
        } else if (sel == 15) {
            cm.sendNextPrev("¡Oh sí! Un último dato antes de irme. Si no está seguro de dónde se encuentra, presione siempre #bW#k. Aparecerá el mapa mundial con el localizador que muestra dónde se encuentra. No tendrás que preocuparte por perderte con eso.");
        } else {
            start();
        }
    } else {
        start();
    }
}