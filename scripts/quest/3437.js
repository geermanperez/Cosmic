var item;
var stance;
var status = -1;
var item;

function end(mode, type, selection) {
    if (mode == 0) {
        qm.dispose();
        return;
    }
    status++;

    if (status == 0) {
        qm.sendNext("¿Qué? ¿Me estás diciendo que ya has sacado 150 #o4230120#? Y estos... sí, estos realmente son 120 #t4000122#. Me preguntaba cómo ibas a completar esta misión tú solo, pero lo hiciste muy bien. Muy bien, toma... este es un artículo muy importante para mí, pero por favor tómalo.");
    } else if (status == 1) {
        const InventoryType = Java.type('client.inventory.InventoryType');
        if (qm.getPlayer().getInventory(InventoryType.EQUIP).getNumFreeSlot() < 1) {
            qm.sendOk("Libere un espacio de inventario EQUIP para recibir la recompensa.");
            qm.dispose();
            return;
        }

        var talkStr = "Do you like the glove? I've kept this for a while, and I was planning on using it someday, but it looks much better on you. Please put it to good use; besides, I got so much stuff from the Sector, that I don't need it anymore.";
        stance = qm.getPlayer().getJobStyle();

        const Job = Java.type('client.Job');
        if (stance == Job.WARRIOR) {
            item = 1082024;
        } else if (stance == Job.MAGICIAN) {
            item = 1082063;
        } else if (stance == Job.BOWMAN || stance == Job.CROSSBOWMAN) {
            item = 1082072;
        } else if (stance == Job.THIEF) {
            item = 1082076;
        } else if (stance == Job.BRAWLER || stance == Job.GUNSLINGER) {
            item = 1082195;
        } else {
            item = 1082149;
        }

        qm.sendNext(talkStr);
    } else if (status == 2) {
        qm.completeQuest();
        qm.gainItem(item, 1);
        qm.gainItem(4000122, -120);
        qm.gainExp(6100);
        qm.sendOk("Muchas gracias por cumplir tus misiones como uno de los Mesorangers. Le he contado al Sector tu exitosa historia y el Sector parece estar muy satisfecho contigo también. Ojalá sigas trabajando con nosotros. Adiós~");
    } else if (status == 3) {
        qm.dispose();
    }
}