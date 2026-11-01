/*
 * NPC : Francis (Doll master)
 * Map : 910510200
 */

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0 && type > 0) {
        cm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        cm.sendNext("Soy Francis, el Titiritero de las Alas Negras. ¿Cómo te atreves a molestar a mis títeres? Realmente me molesta, pero esta vez lo dejaré pasar. Sin embargo, si te pillo haciéndolo de nuevo, te juro en nombre del Mago Negro que te haré pagar por ello.", 9);
    } else if (status == 1) {
        cm.sendNextPrev("#b(¿Los Black Wings? ¿Eh? ¿Quiénes son? ¿Y cómo se relaciona todo esto con el Black Mage? Hm, tal vez deberías informar esta información a Tru).#k", 3);
    } else if (status == 2) {
        cm.completeQuest(21719);
        cm.warp(105040200, 10);//104000004 
        cm.dispose();
    }
}