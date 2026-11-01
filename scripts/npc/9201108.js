/* @Author SharpAceX
*/

function start() {
    if (cm.getPlayer().getMapId() == 610030500) {
        cm.sendOk("Una criatura legendaria conocida como Master Guardian te espera. Ridley una vez experimentó con un Crimson Guardian, lo que resultó en que se volviera altamente resistente a ataques mágicos, lanzas, mazas, todo, excepto flechas disparadas con un poder excepcional. ¡Arqueros y mujeres! Como maestros indiscutibles del arco y la flecha, debes usar tus ataques más poderosos, desde Strafe hasta Hurricane y Piercing Arrow para destruir esta poderosa criatura y llegar a la estatua del Bowman para reclamar el arco ancestral. ¡Buena suerte!");
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 610030000) {
        cm.sendOk("Lockewood, uno de los únicos arqueros sagrados conocidos, es uno de los héroes más famosos de la Fortaleza. De particular interés es su púa de batalla blanca y dorada personalizada, que se dice que está bendecida por una diosa poderosa. Su puntería era tremendamente precisa a largas distancias. Temido y respetado por su 'Genesis Arrow' y su 'Doom Phoenix', una vez derribó a seis Typhons del Valle de los Héroes.");
        cm.dispose();
    } else if (cm.getPlayer().getMapId() == 610030540) {
        if (cm.getPlayer().getMap().countMonsters() == 0) {
            var eim = cm.getEventInstance();
            var stgStatus = eim.getIntProperty("glpq5_room");
            var jobNiche = cm.getPlayer().getJob().getJobNiche();

            if ((stgStatus >> jobNiche) % 2 == 0) {
                if (cm.canHold(4001258, 1)) {
                    cm.gainItem(4001258, 1);
                    cm.sendOk("Buen trabajo.");

                    stgStatus += (1 << jobNiche);
                    eim.setIntProperty("glpq5_room", stgStatus);
                } else {
                    cm.sendOk("Primero haga espacio en su inventario ETC.");
                }
            } else {
                cm.sendOk("El arma dentro de esta habitación ya ha sido recuperada.");
            }
        } else {
            cm.sendOk("Elimina a todos los Maestros Guardianes.");
        }
        cm.dispose();
    }
}