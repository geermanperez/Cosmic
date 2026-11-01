/* ===========================================================
        @author Resonance
	NPC Name: 		Minister of Home Affairs
	Map(s): 		Mushroom Castle: Corner of Mushroom Forest(106020000)
	Description: 	Quest -  Exploring Mushroom Forest(1)
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
            qm.sendNext("Por favor, no pierdas la fe en nuestro Reino Champiñón.");
            qm.dispose();
            return;
        }
    }
    if (status == 0) {
        qm.sendAcceptDecline("Para rescatar a la princesa, primero debes navegar por el Bosque de Hongos. El rey Pepe levantó una poderosa barrera que prohibía a cualquiera entrar al castillo. Por favor investigue este asunto por nosotros.");
    } else if (status == 1) {
        qm.sendNext("Te toparás con la barrera en el Bosque de Hongos dirigiéndote al este de donde estás parado ahora. Por favor tenga cuidado. He oído que la zona está infestada de monstruos locos que inducen miedo.");
    } else if (status == 2) {
        //qm.forceStartQuest();
        //qm.forceStartQuest(2314,"1");
        qm.gainExp(8300);
        qm.sendOk("Ya veo, entonces de hecho no era una barrera regular de ninguna manera. Gran trabajo allí. Si no fuera por su ayuda, no hubiéramos tenido ni idea de de qué se trataba.");
        qm.forceCompleteQuest();
    } else if (status == 3) {
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
        qm.sendOk("Veo que has investigado a fondo la barrera en el Bosque de Hongos. ¿Cómo fue?");
    } else if (status == 1) {
        qm.forceCompleteQuest();
        qm.gainExp(8300);
        qm.sendOk("Ya veo, entonces de hecho no era una barrera regular de ninguna manera. Gran trabajo allí. Si no fuera por su ayuda, no hubiéramos tenido ni idea de de qué se trataba.");
    } else if (status == 2) {
        qm.dispose();
    }
}
	