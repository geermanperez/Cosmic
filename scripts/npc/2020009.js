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

status = -1;
var job;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 2;
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("Hola.");
        cm.dispose();
        return;
    }
    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }
    cm.sendSimple("¿Algo que quieras de mí?#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#I quiero realizar el tercer avance laboral." : "") + "\r\n#L1#Por favor, permítanme hacer Zakum Dungeon Quest.");
}

function action(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    } else if (mode != 1 || (status > 2 && !actionx["Mental"]) || status > 3) {
        if (mode == 0 && type == 1) {
            cm.sendNext("Decídete.");
        }
        cm.dispose();
        return;
    }
    if (actionx["Mental"]) {
        if (status == 0) {
            cm.sendNext("Gran trabajo completando la parte mental del examen. Sabiamente has respondido correctamente a todas las preguntas. Debo decir que estoy bastante impresionado con el nivel de sabiduría que ha demostrado allí. Por favor, pásame el collar primero antes de dar el siguiente paso.");
        } else if (status == 1) {
            cm.sendYesNo("¡Bueno! Ahora, gracias a mí, te transformarás en un aventurero mucho más poderoso. Sin embargo, antes de hacer eso, asegúrese de haber utilizado completamente su SP. Necesitará usar al menos todos los SP obtenidos hasta el nivel 70 para avanzar al tercer trabajo. Ah, y dado que ya has elegido tu camino de ocupación para el segundo puesto de trabajo, no tendrás que volver a elegir para el tercer puesto de trabajo. ¿Quieres hacerlo ahora mismo?");
        } else if (status == 2) {
            if (cm.getPlayer().getRemainingSp() > 0) {
                if (cm.getPlayer().getRemainingSp() > (cm.getLevel() - 70) * 3) {
                    cm.sendNext("Por favor, utiliza todos tus SP antes de continuar.");
                    cm.dispose();
                    return;
                }
            }
            if (cm.getJobId() % 10 == 0) {
                cm.gainItem(4031058, -1);
                cm.changeJobById(cm.getJobId() + 1);
                cm.getPlayer().removePartyQuestItem("JBQ");
            }

            if (Math.floor(cm.getJobId() / 10) == 21) {
                cm.sendNext("tu eres el#bMago de fuego y veneno#kde aquí en adelante. El nuevo libro de habilidades presenta hechizos nuevos y mejorados basados ​​en fuego y veneno, y habilidades como#bAmplificación de elementos#k(hechizos mejorados basados ​​en elementos) y#bRefuerzo de hechizos#k(mejora la velocidad general de tus hechizos de ataque) te permitirá atacar a los monstruos de forma rápida y eficaz. Hechizos defensivos como#bResistencia parcial#k(te permite volverte más fuerte contra ciertos ataques basados ​​en elementos) y#bSeal#k (sella al monstruo) ayudará a anular la única debilidad que poseen los magos: la falta de HP.");
            } else if (Math.floor(cm.getJobId() / 10) == 22) {
                cm.sendNext("tu eres el#bMago de hielo y relámpagos#kde aquí en adelante. El nuevo libro de habilidades presenta hechizos nuevos y mejorados basados ​​en hielo y relámpagos, y habilidades como#bAmplificación de elementos#k(hechizos mejorados basados ​​en elementos) y#bRefuerzo de hechizos#k(mejora la velocidad general de tus hechizos de ataque) te permitirá atacar a los monstruos de forma rápida y efectiva. Hechizos defensivos como#bResistencia parcial#k(te permite volverte más fuerte contra ciertos ataques basados ​​en elementos) y#bSeal#k (sella al monstruo) ayudará a anular la única debilidad que poseen los magos: la falta de HP.");
            } else {
                cm.sendNext("Estás#bPriest#k de aquí en adelante. El nuevo libro de habilidades presenta hechizos sagrados nuevos y mejorados, como#bRayo brillante#ky#bInvocar Dragón#ky habilidades como#bPuerta mística#k(crea una puerta para la salida al pueblo más cercano) y#bSímbolo Santo#k(mejora la EXP obtenida) puede ser vital para el juego en grupo. Hechizos fuera de lo común como#bDoom#k (convertir monstruos en caracoles) separa a los Sacerdotes de otros trabajos como el más diferente de todos.");
            }
        } else if (status == 3) {
            cm.sendNextPrev("También te he proporcionado algunos SP y AP, que te ayudarán a empezar. Ahora te has convertido en un guerrero poderoso, muy poderoso. Sin embargo, recuerda que el mundo real estará esperando tu llegada con obstáculos aún más difíciles que superar. Una vez que sientas que no puedes entrenarte para alcanzar un lugar más alto, entonces, y sólo entonces, ven a verme. Estaré aquí esperando.");
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("Gran trabajo completando la parte física de la prueba. Sabía que podías hacerlo. Ahora que has pasado la primera mitad del examen, aquí tienes la segunda mitad. Por favor, dame el collar primero.");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("Aquí tenéis la segunda mitad de la prueba. Esta prueba determinará si eres lo suficientemente inteligente como para dar el siguiente paso hacia la grandeza. Hay un área oscura y cubierta de nieve llamada Tierra Santa en el campo nevado de Ossyria, donde ni siquiera los monstruos pueden llegar. En el centro del área se encuentra una enorme piedra llamada Piedra Sagrada. Tendrás que ofrecer un objeto especial como sacrificio, luego la Piedra Sagrada pondrá a prueba tu sabiduría allí mismo.");
        } else if (status == 2) {
            cm.sendNextPrev("Deberá responder todas y cada una de las preguntas que le hagan con honestidad y convicción. Si respondes correctamente a todas las preguntas, entonces la Piedra Sagrada te aceptará formalmente y te entregará#b#t4031058##k. Devuélveme el collar y te ayudaré a dar el siguiente paso. Buena suerte.");
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("Ve, habla con#b#p1032001##ky tráeme#b#t4031057##k.");
        cm.dispose();
    } else if (cm.getPlayer().gotPartyQuestItem("JBQ") && selection == 0) {
        cm.sendNext("Ve, habla con#b#p2030006##ky tráeme#b#t4031058##k.");
        cm.dispose();
    } else {
        if (sel == undefined) {
            sel = selection;
        }
        if (sel == 0) {
            if (cm.getPlayer().getLevel() >= 70 && cm.getJobId() % 10 == 0) {
                if (status == 0) {
                    cm.sendYesNo("Bienvenido. Soy#b#p2020009##k, el jefe de todos los magos, listo para compartir mi conocimiento de la calle y mi dura vida con aquellos que estén dispuestos a escuchar. Pareces estar listo para dar el salto adelante, el que está listo para asumir los desafíos del tercer ascenso laboral. Demasiados magos han ido y venido, incapaces de cumplir con los estándares para lograr el tercer avance laboral. ¿Qué pasa contigo? ¿Estás listo para hacerte la prueba y lograr el tercer avance laboral?");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("Bien. Se te pondrá a prueba en dos aspectos importantes de un mago: fuerza y ​​sabiduría. Ahora te explicaré la mitad física de la prueba. Recordar#b#p1032001##k¿De Ellinia? Ve a verlo y te dará los detalles de la primera mitad de la prueba. Por favor completa la misión y obtén#b#t4031057##kde#p1032001#.");
                } else if (status == 2) {
                    cm.sendNextPrev("La mitad mental de la prueba sólo puede comenzar después de pasar la parte física de la prueba.#b#t4031057##kserá la prueba de que efectivamente has pasado la prueba. dejaré#b#p1032001##kcon anticipación que vas a llegar allí, así que prepárate. No será fácil, pero tengo la máxima fe en ti. Buena suerte.");
                }
            }
        } else {
            if (cm.getPlayer().getLevel() >= 50) {
                cm.sendOk("El Consejo de Residencia del Jefe te concede#bconcession#k hacer parte del#requipo de contraofensiva contra Zakum#k. Buena suerte en el viaje que tienes por delante.");
                if (!(cm.isQuestStarted(100200) || cm.isQuestCompleted(100200))) {
                    cm.startQuest(100200);
                }
                const YamlConfig = Java.type('config.YamlConfig');
                if (YamlConfig.config.server.USE_ENABLE_SOLO_EXPEDITIONS && !cm.isQuestCompleted(100201)) {
                    cm.completeQuest(100201);
                }
            } else {
                cm.sendOk("Eres demasiado débil para formar parte del#requipo de contraofensiva contra Zakum#k. Alcanzar al menos#bnivel 50#k, entonces habla conmigo.");
            }
            cm.dispose();
        }
    }
}