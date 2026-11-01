/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Joko <Crimsonwood Exchange Quest> - Phantom Forest: Dead Man's Gorge(610010004)
 -- By ---------------------------------------------------------------------------------------------
 Ronan Lana
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Ronan Lana
 ---------------------------------------------------------------------------------------------------
 **/

var status = 0;
var eQuestChoices = [4032007, 4032006, 4032009, 4032008, 4032007, 4032006, 4032009, 4032008];

var eQuestPrizes = [];

eQuestPrizes[0] = [[1002801, 1],  // Raven Ninja Bandana
    [1462052, 1],	// Raven's Eye
    [1462006, 1], 	// Silver Crow
    [1462009, 1],	// Gross Jaeger
    [1452012, 1],	// Marine Arund
    [1472031, 1],        // Black Mamba
    [2044701, 1],        // Claw for ATT 60%
    [2044501, 1],        // Bow for ATT 60%
    [3010041, 1],        // Skull Throne
    [0, 750000]];       // Mesos

eQuestPrizes[1] = [[1332077, 1],  // Raven's Beak
    [1322062, 1],	// Crushed Skull
    [1302068, 1], 	// Onyx Blade
    [4032016, 1],        // Tao of Sight
    [2043001, 1],        // One Handed Sword for Att 60%
    [2043201, 1],        // One Handed BW for Att 60%
    [2044401, 1],        // Polearm for Att 60%
    [2044301, 1],        // Spear for Att 60%
    [3010041, 1],        // Skull Throne
    [0, 1250000]];       // Mesos

eQuestPrizes[2] = [[1472072, 1],   //Raven's Claw
    [1332077, 1],	// Raven's Beak
    [1402048, 1], 	// Raven's Wing
    [1302068, 1],        // Onyx Blade
    [4032017, 1],        // Tao of Harmony
    [4032015, 1],        // Tao of Shadows
    [2043023, 1],        // One-Handed Sword for Att 100%[2]
    [2043101, 1],        // One-Handed Axe for Att 60%
    [2043301, 1],        // Dagger for Att 60%
    [3010040, 1],        // The Stirge Seat
    [0, 2500000]];       // Mesos

eQuestPrizes[3] = [[1002801, 1],   //Raven Ninja Bandana
    [1382008, 1],	// Kage
    [1382006, 1], 	// Thorns
    [4032016, 1],        // Tao of Sight
    [4032015, 1],        // Tao of Shadows
    [2043701, 1],        // Wand for Magic Att 60%
    [2043801, 1],        // Staff for Magic Att 60%
    [3010040, 1],        // The Stirge Seat
    [0, 1750000]];       // Mesos

eQuestPrizes[4] = new Array([0, 3500000]);	// Mesos
eQuestPrizes[5] = new Array([0, 3500000]);	// Mesos
eQuestPrizes[6] = new Array([0, 3500000]);	// Mesos
eQuestPrizes[7] = new Array([0, 3500000]);	// Mesos

var requiredItem = 0;
var lastSelection = 0;
var prizeItem = 0;
var prizeQuantity = 0;
var itemSet;
var qnt;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.sendOk("Hmmm... no debería ser un mal negocio para ti. Ven a verme en el momento adecuado y es posible que te ofrezcamos un artículo mucho mejor. De todos modos, avíseme si cambia de opinión.");
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) { // first interaction with NPC
        if (cm.getQuestStatus(8225) != 2) {
            cm.sendNext("Oye, no soy un bandido, ¿vale?");
            cm.dispose();
            return;
        }

        cm.sendNext("Oye, ¿tienes un poco de tiempo? Bueno, mi trabajo es recolectar artículos aquí y venderlos en otros lugares, pero estos días los monstruos se han vuelto mucho más hostiles por lo que ha sido difícil conseguir buenos artículos... ¿Qué opinas? ¿Quieres hacer algún negocio conmigo?");
    } else if (status == 1) {
        cm.sendYesNo("El trato es sencillo. Tú me consigues algo que necesito, yo te consigo algo que necesitas. El problema es que trato con un montón de personas, por lo que los artículos que tengo para ofrecer pueden cambiar cada vez que me ves. ¿Qué opinas? ¿Aún quieres hacerlo?");
    } else if (status == 2) {
        var eQuestChoice = makeChoices(eQuestChoices);
        cm.sendSimple(eQuestChoice);
    } else if (status == 3) {
        lastSelection = selection;
        requiredItem = eQuestChoices[selection];

        if (selection < 4) {
            qnt = 50;
        } else {
            qnt = 25;
        }

        cm.sendYesNo("A ver, quieres cambiar tu #b" + qnt + " #t" + requiredItem + "##k con mis cosas, ¿no? Antes de operar, asegúrese de tener un espacio vacío disponible en su inventario de uso o etc. Ahora, ¿quieres comerciar conmigo?");
    } else if (status == 4) {
        itemSet = (Math.floor(Math.random() * eQuestPrizes[lastSelection].length));
        reward = eQuestPrizes[lastSelection];
        prizeItem = reward[itemSet][0];
        prizeQuantity = reward[itemSet][1];
        if (!cm.haveItem(requiredItem, qnt)) {
            cm.sendOk("Hmmm... ¿estás seguro de que tienes #b?" + qnt + " #t" + requiredItem + "##k? Si es así, verifique si su inventario de artículos está lleno o no.");
        } else if (prizeItem == 0) {
            cm.gainItem(requiredItem, -qnt);
            cm.gainMeso(prizeQuantity);
            cm.sendOk("Para tu #b" + qnt + " #t" + requiredItem + "##k, aquí está#b" + prizeQuantity + "mesos#k. ¿Qué opinas? ¿Te gustaron los artículos que te di a cambio? Planeo estar aquí por un tiempo, así que si reúnes más artículos, siempre estaré abierto a un intercambio...");
        } else if (!cm.canHold(prizeItem)) {
            cm.sendOk("Su inventario de uso, etc. parece estar lleno. ¡Necesitas espacios libres para comerciar conmigo! Haz espacio y luego encuéntrame.");
        } else {
            cm.gainItem(requiredItem, -qnt);
            cm.gainItem(prizeItem, prizeQuantity);
            cm.sendOk("Para tu #b" + qnt + " #t" + requiredItem + "##k, aquí está mi#b" + prizeQuantity + " #t" + prizeItem + "##k. ¿Qué opinas? ¿Te gustaron los artículos que te di a cambio? Planeo estar aquí por un tiempo, así que si reúnes más artículos, siempre estaré abierto a un intercambio...");
        }
        cm.dispose();
    }
}

function makeChoices(a) {
    var result = "Ok! First you need to choose the item that you'll trade with. The better the item, the more likely the chance that I'll give you something much nicer in return.\r\n";
    var qnty = [50, 25];

    for (var x = 0; x < a.length; x++) {
        result += " #L" + x + "##v" + a[x] + "#  #b#t" + a[x] + "# #kx " + qnty[Math.floor(x / 4)] + "#l\r\n";
    }
    return result;
}