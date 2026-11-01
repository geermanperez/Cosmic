/* @Author SharpAceX
*/

function start() {
    switch (cm.getPlayer().getMapId()) {
        case 610030500:
            cm.sendOk("Como todo ladrón sabe, el mejor ataque es el que nunca ves venir. Entonces, para ilustrar mejor esto, estarás en una cámara con plataformas y repisas a las que solo podrás acceder con Prisa, así como Ojos que todo lo ven que tu daga o garra deben cerrar, de forma permanente. Después de que todos los ojos que todo lo ven hayan sido eliminados, ¡consigue la estatua del ladrón y reclama la garra primordial! ¡Buena suerte!");
            break;
        case 610030000:
            cm.sendOk("Una vez conocido como el \"Príncipe de las Sombras\", el Gran Maestro Ryo poseía una velocidad y un poder supremos con dagas de corto alcance y una garra en forma de cadena más larga. Miembro a tiempo parcial de los Bosshunters, era famoso por su capacidad incomparable para mezclarse con la noche misma. Su leyenda creció durante una batalla con Crimson Balrog, donde se movía tan rápido que los ataques de Balrog sólo tomaban aire. Ryo también realizó \"recuperaciones\" ocasionales para aquellos menos afortunados que él.");
            break;
        case 610030530:
            if (cm.isAllReactorState(6108004, 1)) {
                var eim = cm.getEventInstance();
                var stgStatus = eim.getIntProperty("glpq5_room");
                var jobNiche = cm.getPlayer().getJob().getJobNiche();

                if ((stgStatus >> jobNiche) % 2 == 0) {
                    if (cm.canHold(4001256, 1)) {
                        cm.gainItem(4001256, 1);
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
                cm.sendOk("Ve ahora, destruye todos los ojos vigilantes con tus habilidades de movilidad, compañero ladrón. Infórmame cuando hayas terminado.");
            }
            break;
    }
    cm.dispose();
}