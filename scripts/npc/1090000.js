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
/* Kyrin
	Pirate Job Advancement
	
	Custom Quest 100009, 100011
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "2ndjobT": false, "3thJobI": false, "3thJobC": false};
job = 510;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 5;

var advQuest = 0;

function start() {
    const GameConstants = Java.type('constants.game.GameConstants');
    if (cm.isQuestStarted(6330)) {
        if (cm.getEventInstance() != null) {    // missing script for skill test found thanks to Jade™
            advQuest = 5;                       // string visibility thanks to iPunchEm & Glvelturall
            cm.sendNext("Nada mal. ¡Discutamos esto afuera!");
        } else if (cm.getQuestProgressInt(6330, 6331) == 0) {
            advQuest = 1;
            cm.sendNext("Estás listo, ¿verdad? Ahora intenta resistir mis ataques durante 2 minutos. No seré fácil contigo. Buena suerte, porque la necesitarás.");
        } else {
            advQuest = 3;
            cm.teachSkill(5121003, 0, 10, -1);
            cm.forceCompleteQuest(6330);

            cm.sendNext("Felicidades. Has logrado pasar mi prueba. Te enseñaré una nueva habilidad llamada\"Súper Transformación\".\r\n\r\n  #s5121003#    #b#q5121003##k");
        }
    } else if (cm.isQuestStarted(6370)) {
        if (cm.getEventInstance() != null) {
            advQuest = 6;
            cm.sendNext("Nada mal. ¡Discutamos esto afuera!");
        } else if (cm.getQuestProgressInt(6370, 6371) == 0) {
            advQuest = 2;
            cm.sendNext("Estás listo, ¿verdad? Ahora intenta resistir mis ataques durante 2 minutos. No seré fácil contigo. Buena suerte, porque la necesitarás.");
        } else {
            advQuest = 4;
            cm.teachSkill(5221006, 0, 10, -1);
            cm.forceCompleteQuest(6370);

            cm.sendNext("Felicidades. Has logrado pasar mi prueba. Te enseñaré una nueva habilidad llamada\"Acorazado\".\r\n\r\n  #s5221006#    #b#q5221006##k");
        }
    } else if (parseInt(cm.getJobId() / 100) == jobType && cm.canSpawnPlayerNpc(GameConstants.getHallOfFameMapid(cm.getJob()))) {
        spawnPnpc = true;

        var sendStr = "You have walked a long way to reach the power, wisdom and courage you hold today, haven't you? What do you say about having right now #ra NPC on the Hall of Fame holding the current image of your character#k? Do you like it?";
        if (spawnPnpcFee > 0) {
            sendStr += " I can do it for you, for the fee of #b " + cm.numberWithCommas(spawnPnpcFee) + " mesos.#k";
        }

        cm.sendYesNo(sendStr);
    } else {
        if (cm.getJobId() == 0) {
            actionx["1stJob"] = true;
            cm.sendNext("¿Quieres ser un #rpirate#k? Hay algunos estándares que cumplir. porque no podemos simplemente aceptar a TODOS en... #bTu nivel debe ser al menos 10, con" + cm.getFirstJobStatRequirement(jobType) + "mínimo#k. Vamos a ver.");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 500) {
            actionx["2ndJob"] = true;
            if (cm.isQuestCompleted(2191) || cm.isQuestCompleted(2192)) {
                cm.sendNext("Veo que lo has hecho bien. Te permitiré dar el siguiente paso en tu largo camino.");
            } else {
                cm.sendNext("El progreso que has logrado es asombroso.");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 5 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("Ahí estás. Hace unos días,#b#p2020013##kde Ossiria me habló de ti. Veo que te interesa dar el salto al mundo del tercer ascenso laboral para piratas. Para lograr ese objetivo, tendré que poner a prueba tu fuerza para ver si eres digno de avanzar. Hay una abertura en medio de una cueva en la isla Victoria, que te llevará a un pasaje secreto. Una vez dentro, te enfrentarás a un clon mío. Tu tarea es derrotarlo y traer#b#t4031059##kDe vuelta contigo.");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("Por favor, tráeme el#b#t4031059##k.");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("Buen trabajo. Has derrotado a mi clon y has traído#b#t4031059##kregresar con seguridad. Ahora ha demostrado que es digno del tercer ascenso laboral desde el punto de vista físico. Ahora deberías darle este collar a#b#p2020013##ken Ossiria para afrontar la segunda parte de la prueba. Buena suerte. Lo necesitarás.");
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
        if (advQuest > 0) {
            if (advQuest < 3) {
                var em = cm.getEventManager(advQuest == 1 ? "4jship" : "4jsuper");
                if (!em.startInstance(cm.getPlayer())) {
                    cm.sendOk("Alguien ya está desafiando la prueba. Inténtelo de nuevo más tarde.");
                }
            } else if (advQuest < 5) {
                if (advQuest == 3) {
                    cm.sendOk("Es similar al de 'Transformación', pero es mucho más poderoso que eso. Sigue entrenando y espero verte por aquí.");
                } else {
                    cm.sendOk("A diferencia de la mayoría de las otras habilidades que usaste como pirata, esta definitivamente es diferente. De hecho, puedes montar el 'Battleship' y atacar a los enemigos con él. Tu nivel de DEF aumentará durante el tiempo que estés a bordo, lo que te ayudará enormemente en situaciones de combate. Que te conviertas en el mejor pistolero que existe...");
                }
            } else {
                if (advQuest < 6) {
                    cm.setQuestProgress(6330, 6331, 2);
                } else {
                    cm.setQuestProgress(6370, 6371, 2);
                }

                cm.warp(120000101);
            }

            cm.dispose();
        } else if (spawnPnpc) {
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
                cm.sendYesNo("Oh...! Pareces alguien que definitivamente puede ser parte de nosotros... todo lo que necesitas es un poco de jerga, y... sí... entonces, ¿qué piensas? ¿Quieres ser el pirata?");
            } else {
                cm.sendOk("Entrena un poco más hasta llegar a los requisitos básicos y podré mostrarte el camino del #rPirate#k.");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(2070000) && cm.canHoldAll([1482000, 1492000])) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(500);
                    cm.gainItem(1492000, 1);
                    cm.gainItem(1482000, 1);
                    cm.gainItem(2330000, 1000);
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
            cm.sendNextPrev("Ahora un recordatorio. Una vez que hayas elegido, no podrás cambiar de opinión e intentar elegir otro camino. Ve ahora y vive como un pirata orgulloso.");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.isQuestCompleted(2191) || cm.isQuestCompleted(2192)) {
                cm.sendSimple("Muy bien, cuando hayas tomado tu decisión, haz clic en [Elegiré mi ocupación] en la parte inferior.#b\r\n#L0#Por favor explícame de qué se trata ser el Brawler.\r\n#L1#Por favor explícame de qué se trata ser el Pistolero.\r\n#L3#¡Elegiré mi ocupación!");
            } else {
                cm.sendNext("Buena decisión. Te ves fuerte, pero necesito ver si realmente eres lo suficientemente fuerte como para pasar la prueba, no es una prueba difícil, así que lo harás bien.");
            }
        } else if (status == 1) {
            if (!cm.isQuestCompleted(2191) && !cm.isQuestCompleted(2192)) {
                // Pirate works differently from the other jobs. It warps you directly in.
                actionx["2ndJobT"] = true;
                cm.sendYesNo("¿Quieres hacer la prueba ahora?");
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //brawler
                        cm.sendNext("Piratas que dominan#rKnuckles#k.\r\n\r\n#bBrawlers#K son luchadores cuerpo a cuerpo y de corto alcance que causan mucho daño y tienen un alto HP. Armado con#rGolpe de sacacorchos#k, uno puede causar un daño masivo a múltiples objetivos a la vez.#rBarril de roble#kPermite explorar o disfrazarse en medio de peleas difíciles, permitiendo una posible ruta de escape ante el peligro.");
                    } else if (selection == 1) {    //gunslinger
                        cm.sendNext("Piratas que dominan#rGuns#k.\r\n\r\n#bGunslingers#k son atacantes más rápidos y a distancia. Con el#rWings#k habilidad, los pistoleros pueden flotar en el aire, lo que permite un salto más largo y sostenido que un salto normal.#rTiro en blanco#kpermite repartir el estado de aturdimiento a múltiples objetivos cercanos.");
                    }

                    status -= 2;
                } else {
                    cm.sendNextPrev("Aún te queda un largo camino por delante, pero ser pirata te ayudará a llegar allí. Solo tenlo en cuenta y lo harás bien.");
                }
            }
        } else if (status == 2) {
            if (actionx["2ndJobT"]) {
                var map = 0;
                if (cm.isQuestStarted(2191)) {
                    map = 108000502;
                } else {
                    map = 108000501;
                }
                if (cm.getPlayerCount(map) > 0) {
                    cm.sendOk("Todos los mapas de entrenamiento están actualmente en uso. Inténtelo de nuevo más tarde.");
                    cm.dispose();
                } else {
                    cm.warp(map, 0);
                    cm.dispose();

                }
            } else {
                if (cm.isQuestCompleted(2191) && cm.isQuestCompleted(2192)) {
                    job = (Math.random() < 0.5) ? 510 : 520;
                } else if (cm.isQuestCompleted(2191)) {
                    job = 510;
                } else if (cm.isQuestCompleted(2192)) {
                    job = 520;
                }

                cm.sendYesNo("Entonces, ¿quieres lograr el segundo avance laboral como" + (job == 510 ? "#bBrawler#k" : "#bGunslinger#k") + "? Sabes que no podrás elegir un trabajo diferente para el segundo ascenso laboral una vez que tomes tu decisión aquí, ¿verdad?");
            }
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }

            if (job == 510) {
                cm.sendNext("De ahora en adelante, eres un #bBrawler#k. Los luchadores gobiernan el mundo con el poder de sus puños desnudos... lo que significa que necesitan entrenar su cuerpo más que otros. Si tienes algún problema para entrenar, estaré más que feliz de ayudarte.");
            } else {
                cm.sendNext("De ahora en adelante, eres un #bGunslinger#k. Los pistoleros se destacan por sus ataques de largo alcance con precisión de francotirador y, por supuesto, por usar armas como arma principal. Debes continuar entrenando para dominar verdaderamente tus habilidades. Si tienes problemas para entrenar, estaré aquí para ayudarte.");
            }

            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("Acabo de darte un libro que te da la lista de habilidades que puedes adquirir como" + (job == 510 ? "alborotador" : "pistolero") + ". Además, su inventario, etc. se ha ampliado al agregarle otra fila. Tu HP y MP máximos también han aumentado. Ve a comprobarlo y compruébalo tú mismo.");
        } else if (status == 5) {
            cm.sendNextPrev("También te he dado un poquito de#bSP#k. Abre el#bMenú de habilidades#kubicado en la esquina inferior izquierda. Podrás mejorar las nuevas habilidades adquiridas de segundo nivel. Sin embargo, una palabra de advertencia. No puedes potenciarlos todos a la vez. Algunas de las habilidades sólo están disponibles después de haber aprendido otras habilidades. Asegúrate de recordar eso.");
        } else if (status == 6) {
            cm.sendNextPrev((job == 510 ? "luchadores" : "Pistoleros") + "hay que ser fuerte. Pero recuerda que no puedes abusar de ese poder y usarlo con un debilucho. Por favor, usa tu enorme poder de la manera correcta, porque... para que lo uses de la manera correcta, eso es mucho más difícil que simplemente hacerte más fuerte. Por favor, encuéntrame después de haber avanzado mucho más. Te estaré esperando.");
        }
    } else if (actionx["3thJobI"]) {
        if (status == 0) {
            if (cm.getPlayer().gotPartyQuestItem("JB3")) {
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().setPartyQuestItemObtained("JBP");
            }
            cm.sendNextPrev("Como es un clon mío, puedes esperar una dura batalla por delante. Utiliza una serie de habilidades de ataque especiales como ninguna que hayas visto jamás, y tu tarea es enfrentarlo con éxito uno a uno. Hay un límite de tiempo en el pasaje secreto, por lo que es crucial que lo derrotes dentro del límite de tiempo. Te deseo la mejor de las suertes y espero que traigas la#b#t4031059##kcontigo.");
        }
    } else if (actionx["3thJobC"]) {
        cm.getPlayer().removePartyQuestItem("JBP");
        cm.gainItem(4031059, -1);
        cm.gainItem(4031057, 1);
        cm.dispose();
    }
}