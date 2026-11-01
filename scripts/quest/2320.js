/* ===========================================================
        @author Resonance
	NPC Name: 		Scarrs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  A Friendship with Bruce
=============================================================
Version 1.0 - Script Done.(18/7/2010)
=============================================================
*/

var status = -1;

function start(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.sendOk("Quería que le dieras personalmente esta buena noticia a #bBruce#k, pero entiendo si estás ocupado.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Sólo tengo una petición más para ti. ¿Quieres escuchar?");
    } else if (status == 1) {
        qm.forceStartQuest();
        qm.gainItem(4032389, 1);
        qm.sendOk("Para ser honesto, estos#bEsporas de hongos asesinos#kNo estoy completamente fuera de mi propio trabajo. Te acuerdas#bBruce#k de#bHenesys#k? He sido amigo de él desde la infancia y#bEsporas de hongos asesinos#kSe completó después de que compartió conmigo los resultados de sus estudios. Todo esto fue gracias a él, así que me gustaría que le dieras esto de mi parte.");
    } else if (status == 2) {
        qm.dispose();
    }
}

function end(mode, type, selection) {
    status++;
    if (mode != 1) {
        if (type == 1 && mode == 0) {
            status -= 2;
        } else {
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendOk("¡Oh! Estás aquí en nombre de#bScarrs#k?\r\n\r\n#fUI/UIWindow.img/QuestIcon/4/0#\r\n#fUI/UIWindow.img/QuestIcon/8/0# 8800 exp");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(8800);
        qm.gainItem(4032389, -1);
        qm.sendOk("Ahh, entonces este es el#bEsporas de hongos asesinos#ken el que estuve trabajando en el pasado. Me costó mucho reunir los ingredientes, así que lo dejé solo en teoría, pero él pudo completarlo, con una muestra para mostrar también. Por favor dígale que aprecio su buen trabajo.");
    } else if (status == 2) {
        qm.dispose();
    }
}
	