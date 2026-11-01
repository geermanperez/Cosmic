/* @Author SharpAceX
*/

function start() {
    if (cm.getPlayer().getMapId() == 610030500) {
        cm.sendOk("Como poderoso mago de élite, Ridly conocía el valor de la inteligencia, la cualidad distintiva de un mago. Por lo tanto, la Cámara de Magos es un laberinto retorcido de concepción tortuosa: la habilidad Teletransporte es la única habilidad que puedes usar dentro para moverte, y Garra Mágica es la única habilidad que romperá las estatuas. También debes matar a numerosos monstruos que se encuentran dentro. Después de resolver el laberinto y derrotar a todos los enemigos dentro de él, deduce qué estatua de mago esconde el Bastón de la Primera Magia y ábrelo para reclamarlo. ¡Buena suerte!");
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 610030000) {
        cm.sendOk("Un nombre siempre recordado, Rafael era un hechicero excepcionalmente hábil y el principal maestro de los poderes mágicos mentales, la telequinesis y la telepatía. Además de eso, era uno de los 'Magos de Élite' que dominaba todos los elementos. Fue visto por última vez buscando el 'Templo de los Elementales' para cambiar el rumbo contra el ejército invasor Krakian...");
        cm.dispose();
    } else if (cm.getPlayer().getMapId() == 610030521) {
        if (cm.getPlayer().getMap().countMonsters() == 0) {
            var eim = cm.getEventInstance();
            var stgStatus = eim.getIntProperty("glpq5_room");
            var jobNiche = cm.getPlayer().getJob().getJobNiche();

            if ((stgStatus >> jobNiche) % 2 == 0) {
                if (cm.canHold(4001257, 1)) {
                    cm.gainItem(4001257, 1);
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
            cm.sendOk("Elimina todos los monstruos.");
        }
        cm.dispose();
    } /* else if (cm.getPlayer().getMapId() == 610030522) {
                if (cm.getPlayer().getMap().countMonsters() == 0) {
                        cm.warp(610030522,0);
                } else {
                        cm.sendOk("Elimina todos los monstruos.");
                }
                cm.dispose();
        }
        */
}