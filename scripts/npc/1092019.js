/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    Copyleft (L) 2016 - 2019 RonanLana (HeavenMS)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
-- JavaScript -----------------
Lord Jonathan - Nautilus' Port
-- Created By --
    Cody (Cyndicate)
-- Totally Recreated by --
    Moogra
-- And Quest Script by --
    Ronan
-- Function --
No specific function, useless text.
-- GMS LIKE --
*/

var status;

var seagullProgress;
var seagullIdx = -1;
var seagullQuestion = ["One day, I went to the ocean and caught 62 Octopi for dinner. But then some kid came by and gave me 10 Octopi as a gift! How many Octopi do I have then, in total?"];
var seagullAnswer = ["72"];

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

        if (status == 0) {    // missing script for skill test found thanks to Jade™
            if (!cm.isQuestStarted(6400)) {
                cm.sendOk("¿A quién me estás hablando? Si simplemente estás aburrido, molesta a alguien más.");
                cm.dispose();
            } else {
                seagullProgress = cm.getQuestProgressInt(6400, 1);

                if (seagullProgress == 0) {
                    seagullIdx = Math.floor(Math.random() * seagullQuestion.length);

                    // string visibility thanks to ProXAIMeRx & Glvelturall
                    cm.sendNext("¡Bien entonces! ¡Te daré la primera pregunta ahora! Será mejor que estés preparado porque éste es difícil. Incluso las gaviotas de aquí piensan que esto es bastante difícil. Es un problema bastante difícil.");
                } else if (seagullProgress == 1) {
                    cm.sendNext("Ahora ~ pasemos a la siguiente pregunta. Éste es realmente difícil. Voy a hacer que Bart me ayude con esto. Conoces a Bart, ¿verdad?");
                } else {
                    cm.sendNext("¡Ohhh! ¡Eso fue impresionante! Consideré que mi prueba era bastante difícil, y para que la pases... eres de hecho un miembro integral de la familia Pirata y amigo de las gaviotas. ¡Ahora estamos unidos por una amistad mutua que durará toda la vida! Y, sobre todo, los amigos están ahí para ayudarte cuando estés en una situación desesperada. Si estás en estado de emergencia, llámanos gaviotas.");
                }
            }
        } else if (status == 1) {
            if (seagullProgress == 0) {
                cm.sendGetText(seagullQuestion[seagullIdx]);
            } else if (seagullProgress == 1) {
                cm.sendNextPrev("Te enviaré a una habitación vacía en The Nautilus. Verás 9 Barts allí. Jajaja~ ¿Son gemelos? No, no, ciertamente no. He usado un poco de magia para esta prueba de voluntad.");
            } else {
                cm.sendNextPrev("Notifícanos usando la habilidad Air Strike y estaremos allí para ayudarte, porque para eso están los amigos.\r\n\r\n  #s5221003#    #b#q5221003##k");
            }
        } else if (status == 2) {
            if (seagullIdx > -1) {
                var answer = cm.getText();
                if (answer == seagullAnswer[seagullIdx]) {
                    cm.sendNext("¡Qué! ¡No puedo creer lo increíblemente inteligente que eres! ¡Increíble! En el mundo de las gaviotas, ese tipo de inteligencia te daría un doctorado. y algo más. Eres realmente increíble... No puedo creerlo... ¡Simplemente no puedo creerlo!");
                    cm.setQuestProgress(6400, 1, 1);
                    cm.dispose();
                } else {
                    cm.sendOk("Hmm, no es así como lo recuerdo. ¡Intentar otra vez!");
                    cm.dispose();
                }
            } else if (seagullProgress != 2) {
                cm.sendNextPrev("De todos modos, sólo uno de los 9 Barts es el verdadero Bart. Sabes que los piratas son conocidos por la fuerza de sus amistades y camaradería con sus compañeros piratas. Si eres un verdadero pirata, deberías poder encontrar a tu propia pareja con facilidad. Muy bien, entonces te enviaré a la habitación donde está Bart.");
            } else {
                //cm.gainExp(1000000);
                //cm.teachSkill(5221003, 0, 10, -1);
                //cm.forceCompleteQuest(6400);

                cm.sendNextPrev("¡Has superado todos mis desafíos y los has superado! ¡Buen trabajo!");
                cm.dispose();
            }
        } else if (status == 3) {
            var em = cm.getEventManager("4jaerial");
            if (!em.startInstance(cm.getPlayer())) {
                cm.sendOk("Otro jugador ya está desafiando la prueba en este canal. Pruebe con otro canal o espere a que finalice el reproductor actual.");
            }

            cm.dispose();
        }
    }
}