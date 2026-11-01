/*
   NPC Name: 		Divine Bird
   Map(s): 		Erev
   Description: 		3rd job KoC Buff
*/

function start() {
    const GameConstants = Java.type('constants.game.GameConstants');
    if (cm.getPlayer().isCygnus() && GameConstants.getJobBranch(cm.getJob()) > 2) {
        cm.useItem(2022458);
        cm.sendOk("Déjame darte mis bendiciones, mi Caballero. Por favor proteja el mundo de Maple....");
    } else {
        cm.sendOk("No dejes de entrenar. Se requiere cada gramo de tu energía para proteger el mundo de Maple....");
    }

    cm.dispose();
}