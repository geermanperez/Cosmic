/*
        @author RMZero213 (RaGEZONE)
	Just keep this header here and don't claim that you made it.
*/

/*
	1032102.js
	Mar the Fairy
	Dragon Evolver
*/

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.sendOk("Muy bien, nos vemos la próxima vez.");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendYesNo("Soy Mar el Hada. Si tienes un dragón de nivel 15 o superior y una roca de evolución, puedo evolucionar tu dragón. Si tienes suerte, ¡puede que incluso consigas uno negro! ¿Quieres que lo haga?");
        } else if (status == 1) {
            if (cm.haveItem(5000028, 1)) {
                cm.gainItem(5000028, -1);
                cm.gainItem(5000029, 1);
                cm.sendOk("¡No sé cómo conseguiste ese huevo, pero aparentemente ha eclosionado!");
                cm.dispose();
            } else if (cm.getPlayer().getPet(0) == null) {
                cm.sendOk("Asegúrate de que tu mascota esté equipada en la ranura 1.");
                cm.dispose();
            } else if (cm.getPlayer().getPet(0).getItemId() < 5000029 || cm.getPlayer().getPet(0).getItemId() > 5000033 || !cm.haveItem(5380000, 1)) {
                cm.sendOk("No cumples con los requisitos. necesitas#i5380000##t5380000#, así como cualquiera de#d#i5000029##t5000029##k, #g#i5000030##t5000030##k, #r#i5000031##t5000031##k, #b#i5000032##t5000032##k, o#e#i5000033##t5000033##nequipado en la ranura 1. Vuelve cuando lo hagas.");
                cm.dispose();
            } else if (cm.getPlayer().getPet(0).getLevel() < 15) {
                cm.sendOk("Tu mascota debe tener nivel 15 o superior para evolucionar.");
                cm.dispose();
            } else if (cm.haveItem(5000029, 2) || cm.haveItem(5000030, 2) || cm.haveItem(5000031, 2) || cm.haveItem(5000032, 2) || cm.haveItem(5000033, 2)) {
                cm.sendSimple("Tienes un dragón que no está afuera, y también un dragón que está afuera. Puedo quitarte uno. Recuerda que los datos del dragón que estoy eliminando se perderán.\r\n#r#L0#Retire mi primera ranura en EFECTIVO.#l#k\r\n#b#L1#Elimina el primer dragón de mi inventario.#l#k\r\n#g#L2#No, gracias.#l#k");
            } else {
                var i;

                for (i = 0; i < 3; i++) {
                    if (cm.getPlayer().getPet(i) != null && cm.getPlayer().getPet(i).getItemId() == 5000029) {
                        pet = cm.getPlayer().getPet(i);
                        break;
                    }
                }
                if (i == 3) {
                    cm.sendOk("O no tienes un dragón como mascota listo para evolucionar o te falta#b#t5380000##k.");
                    cm.dispose();
                    return;
                }

                var id = cm.getPlayer().getPet(i).getItemId();
                //var name = cm.getPlayer().getPet(i).getName();
                //var level = cm.getPlayer().getPet(i).getLevel();
                //var closeness = cm.getPlayer().getPet(i).getCloseness();
                //var fullness = cm.getPlayer().getPet(i).getFullness();
                //ItemInformationProvider ii = ItemInformationProvider.getInstance();
                if (id < 5000029 || id > 5000033) {
                    cm.sendOk("Algo anda mal, inténtalo de nuevo.");
                    cm.dispose();
                }
                var rand = 1 + Math.floor(Math.random() * 10);
                var after = 0;
                if (rand >= 1 && rand <= 3) {
                    after = 5000030;
                } else if (rand >= 4 && rand <= 6) {
                    after = 5000031;
                } else if (rand >= 7 && rand <= 9) {
                    after = 5000032;
                } else if (rand == 10) {
                    after = 5000033;
                } else {
                    cm.sendOk("Ocurre algo. Intentar otra vez.");
                    cm.dispose();
                }

                /*if (name.equals(ItemInformationProvider.getInstance().getName(id))) {
     name = ItemInformationProvider.getInstance().getName(after);
}*/

                cm.gainItem(5380000, -1);
                cm.evolvePet(i, after);

                cm.sendOk("¡¡Tu dragón ahora ha evolucionado!! Solía ​​ser un #i" + id + "# #t" + id + "#, y ahora es un #i" + after + "# #t" + after + "#!");
                cm.dispose();
            }
        } else if (status == 2) {
            if (selection == 0) {
                const InventoryManipulator = Java.type('client.inventory.manipulator.InventoryManipulator');
                const InventoryType = Java.type('client.inventory.InventoryType');
                InventoryManipulator.removeFromSlot(cm.getClient(), InventoryType.CASH, 1, 1, true);
                cm.sendOk("Se elimina su primer espacio en efectivo.");
            } else if (selection == 1) {
                if (cm.haveItem(5000029, 2)) {
                    cm.gainItem(5000029, -1);
                } else if (cm.haveItem(5000030, 2)) {
                    cm.gainItem(5000030, -1);
                } else if (cm.haveItem(5000031, 2)) {
                    cm.gainItem(5000031, -1);
                } else if (cm.haveItem(5000032, 2)) {
                    cm.gainItem(5000032, -1);
                } else if (cm.haveItem(5000033, 2)) {
                    cm.gainItem(5000033, -1);
                }
                cm.sendOk("Se elimina el primer dragón de tu inventario.");
            } else if (selection == 2) {
                cm.sendOk("Está bien, vuelve la próxima vez.");
            }
            cm.dispose();
        }
    }
}