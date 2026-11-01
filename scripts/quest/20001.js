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
	NPC Name: 		Neinheart
	Map(s): 		Ereve: Empress' Road
	Description: 		Quest - Neinheart the Tactician
	Quest ID: 		20001
*/

var status = -1;

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
            qm.sendNext("Hola,#h#. Les doy formalmente la bienvenida a los Caballeros Cygnus. Mi nombre es Neinheart Von Rubistein, el estratega jefe de la joven emperatriz. Te veré a menudo de ahora en adelante, así que te sugiero que recuerdes mi nombre. Ja ja...");
        } else if (status == 1) {
            qm.sendNextPrev("Entiendo que no tuviste suficiente tiempo y exposición para descubrir lo que realmente necesitas hacer como Cygnus Knight. Te lo explicaré en detalle, uno por uno. Te explicaré dónde estás, quién es la joven Emperatriz y cuáles son nuestros deberes...");
        } else if (status == 2) {
            qm.sendNextPrev("Estás parado en una isla llamada Ereve, la única tierra gobernada por la joven emperatriz que también flota en el aire. Sí, estamos flotando en el aire mientras hablamos. Nos quedamos aquí por necesidad, pero normalmente funciona como un barco que flota por todo Maple World, por el bien de la joven Emperatriz...");
        } else if (status == 3) {
            qm.sendNextPrev("La joven Emperatriz es de hecho la gobernante de Maple World, la única gobernante de este mundo. ¿Qué? ¿Nunca has oído hablar de algo así? Ahhh, eso es comprensible. La joven emperatriz puede gobernar este mundo, pero no es una dictadora que se cierne sobre todos. Utiliza Ereve como una forma de supervisar el mundo como observadora sin tener que ser demasiado práctica. Al menos así suele ser...");
        } else if (status == 4) {
            qm.sendNextPrev("Pero de vez en cuando surgen situaciones en las que tendrá que tomar el control. El malvado Black Mage ha estado mostrando signos de resurrección en todo el mundo. El mismo rey de la destrucción que amenazó con destruir el mundo tal como lo conocemos está tratando de reaparecer en nuestras vidas.");
        } else if (status == 5) {
            qm.sendNextPrev("El problema es que nadie se da cuenta. Ha pasado tanto tiempo desde que el Mago Negro desapareció, que la gente se ha acostumbrado a la paz en el mundo, sin saber necesariamente qué hacer si llega una crisis como esta. Si esto sigue así, nuestro mundo estará en grave peligro en poco tiempo.");
        } else if (status == 6) {
            qm.sendNextPrev("Fue entonces cuando la joven emperatriz decidió dar un paso adelante y tomar el control de esta crisis potencial antes de que se revelara. Ella decidió crear un grupo de Caballeros que evitarán que el Mago Negro resucite por completo. Estoy seguro de que sabes lo que sucede después, ya que tú mismo te ofreciste como voluntario para convertirte en Caballero.");
        } else if (status == 7) {
            qm.sendNextPrev("Nuestros deberes son simples. Necesitamos hacernos más poderosos; mucho más poderoso que el estado en el que nos encontramos ahora, de modo que cuando el Mago Negro regrese, lucharemos contra él y lo eliminaremos de una vez por todas antes de que ponga al mundo entero en grave peligro. Ese es nuestro objetivo, nuestra misión y por tanto la vuestra también.");
        } else if (status == 8) {
            qm.sendAcceptDecline("Esta es la descripción básica de esta situación. ¿Comprendido?");
        } else if (status == 9) {
            if (qm.isQuestCompleted(20001)) {
                qm.gainExp(40);
                qm.gainItem(1052177, 1); // fancy noblesse robe
            }
            qm.forceStartQuest();
            qm.forceCompleteQuest();
            qm.sendNext("Me alegro que entiendas lo que te he dicho pero... ¿lo sabías? Según tu nivel actual, no podrás enfrentarte al Mago Negro. ¡Diablos, no podrás enfrentarte al muñeco de la mascota del monstruo esclavo de su discípulo! ¿Estás seguro de que estás listo para proteger Maple World de esa manera?");
        } else if (status == 10) {
            qm.sendNextPrev("Puede que seas miembro de los Cygnus Knights, pero eso no significa que seas un caballero. Olvídate de ser el caballero oficial. Ni siquiera eres un Caballero en Entrenamiento todavía. Pasará mucho tiempo en el que te quedarás sentado aquí, haciendo trámites para los Caballeros Cygnus, pero...");
        } else if (status == 11) {
            qm.sendNextPrev("Pero, de todos modos, nadie nace fuerte. La Emperatriz también prefiere crear un entorno donde se pueda formar y crear una serie de caballeros poderosos, en lugar de encontrar un caballero con un don sobrenatural. Por ahora, tendrás que convertirte en un Caballero en entrenamiento y hacerte mucho más poderoso para que puedas ser útil más adelante. Hablaremos sobre los deberes de ser un Cygnus Knight una vez que alcances ese nivel de competencia.");
        } else if (status == 12) {
            qm.sendPrev("Toma el portal del lado izquierdo, sigue recto y te dirigirás hacia#bBosque de entrenamiento I # . Allí encontrarás al instructor de entrenamiento de los Caballeros, Kiku. La próxima vez que te vea, me gustaría que estuvieras al menos en el nivel 10.");
        }
    }
}