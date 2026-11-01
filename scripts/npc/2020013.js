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
    var jobStyle = 5;
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
    cm.sendSimple("¿Puedo ayudarte?#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#I quiero realizar el tercer avance laboral." : "") + "\r\n#L1#Por favor, permítanme hacer Zakum Dungeon Quest.");
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
            cm.sendYesNo("¡Bueno! Ahora, gracias a mí, te transformarás en un pirata mucho más poderoso. Sin embargo, antes de hacer eso, asegúrese de haber utilizado completamente su SP. Necesitará usar al menos todos los SP obtenidos hasta el nivel 70 para avanzar al tercer trabajo. Ah, y dado que ya has elegido tu camino de ocupación para el segundo puesto de trabajo, no tendrás que volver a elegir para el tercer puesto de trabajo. ¿Quieres hacerlo ahora mismo?");
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

            if (Math.floor(cm.getJobId() / 10) == 51) {
                cm.sendNext("¡Excelente! ahora eres un#bMarauder#k. Como Merodeador, aprenderás algunas de las habilidades más sofisticadas relacionadas con los ataques cuerpo a cuerpo.#bCarga de energía#kes una habilidad que te permite almacenar tu poder y el daño que recibes en una forma especial de energía. Una vez que esta bola de energía esté cargada, podrás usar#bExplosión de energía#kpara aplicar el máximo daño contra tus enemigos, y también usar#bDrenaje de energía#kpara robar el HP de tu enemigo para recuperar el tuyo.#bTransformation#k te permitirá transformarte en un ser sobrehumano con devastadores ataques cuerpo a cuerpo, y mientras estés transformado, podrás usar#bShockwave#k para causar un mini-terremoto e infligir daños masivos a tus enemigos.");
            } else {
                cm.sendNext("¡Excelente! Ahora te has convertido en un#bOutlaw#k. Como Outlaw, te convertirás en un verdadero pistolero, un maestro de todos los ataques con armas conocidos, además de algunas otras habilidades que te ayudarán a vencer el mal.#bExplosión de fuego#kes una versión más poderosa de Double Shot, que dispara más balas y causa más daño al mismo tiempo. Ahora también tienes la capacidad de convocar a un leal.#bOctopus#k y el descenso#bGaviota#k como tus aliados de confianza, mientras atacas a tus enemigos usando#bBullseye#k. También puedes usar ataques basados ​​en elementos usando#bFlamethrower#k y#bDivisor de hielo#k.");
            }
        } else if (status == 3) {
            cm.sendNextPrev("También te he proporcionado algunos SP y AP, que te ayudarán a empezar. Ahora te has convertido en un pirata muy, muy poderoso. Sin embargo, recuerda que el mundo real estará esperando tu llegada con obstáculos aún más difíciles que superar. Una vez que sientas que no puedes entrenarte para alcanzar un lugar más alto, entonces, y sólo entonces, ven a verme. Estaré aquí esperando.");
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
        cm.sendNext("Ve, habla con#b#p1090000##ky tráeme#b#t4031057##k.");
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
                    cm.sendYesNo("Bienvenido. Soy#b#p2020013##k, el jefe de todos los piratas, encargado de sacar lo mejor de todos y cada uno de los piratas que necesitan mi guía. Pareces el tipo de pirata que quiere dar el salto adelante, el que está listo para asumir los desafíos del tercer ascenso laboral. Pero he visto innumerables piratas deseosos de dar el salto como tú, sólo para verlos fracasar. ¿Qué pasa contigo? ¿Estás listo para hacerte la prueba y lograr el tercer avance laboral?");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("Bien. Serás puesto a prueba en dos aspectos importantes del pirata: fuerza y ​​sabiduría. Ahora te explicaré la mitad física de la prueba. Recordar#b#p1090000##kdel puerto de Nautilus? Ve a verlo y te dará los detalles de la primera mitad de la prueba. Por favor completa la misión y obtén#b#t4031057##kde#p1090000#.");
                } else if (status == 2) {
                    cm.sendNextPrev("La mitad mental de la prueba sólo puede comenzar después de pasar la parte física de la prueba.#b#t4031057##kserá la prueba de que efectivamente has pasado la prueba. dejaré#b#p1022000##kcon anticipación que vas a llegar allí, así que prepárate. No será fácil, pero tengo la máxima fe en ti. Buena suerte.");
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