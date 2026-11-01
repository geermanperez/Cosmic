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
/* Dances with Balrog
	Warrior Job Advancement
	Victoria Road : Warriors' Sanctuary (102000003)

	Custom Quest 100003, 100005
*/

status = -1;
actionx = {"1stJob": false, "2ndjob": false, "3thJobI": false, "3thJobC": false};
job = 110;

spawnPnpc = false;
spawnPnpcFee = 7000000;
jobType = 1;

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
            cm.sendNext("¿Quieres convertirte en #rwarrior#k? Debes cumplir algunos criterios para poder hacerlo.#b Debes estar al menos en el nivel 10, y al menos" + cm.getFirstJobStatRequirement(jobType) + "#k. Vamos a ver...");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        } else if (cm.getLevel() >= 30 && cm.getJobId() == 100) {
            actionx["2ndJob"] = true;
            if (cm.haveItem(4031012)) {
                cm.sendNext("¡Oh... volviste sano y salvo! Sabía que saldrías adelante. ¡Lo admito, eres un guerrero fuerte y formidable! Muy bien, te haré un guerrero aún más fuerte de lo que ya eres. Pero antes de eso, deberás elegir uno de los tres caminos que se te presentarán. No será fácil, así que si tienes alguna pregunta, no dudes en preguntar.");
            } else if (cm.haveItem(4031008)) {
                cm.sendOk("Ve y ve el#b#p1072000##k.");
                cm.dispose();
            } else {
                cm.sendNext("El progreso que has logrado es asombroso.");
            }
        } else if (actionx["3thJobI"] || (cm.getPlayer().gotPartyQuestItem("JB3") && cm.getLevel() >= 70 && (cm.getJobId() % 10 == 0 && parseInt(cm.getJobId() / 100) == 1 && !cm.getPlayer().gotPartyQuestItem("JBP")))) {
            actionx["3thJobI"] = true;
            cm.sendNext("Te estaba esperando. Hace unos días escuché de ti por#b#p2020008##ken Ossiria. Bueno... me gustaría probar tu fuerza. Hay un pasaje secreto cerca del túnel de las hormigas. Nadie más que tú puede entrar en ese pasaje. Si entras en el pasillo, te alimentarás con el otro yo. Golpéalo y tráelo#b#t4031059##ka mí.");
        } else if (cm.getPlayer().gotPartyQuestItem("JBP") && !cm.haveItem(4031059)) {
            cm.sendNext("Por favor, tráeme el#b#t4031059##k.");
            cm.dispose();
        } else if (cm.haveItem(4031059) && cm.getPlayer().gotPartyQuestItem("JBP")) {
            actionx["3thJobC"] = true;
            cm.sendNext("Vaya... venciste a mi otro yo y trajiste#b#t4031059##ka mí. ¡Bien! Esto seguramente prueba tu fuerza. En términos de fuerza, estás listo para avanzar al tercer trabajo. Como prometí, te daré#b#t4031057##kA usted. Dale este collar a#b#p2020008##ken Ossiria y podrá realizar la segunda prueba de ascenso al tercer puesto. Buena suerte ~");
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
            if (mode != 1 || status == 7 && type != 1 || (actionx["1stJob"] && status == 4) || (cm.haveItem(4031008) && status == 2) || (actionx["3thJob"] && status == 1)) {
                if (mode == 0 && status == 2 && type == 1) {
                    cm.sendOk("Decídete y visítame de nuevo.");
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
                cm.sendOk("Entrena un poco más hasta llegar a los requisitos básicos y podré mostrarte el camino del #rWarrior#k.");
                cm.dispose();
            }
        } else if (status == 1) {
            if (cm.canHold(1302077)) {
                if (cm.getJobId() == 0) {
                    cm.changeJobById(100);
                    cm.gainItem(1302077, 1);
                    cm.resetStats();
                }
                cm.sendNext("De ahora en adelante, irás al camino del Guerrero. Este no es un trabajo fácil, pero si tienes disciplina y confianza en tu propio cuerpo y habilidades, superarás cualquier dificultad en tu camino. ¡Ve, joven guerrero!");
            } else {
                cm.sendNext("Haz algo de espacio en tu inventario y habla conmigo.");
                cm.dispose();
            }
        } else if (status == 2) {
            cm.sendNextPrev("Te has vuelto mucho más fuerte ahora. Además, cada uno de tus inventarios tiene espacios agregados. Una fila entera, para ser exactos. Ve a verlo tú mismo. Acabo de darte un poquito de #bSP#k. Cuando abres el menú #bSkill#k en la esquina inferior izquierda de la pantalla, hay habilidades que puedes aprender usando SP. Sin embargo, una advertencia: no se pueden plantear todos juntos a la vez. También hay habilidades que puedes adquirir sólo después de haber aprendido un par de habilidades primero.");
        } else if (status == 3) {
            cm.sendNextPrev("Ahora un recordatorio. Una vez que hayas elegido, no podrás cambiar de opinión e intentar elegir otro camino. Ve ahora y vive como un orgulloso guerrero.");
        } else {
            cm.dispose();
        }
    } else if (actionx["2ndJob"]) {
        if (status == 0) {
            if (cm.haveItem(4031012)) {
                cm.sendSimple("Muy bien, cuando hayas tomado tu decisión, haz clic en [Elegiré mi ocupación] en la parte inferior.#b\r\n#L0#Por favor explícame de qué se trata ser el luchador.\r\n#L1#Por favor explícame de qué se trata ser la Página.\r\n#L2#Por favor, explícame de qué se trata ser el lancero.\r\n#L3#¡Elegiré mi ocupación!");
            } else {
                cm.sendNext("Buena decisión. Te ves fuerte, pero necesito ver si realmente eres lo suficientemente fuerte como para pasar la prueba, no es una prueba difícil, así que lo harás bien. Toma, toma mi carta primero... ¡asegúrate de no perderla!");
                if (!cm.isQuestStarted(100003)) {
                    cm.startQuest(100003);
                }
            }
        } else if (status == 1) {
            if (!cm.haveItem(4031012)) {
                if (cm.canHold(4031008)) {
                    if (!cm.haveItem(4031008)) {
                        cm.gainItem(4031008, 1);
                    }
                    cm.sendNextPrev("Por favor envíe esta carta a#b#p1072000##kquien esta cerca#b#m102020300##kcerca de Perión. Él se está haciendo cargo del trabajo de instructor en mi lugar. Dale la carta y él te pondrá a prueba en mi lugar. Mucha suerte para ti.");
                } else {
                    cm.sendNext("Por favor, haga algo de espacio en su inventario.");
                    cm.dispose();
                }
            } else {
                if (selection < 3) {
                    if (selection == 0) {    //fighter
                        cm.sendNext("Guerreros que dominan#rEspadas o hachas#k.\r\n\r\n#rFighters#k conseguir#bRage#k, que aumenta el ataque con armas de tu grupo en 10. Durante el segundo trabajo, esto se agradece mucho, ya que es gratis (excepto -10 wep def, que no afectará mucho el daño que recibes), no requiere espacios de uso y aumenta el daño de cada miembro del grupo (excepto los magos) en varios cientos. Las otras clases también pueden aumentar el ataque con arma, pero necesitan elementos para hacerlo.#rFighters#k también obtenga#bGuardia de poder#k, reduciendo el daño táctil en un 40% y se lo devuelve al monstruo. Ésta es la razón principal por la que#rFighters#k se consideran solistas es porque esto reduce enormemente los costos del bote.");
                    } else if (selection == 1) {    //page
                        cm.sendNext("Guerreros que dominan#rEspadas o mazas/armas contundentes#k.\r\n\r\n#rPages#k conseguir#bThreaten#k, una habilidad que reduce la defensa y el ataque con armas de los enemigos en 20; esto se usa principalmente para reducir el daño que te infligen. Las páginas también obtienen#bGuardia de poder#k, reduciendo el daño táctil en un 40% y se lo devuelve al monstruo. Esta es una de las razones principales por las que#bPáginas/semanas#kse consideran solitarios, eso se debe a que esto reduce enormemente los costos del bote. Por supuesto, KB constante y#bCarga de hielo#kTambién ayuda al factor solo.");
                    } else {    //spearman
                        cm.sendNext("Guerreros que dominan#rLanzas o armas de asta#k.\r\n\r\n#rSpearmen#k conseguir#bHipercuerpo#k, que aumenta tu HP/MP máximo y el de tu grupo en un 60% cuando está al máximo. Esta habilidad es particularmente útil para ayudar a los ladrones, arqueros y magos en grupo a sobrevivir a más golpes de enemigos y/o jefes PQ. ellos también obtienen#bVoluntad de hierro#klo que da +20 wep def y +20 mag def durante 300 segundos. Básicamente es una bendición debilitada con 100 segundos más de duración, pero no ofrece bonificación de precisión ni evitabilidad. Incluso con esta habilidad al máximo, ni siquiera está cerca de estar en la misma liga que Power Guard y es por eso que los lanceros/caballeros oscuros no se consideran una clase en solitario.");
                    }

                    status -= 2;
                } else {
                    cm.sendSimple("Ahora… ¿has tomado una decisión? Elija el trabajo que desea seleccionar para su segundo ascenso laboral.#b\r\n#L0#Combatiente\r\n#L1#Página\r\n#L2#Lancero");
                }
            }
        } else if (status == 2) {
            if (cm.haveItem(4031008)) {
                cm.dispose();
                return;
            }
            job += selection * 10;
            cm.sendYesNo("Entonces, ¿quieres lograr el segundo avance laboral como" + (job == 110 ? "#bFighter#k" : job == 120 ? "#bPage#k" : "#bSpearman#k") + "? Sabes que no podrás elegir un trabajo diferente para el segundo ascenso laboral una vez que tomes tu decisión aquí, ¿verdad? ¿Estás seguro de esto?");
        } else if (status == 3) {
            if (cm.haveItem(4031012)) {
                cm.gainItem(4031012, -1);
            }
            cm.completeQuest(100005);

            if (job == 110) {
                cm.sendNext("Muy bien, ahora te has convertido en el #bFighter#k. Un luchador se esfuerza por convertirse en el más fuerte de los fuertes y nunca deja de luchar. Nunca pierdas esa voluntad de luchar y sigue adelante las 24 horas del día, los 7 días de la semana. Te ayudaré a ser aún más fuerte de lo que ya eres.");
            } else if (job == 120) {
                cm.sendNext("Muy bien, ¡ahora te has convertido en #bPage#k! Los pajes tienen una gran inteligencia y valentía, que espero que emplees a lo largo de tu viaje por el camino correcto. Te ayudaré a ser mucho más fuerte de lo que ya eres.");
            } else {
                cm.sendNext("Muy bien, ahora te has convertido en el #bSpearman#k. El lancero usa el poder de la oscuridad para eliminar a los enemigos, siempre en las sombras... Por favor, cree en ti mismo y en tu asombroso poder a medida que avanzas en tu viaje. Te ayudaré a ser mucho más fuerte de lo que eres ahora.");
            }
            if (cm.getJobId() != job) {
                cm.changeJobById(job);
            }
        } else if (status == 4) {
            cm.sendNextPrev("Acabo de darte un libro que te da la lista de habilidades que puedes adquirir como" + (job == 110 ? "combatiente" : job == 120 ? "página" : "lancero") + ". Además, su inventario, etc. se ha ampliado al agregarle otra fila. Tu HP y MP máximos también han aumentado. Ve a comprobarlo y compruébalo tú mismo.");
        } else if (status == 5) {
            cm.sendNextPrev("También te he dado un poquito de#bSP#k. Abre el#bMenú de habilidades#kubicado en la esquina inferior izquierda. Podrás mejorar las nuevas habilidades adquiridas de segundo nivel. Sin embargo, una palabra de advertencia. No puedes potenciarlos todos a la vez. Algunas de las habilidades sólo están disponibles después de haber aprendido otras habilidades. Asegúrate de recordar eso.");
        } else if (status == 6) {
            cm.sendNextPrev((job == 110 ? "Combatiente" : job == 120 ? "Página" : "Lancero") + "hay que ser fuerte. Pero recuerda que no puedes abusar de ese poder y usarlo con un debilucho. Por favor, usa tu enorme poder de la manera correcta, porque... para que lo uses de la manera correcta, eso es mucho más difícil que simplemente hacerte más fuerte. Por favor, encuéntrame después de haber avanzado mucho más. Te estaré esperando.");
        }
    } else if (actionx["3thJobI"]) {
        if (status == 0) {
            if (cm.getPlayer().gotPartyQuestItem("JB3")) {
                cm.getPlayer().removePartyQuestItem("JB3");
                cm.getPlayer().setPartyQuestItemObtained("JBP");
            }
            cm.sendNextPrev("Mi otro yo es bastante fuerte. Utiliza muchas habilidades especiales y debes luchar con él 1 contra 1. Sin embargo, la gente no puede permanecer mucho tiempo en el pasaje secreto, por lo que es importante vencerlo lo antes posible. Bueno... Buena suerte. Espero que me traigas#b#t4031059##ka mí.");
        }
    } else if (actionx["3thJobC"]) {
        cm.getPlayer().removePartyQuestItem("JBP");
        cm.gainItem(4031059, -1);
        cm.gainItem(4031057, 1);
        cm.dispose();
    }
}

/* 3th Job Part
	PORTAL 20 MINUTES.
 */