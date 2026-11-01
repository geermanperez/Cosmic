var status = -1;
var exchangeItem = 4000437;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendSimple("Tantas heridas, tan poca medicina...#b\r\n#L0#Oye, toma estas esporas negras. Puedes hacer mejores medicinas con ellos.#l");
    } else if (status == 1) {
        if (!cm.haveItem(exchangeItem, 100)) {
            cm.sendNext("No tienes suficiente... necesito al menos 100.");
            cm.dispose();
        } else {
            cm.sendGetNumber("¡Oye, es una buena idea! Puedo darte #i4310000#Paso perfecto por cada 100 #i" + exchangeItem + "##t" + exchangeItem + "# me das. ¿Cuantos quieres? (Artículos actuales:" + cm.itemQuantity(exchangeItem) + ")", Math.min(300, cm.itemQuantity(exchangeItem) / 100), 1, Math.min(300, cm.itemQuantity(exchangeItem) / 100));
        }
    } else if (status == 2) {
        if (selection >= 1 && selection <= cm.itemQuantity(exchangeItem) / 100) {
            if (!cm.canHold(4310000, selection)) {
                cm.sendOk("Deje algo de espacio en la pestaña ETC.");
            } else {
                cm.gainItem(4310000, selection);
                cm.gainItem(exchangeItem, -(selection * 100));
                cm.sendOk("¡Gracias!");
            }
        }
        cm.dispose();
    }
}