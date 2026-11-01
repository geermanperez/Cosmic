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

/*      Athena Pierce
	Bowman Job Advancement
	Victoria Road : Bowman Instructional School (100000201)
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "3thJobI": false, "3thJobC": false};
job = 310;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 3;

function start() {
    const GameConstants = Java.type('constants.game.GameConstants');
    if (parseInt(cm.getJobId() / 100) == jobType && cm.canSpawnPlayerNpc(GameConstants.getHallOfFameMapid(cm.getJob()))) {
        spawnPnpc = true;

        var sendStr = "You have walked a long way to reach the power, wisdom and courage you hold today, haven't you? What do you say about having right now #ra NPC on the Hall of Fame holding the current image of your character#k? Do you like it?";
        if (spawnPnpcFee > 0) {
            sendStr += " I can do it for you, for the fee of #b " + cm.numberWithCommas(spawnPnpcFee) + " mesos.#k";
        }

        cm.sendYesNo(sendStr);
    } else {
        if (cm.getJobId() == 0) {
            actionx["1stJob"] = true;
            cm.sendNext("¿Entonces decidiste convertirte en #rbowman#k? Hay algunos estándares que cumplir, ya sabes... #b Tu nivel debe ser al menos 10, con al menos" + cm.getFirstJobStatRequirement(jobType) + "#k. Vamos a ver.");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 300) {
            actionx["2ndJob"] = true;
            if (cm.haveItem(4031012)) {
                cm.sendNext("Jaja... Sabía que pasarías rápidamente esa prueba. Lo admito, eres un gran arquero. Te haré mucho más fuerte de lo que eres ahora. Antes de eso, sin embargo... tendrás que elegir uno de los dos caminos que se te presentan. Será una decisión difícil para usted, pero... si tiene alguna pregunta que hacer, hágala.");
            } else if (cm.haveItem(4031011)) {
                cm.sendOk("Ve y ve el#b#p1072002##k.");
                cm.dispose();
            } else {
                cm.sendYesNo("Hmmm... has crecido mucho desde la última vez que te vi. No veo al debilucho que vi antes y, en cambio, ahora me parezco mucho más a un arquero. Bueno, ¿qué opinas? ¿No quieres ser aún más poderoso que eso? Pase una prueba sencilla y lo haré por usted. ¿Quieres hacerlo?");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 3 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("Ahí estás. Hace unos días,#b#p2020010##kde Ossiria me habló de ti. Veo que estás interesado en dar el salto al asombroso mundo del tercer ascenso laboral para arqueros. Para lograr ese objetivo, tendré que probar tu fuerza para ver si eres digno de avanzar. Hay una abertura en medio de un bosque profundo en la isla Victoria, donde te llevará a un pasaje secreto. Una vez dentro, te enfrentarás a un clon mío. Tu tarea es derrotarla y traerla.#b#t4031059##kDe vuelta contigo.");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("Por favor, tráeme el#b#t4031059##k.");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("Buen trabajo. Has derrotado a mi clon y has traído#b#t4031059##kregresar con seguridad. Ahora ha demostrado que es digno del tercer ascenso laboral desde el punto de vista físico. Ahora deberías darle este collar a#b#p2020011##ken Ossiria para afrontar la segunda parte de la prueba. Buena suerte. Lo necesitarás.");
        } else {
            cm.sendOk("Has elegido sabiamente.");
            cm.dispose();
        }
    }
}

function action(mode, type, selection) {
    status++;
    if (mode == -1 && selection == -1) {
        cm.dispose();
        return;
    } else if (mode == 0 && type != 1) {
        status -= 2;
    }

    if (status == -1) {
        start();
        return;
    } else {
        if (spawnPnpc) {
            if (mode > 0) {
                if (cm.getMeso() < spawnPnpcFee) {
                    cm.sendOk("Lo sentimos, no tienes suficientes mesos para comprar tu lugar en el Salón de la Fama.");
                    cm.dispose();
                    return;
                }

                const PlayerNPC = Java.type('server.life.PlayerNPC');
                const GameConstants = Java.type('constants.game.GameConstants');
                if (PlayerNPC.spawnPlayerNPC(GameConstants.getHallOfFameMapid(cm.getJob()), cm.getPlayer())) {
                    cm.sendOk("¡Ahí tienes! Espero que te guste.");
                    cm.gainMeso(-spawnPnpcFee);
                } else {
                    cm.sendOk("Lo sentimos, el Salón de la Fama está actualmente lleno...");
                }
            }

            cm.dispose();
            return;
        } else {
            if (mode != 1 || status == 7 && type != 1 || (actionx["1stJob"] && status == 4) || (cm.haveItem(4031008) && status == 2) || (actionx["3thJobI"] && status == 1)) {
                if (mode == 0 && status == 2 && type == 1) {
                    cm.sendOk("Sabes que no hay otra opción...");
                }
                if (!(mode == 0 && type != 1)) {
                    cm.dispose();
                    return;
                }
            }
        }
    }

    if (actionx["1stJob"]) {
        if (status == 0) {
            if (cm.getLevel() >= 10 && cm.canGetFirstJob(jobType)) {
                cm.sendNextPrev("Es una elección importante y definitiva. No podrás dar marcha atrás.");
            } else {
                cm.sendOk("Entrena un poco más hasta llegar a los requisitos básicos y podré mostrarte el camino del #rBowman#k.");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(1452051) && cm.canHold(2070000)) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(300);
                    cm.gainItem(1452051, 1);
                    cm.gainItem(2060000, 1000);
                    cm.resetStats();
                }
                cm.sendNext("Muy bien, de ahora en adelante, ¡eres parte de nosotros! Vivirás la vida de un vagabundo en..., pero ten paciencia ya que pronto vivirás una gran vida. Muy bien, no es mucho, pero te daré algunas de mis habilidades... ¡¡¡HAAAHHH!!!");
            } else {
                cm.sendNext("Haz algo de espacio en tu inventario y habla conmigo.");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("Te has vuelto mucho más fuerte ahora. Además, cada uno de tus inventarios tiene espacios agregados. Una fila entera, para ser exactos. Ve a verlo tú mismo. Acabo de darte un poquito de #bSP#k. Cuando abres el menú #bSkill#k en la esquina inferior izquierda de la pantalla, hay habilidades que puedes aprender usando SP. Sin embargo, una advertencia: no se pueden plantear todos juntos a la vez. También hay habilidades que puedes adquirir sólo después de haber aprendido un par de habilidades primero.");
        } else if (status == 3) {
            cm.sendNextPrev("Ahora un recordatorio. Una vez que hayas elegido, no podrás cambiar de opinión e intentar elegir otro camino. Ve ahora y vive como un orgulloso Bowman.");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.haveItem(4031012)) {
                cm.sendSimple("Muy bien, cuando hayas tomado tu decisión, haz clic en [Elegiré mi ocupación] en la parte inferior.#b\r\n#L0#Por favor explícame de qué se trata ser el Cazador.\r\n#L1#Por favor, explícame de qué se trata ser el ballestero.\r\n#L3#¡Elegiré mi ocupación!");
            } else {
                cm.sendNext("Buena decisión. Te ves fuerte, pero necesito ver si realmente eres lo suficientemente fuerte como para pasar la prueba, no es una prueba difícil, así que lo harás bien. Toma, toma mi carta primero... ¡asegúrate de no perderla!");
                if (!cm.isQuestStarted(100000)) {
                    cm.startQuest(100000);
                }
            }
        } else if (status == 1) {
            if (!cm.haveItem(4031012)) {
                if (cm.canHold(4031010)) {
                    if (!cm.haveItem(4031010)) {
                        cm.gainItem(4031010, 1);
                    }
                    cm.sendNextPrev("Por favor envíe esta carta a#b#p1072002##kquien esta cerca#b#m106010000##kcerca de Henesys. Ella se está haciendo cargo del trabajo de instructora en mi lugar. Dale la carta y ella te pondrá a prueba en mi lugar. Mucha suerte para ti.");
                    cm.dispose();
                } else {
                    cm.sendNext("Por favor, haga algo de espacio en su inventario.");
                    cm.dispose();
                }
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //hunter
                        cm.sendNext("Arqueros que dominan#rBows#k.\r\n\r\n#bHunters#k tienen una mayor producción de daño/minuto en los primeros niveles, con ataques que tienen un ritmo más rápido pero ligeramente más débiles que los ballesteros.#bHunters#k conseguir#rBomba de flecha#k, un ataque ligeramente más débil que puede aturdir hasta a 6 enemigos.");
                    } else if (selection == 1) {    //crossbowman
                        cm.sendNext("Arqueros que dominan#rCrossbows#k.\r\n\r\n#bBallesteros#kEl poder de ataque aumenta cuanto más alto sea tu nivel, en comparación con los cazadores.#bCrossbowmans#k conseguir#rFlecha de hierro#k, un ataque más fuerte que no ataca a los enemigos pero puede atravesar paredes.");
                    }

                    status -= 2;
                } else {
                    cm.sendSimple("Ahora… ¿has tomado una decisión? Elija el trabajo que desea seleccionar para su segundo ascenso laboral.#b\r\n#L0#Cazador\r\n#L1#ballestero");
                }
            }
        } else if (status == 2) {
            job += selection * 10;
            cm.sendYesNo("Entonces, ¿quieres lograr el segundo avance laboral como" + (job == 310 ? "#bHunter#k" : "#bCrossbowman#k") + "? Sabes que no podrás elegir un trabajo diferente para el segundo ascenso laboral una vez que tomes tu decisión aquí, ¿verdad?");
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }

            cm.sendNext("Muy bien, eres el" + (job == 310 ? "#bHunter#k" : "#bCrossbowman#k") + "de aquí en adelante." + (job == 310 ? "#bHunter#k" : "#bCrossbowman#k") + "Somos un grupo inteligente con una visión increíble, capaz de perforar la flecha a través del corazón de los monstruos con facilidad... por favor, entrena todos los días. Te ayudaré a ser aún más fuerte de lo que ya eres.");
            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("Acabo de darte un libro que te da la lista de habilidades que puedes adquirir como" + (job == 310 ? "cazador" : "ballestero") + ". Además, su inventario, etc. se ha ampliado al agregarle otra fila. Tu HP y MP máximos también han aumentado. Ve a comprobarlo y compruébalo tú mismo.");
        } else if (status == 5) {
            cm.sendNextPrev("También te he dado un poquito de#bSP#k. Abre el#bMenú de habilidades#kubicado en la esquina inferior izquierda. Podrás mejorar las nuevas habilidades adquiridas de segundo nivel. Sin embargo, una palabra de advertencia. No puedes potenciarlos todos a la vez. Algunas de las habilidades sólo están disponibles después de haber aprendido otras habilidades. Asegúrate de recordar eso.");
        } else if (status == 6) {
            cm.sendNextPrev((job == 310 ? "Cazador" : "ballestero") + "hay que ser fuerte. Pero recuerda que no puedes abusar de ese poder y usarlo con un debilucho. Por favor, usa tu enorme poder de la manera correcta, porque... para que lo uses de la manera correcta, eso es mucho más difícil que simplemente hacerte más fuerte. Por favor, encuéntrame después de haber avanzado mucho más. Te estaré esperando.");
        }
    } else if (actionx["3thJobI"]) {
        if (status == 0) {
            if (cm.getPlayer().gotPartyQuestItem("JB3")) {
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().setPartyQuestItemObtained("JBP");
            }
            cm.sendNextPrev("Como ella es un clon mío, puedes esperar una dura batalla por delante. Utiliza una serie de habilidades de ataque especiales como ninguna que hayas visto jamás, y tu tarea es enfrentarlo con éxito uno a uno. Hay un límite de tiempo en el pasaje secreto, por lo que es crucial que lo derrotes dentro del límite de tiempo. Te deseo la mejor de las suertes y espero que traigas la#b#t4031059##kcontigo.");
        }
    } else if (actionx["3thJobC"]) {
        cm.getPlayer().removePartyQuestItem("JBP");
        cm.gainItem(4031059, -1);
        cm.gainItem(4031057, 1);
        cm.dispose();
    }
}
