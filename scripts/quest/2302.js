/* ===========================================================
        @author Resonance
	NPC Name: 		Maple Administrator
	Description: 	Quest -  Kingdom of Mushroom in Danger
=============================================================
Version 1.0 - Script Done.(17/7/2010)
Version 2.0 - Script Reworked by Ronan - (16/11/2018)
=============================================================
*/

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            if (status != 3) {
                qm.sendOk("¿En realidad? Es un asunto urgente, así que si tienes tiempo, por favor visítame.");
                qm.dispose();
            } else {
                if (qm.canHold(4032375, 1)) {
                    qm.sendNext("Bueno. En ese caso, sólo te daré las rutas al Reino Champiñón.#bCerca de la entrada oeste de Henesys,#kencontrarás un#bcasa vacia#k. Ingrese a la casa y gire a la izquierda para ingresar.#b<Mazmorra temática: Castillo de los Hongos>#k. Esa es la entrada al Reino de los Hongos. ¡No hay mucho tiempo!");
                } else {
                    qm.sendOk("Tenga un espacio disponible en su inventario de Etc.");
                    qm.dispose();
                }
            }

            status++;
        } else {
            if (mode == 1) {
                status++;
            } else {
                status--;
            }

            if (status == 0) {
                qm.sendAcceptDecline("Ahora que ha logrado el avance laboral, parece que está listo para esto. Tengo algo y me gustaría pedirles ayuda. ¿Estás dispuesto a escuchar?");
            } else if (status == 1) {
                qm.sendNext("Lo que pasó es que el#bReino de los Hongos#kactualmente está en desorden. Kingdom of Mushroom se encuentra cerca de Henesys y presenta al inteligente y amante de la paz King Mush. Recientemente comenzó a sentirse mal, por lo que decidió nombrar a su única hija.#bprincesa violeta#k. Algo debe haber sucedido desde entonces para que el reino se encuentre en su estado actual.");
            } else if (status == 2) {
                qm.sendNext("No conozco los detalles exactos, pero es obvio que algo terrible había ocurrido, así que creo que será mejor que vayas allí y evalúes los daños tú mismo. Un explorador como tú parece más que capaz de salvar el Reino Champiñón. Te acabo de escribir un#bcarta de recomendacion#k, así que te sugiero que vayas al Reino de los Hongos inmediatamente y busques el#bOficial jefe de patrulla#k.\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#v4032375# #t4032375#");
            } else if (status == 3) {
                qm.sendYesNo("Por cierto, ¿sabes dónde se encuentra el Reino Champiñón? Estará bien si puedes encontrar el camino hasta allí, pero si no te importa, puedo llevarte directamente a la entrada.");
            } else if (status == 4) {
                if (qm.canHold(4032375, 1)) {
                    if (!qm.haveItem(4032375, 1)) {
                        qm.gainItem(4032375, 1);
                    }

                    qm.warp(106020000, 0);
                    qm.forceStartQuest();
                } else {
                    qm.sendOk("Tenga un espacio disponible en su inventario de Etc.");
                }

                qm.dispose();

            } else if (status == 5) {
                if (!qm.haveItem(4032375, 1)) {
                    qm.gainItem(4032375, 1);
                }

                qm.forceStartQuest();
                qm.dispose();

            }
        }
    }
}

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (!qm.haveItem(4032375, 1)) {
                qm.sendNext("¿Qué quieres, mmm?");
                qm.dispose();
                return;
            }

            qm.sendNext("¿Mmm? ¿Es eso un#bcarta de recomendacion del instructor de trabajo#k??! ¿Qué es esto? ¿Eres tú quien vino a salvarnos, el Reino Champiñón?");
        } else if (status == 1) {
            qm.sendNextPrev("Mmm... está bien. Dado que la carta es del instructor laboral, supongo que realmente eres tú. Pido disculpas por no presentarme ante ustedes antes. yo soy el#bOficial jefe de seguridad#kencargado de proteger al Rey Mush. Como puedes ver, este escondite temporal está protegido por el equipo de seguridad y soldados. Nuestra situación puede ser terrible, pero aun así, bienvenidos al Reino Champiñón.");
        } else if (status == 2) {
            qm.gainItem(4032375, -1);
            qm.gainExp(6000);
            qm.forceCompleteQuest();
            qm.forceStartQuest(2312);
            qm.dispose();
        }
    }
}