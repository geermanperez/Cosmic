var item;
var status = -1;
var item;

function end(mode, type, selection) {
    if (mode == 0) {
        qm.dispose();
        return;
    }
    status++;

    if (status == 0) {
        qm.sendNext("Lo sabía... ¡Sabía que podías hacerlo rápidamente! ¡¡Hiciste bien tu trabajo la última vez y aquí estás de nuevo, ocupándote de tus asuntos!! Muy bien, ya que lo has hecho tan bien, debería recompensarte bien.#b#p1051000##kte está regalando un par de zapatos con la esperanza de ayudarte en tus futuros viajes.");
    } else if (status == 1) {
        const InventoryType = Java.type('client.inventory.InventoryType');
        if (qm.getPlayer().getInventory(InventoryType.EQUIP).getNumFreeSlot() < 1) {
            qm.sendOk("Libere un espacio de inventario EQUIP para recibir la recompensa.");
            qm.dispose();
            return;
        }

        var stance = qm.getPlayer().getJobStyle();

        const Job = Java.type('client.Job');
        if (stance == Job.WARRIOR) {
            item = 1072003;
        } else if (stance == Job.MAGICIAN) {
            item = 1072077;
        } else if (stance == Job.BOWMAN || stance == Job.CROSSBOWMAN) {
            item = 1072081;
        } else if (stance == Job.THIEF) {
            item = 1072035;
        } else if (stance == Job.BRAWLER || stance == Job.GUNSLINGER) {
            item = 1072294;
        } else {
            item = 1072018;
        }

        qm.gainItem(item, 1);
        qm.gainItem(4000007, -150);
        qm.gainExp(2200);
        qm.completeQuest();

        qm.sendOk("Muy bien, si necesitas trabajo en algún momento, no dudes en volver a verme. Esta ciudad seguramente necesita ayuda de una persona como tú~");
    } else if (status == 2) {
        qm.dispose();
    }
}