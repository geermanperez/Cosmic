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
/* Dark Lord
	Thief Job Advancement
	Victoria Road : Thieves' Hideout (103000003)
	Custom Quest 100009, 100011
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "3thJobI": false, "3thJobC": false};
job = 410;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 4;

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
            cm.sendNext("¿Quieres ser un #rthief#k? Hay algunos estándares que cumplir. porque no podemos simplemente aceptar a TODOS en... #bTu nivel debe ser al menos 10, con al menos tu" + cm.getFirstJobStatRequirement(jobType) + "#k. Vamos a ver.");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 400) {
            actionx["2ndJob"] = true;
            if (cm.haveItem(4031012)) {
                cm.sendNext("Veo que lo has hecho bien. Te permitiré dar el siguiente paso en tu largo camino.");
            } else if (cm.haveItem(4031011)) {
                cm.sendOk("Ve y ve el#b#p1072003##k.");
                cm.dispose();
            } else {
                cm.sendNext("El progreso que has logrado es asombroso.");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 4 && !cm.getPlayer().gotPartyQuestItem("JBP"))) {
            actionx["3thJobI"] = true;
            cm.sendNext("Ahí estás. Hace unos días,#b#p2020011##kde Ossiria me habló de ti. Veo que te interesa dar el salto al oscuro mundo del tercer ascenso laboral para ladrones. Para lograr ese objetivo, tendré que poner a prueba tu fuerza para ver si eres digno de avanzar. Hay una abertura en medio de un profundo pantano en la isla Victoria, donde te llevará a un pasaje secreto. Una vez dentro, te enfrentarás a un clon mío. Tu tarea es derrotarlo y traer#b#t4031059##kDe vuelta contigo.");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("Por favor, tráeme el#b#t4031059##k.");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("Buen trabajo. Has derrotado a mi clon y has traído#b#t4031059##kregresar con seguridad. Ahora ha demostrado que es digno del tercer ascenso laboral desde el punto de vista físico. Ahora deberías darle este collar a#b#p2020011##ken Ossiria para afrontar la segunda parte de la prueba. Buena suerte. Lo necesitarás.");
        } else if (cm.isQuestStarted(6141)) {
            cm.warp(910300000, 3);
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
                cm.sendYesNo("Oh...! Pareces alguien que definitivamente puede ser parte de nosotros... todo lo que necesitas es una pequeña mente siniestra, y... sí... entonces, ¿qué piensas? ¿Quieres ser el pícaro?");
            } else {
                cm.sendOk("Entrena un poco más hasta llegar a los requisitos básicos y podré mostrarte el camino del #rThief#k.");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(2070000) && cm.canHoldAll([1472061, 1332063])) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(400);
                    cm.gainItem(2070015, 500);
                    cm.gainItem(1472061, 1);
                    cm.gainItem(1332063, 1);
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
            cm.sendNextPrev("Ahora un recordatorio. Una vez que hayas elegido, no podrás cambiar de opinión e intentar elegir otro camino. Ve ahora y vive como un orgulloso ladrón.");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.haveItem(4031012)) {
                cm.sendSimple("Muy bien, cuando hayas tomado tu decisión, haz clic en [Elegiré mi ocupación] en la parte inferior.#b\r\n#L0#Por favor explícame de qué se trata ser el Asesino.\r\n#L1#Por favor explícame de qué se trata ser el Bandido.\r\n#L3#¡Elegiré mi ocupación!");
            } else {
                cm.sendNext("Buena decisión. Te ves fuerte, pero necesito ver si realmente eres lo suficientemente fuerte como para pasar la prueba, no es una prueba difícil, así que lo harás bien. Toma, toma mi carta primero... ¡asegúrate de no perderla!");
                if (!cm.isQuestStarted(100009)) {
                    cm.startQuest(100009);
                }
            }
        } else if (status == 1) {
            if (!cm.haveItem(4031012)) {
                if (cm.canHold(4031011)) {
                    if (!cm.haveItem(4031011)) {
                        cm.gainItem(4031011, 1);
                    }
                    cm.sendNextPrev("Por favor envíe esta carta a#b#p1072003##kquien esta cerca#b#m102040000##kcerca de la ciudad de Kerning. Él se está haciendo cargo del trabajo de instructor en mi lugar. Dale la carta y él te pondrá a prueba en mi lugar. Mucha suerte para ti.");
                } else {
                    cm.sendNext("Por favor, haga algo de espacio en su inventario.");
                    cm.dispose();
                }
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //assassin
                        cm.sendNext("Los ladrones que dominan #rClaws#k.\r\n\r\n#bAssassins#k son atacantes de largo alcance. Son bastante mesoeficientes y tienen un buen potencial de daño, pero cuestan más que los Bandidos.");
                    } else if (selection == 1) {    //bandit
                        cm.sendNext("Los ladrones que dominan #rDaggers#k.\r\n\r\n#bBandits#k son atacantes cuerpo a cuerpo rápidos y bastante poderosos entre los segundos trabajos. No son tan eficientes como los Asesinos y no tienen el beneficio del ataque a distancia, pero lo compensan con un poder bruto mucho mayor.");
                    }

                    status -= 2;
                } else {
                    cm.sendSimple("Ahora… ¿has tomado una decisión? Elija el trabajo que desea seleccionar para su segundo ascenso laboral.#b\r\n#L0#Asesino\r\n#L1#Bandido");
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031011)) {
                cm.dispose();
                return;
            }
            job += selection * 10;
            cm.sendYesNo("Entonces, ¿quieres lograr el segundo avance laboral como" + (job == 410 ? "#bAssassin#k" : "#bBandit#k") + "? Sabes que no podrás elegir un trabajo diferente para el segundo ascenso laboral una vez que tomes tu decisión aquí, ¿verdad?");
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }
            cm.completeQuest(100011);

            if (job == 410) {
                cm.sendNext("Muy bien, de ahora en adelante eres el #bAssassin#k. Los asesinos tienen manos y pies más rápidos para dominar a los enemigos. Por favor sigue entrenando. ¡Te haré aún más poderoso de lo que eres ahora!");
            } else {
                cm.sendNext("Muy bien, de ahora en adelante eres el #bBandit. Los bandidos se deleitan con las sombras y la oscuridad, esperando hasta que llegue el momento adecuado para clavar una daga en el hogar del enemigo, de forma repentina y rápida... por favor, sigue entrenando. Te haré aún más poderoso de lo que eres ahora.");
            }

            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("Acabo de darte un libro que te da la lista de habilidades que puedes adquirir como" + (job == 410 ? "asesino" : "bandido") + ". Además, su inventario, etc. se ha ampliado al agregarle otra fila. Tu HP y MP máximos también han aumentado. Ve a comprobarlo y compruébalo tú mismo.");
        } else if (status == 5) {
            cm.sendNextPrev("También te he dado un poquito de#bSP#k. Abre el#bMenú de habilidades#kubicado en la esquina inferior izquierda. Podrás mejorar las nuevas habilidades adquiridas de segundo nivel. Sin embargo, una palabra de advertencia. No puedes potenciarlos todos a la vez. Algunas de las habilidades sólo están disponibles después de haber aprendido otras habilidades. Asegúrate de recordar eso.");
        } else if (status == 6) {
            cm.sendNextPrev((job == 410 ? "Asesino" : "Bandido") + "hay que ser fuerte. Pero recuerda que no puedes abusar de ese poder y usarlo con un debilucho. Por favor, usa tu enorme poder de la manera correcta, porque... para que lo uses de la manera correcta, eso es mucho más difícil que simplemente hacerte más fuerte. Por favor, encuéntrame después de haber avanzado mucho más. Te estaré esperando.");
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