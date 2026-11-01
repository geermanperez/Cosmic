/* @Author SharpAceX
*/

function start() {
    if (cm.getPlayer().getMapId() == 610030500) {
        cm.sendOk("Fuerza y ​​poder increíbles, cualquiera puede lograrlo. Pero lo que hace especial a un guerrero es su voluntad de hierro. Sin importar las probabilidades, un verdadero guerrero sigue adelante hasta asegurar la victoria. Por lo tanto, la Cámara del Guerrero es un camino brutal donde la propia sala está en tu contra, así como los monstruos ultrafuertes que hay dentro. Usa tus habilidades para librarte de los efectos y derrotar a los monstruos que hay dentro para llegar a la Estatua del Guerrero y reclamar la Espada Maestra. ¡Buena suerte!");
        cm.dispose();
    } else if (cm.getPlayer().getMap().getId() == 610030000) {
        cm.sendOk("Una familia legendaria de héroes, los de Vrisiens son los fundadores originales de los Stormcasters. La familia es única, ya que cada hijo o hija hereda todas las técnicas de lucha de sus antepasados. Esta habilidad ha demostrado ser inmensamente útil; ya que permite estrategias, improvisación y tácticas casi ilimitadas para derrotar a todos los enemigos. Una verdadera familia para las generaciones.");
        cm.dispose();
    } else if (cm.getPlayer().getMapId() == 610030510) {
        if (cm.getPlayer().getMap().countMonsters() == 0) {
            var eim = cm.getEventInstance();
            var stgStatus = eim.getIntProperty("glpq5_room");
            var jobNiche = cm.getPlayer().getJob().getJobNiche();

            if ((stgStatus >> jobNiche) % 2 == 0) {
                if (cm.canHold(4001259, 1)) {
                    cm.gainItem(4001259, 1);
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
            cm.sendOk("Elimina a todos los Guardianes Carmesí.");
        }
        cm.dispose();
    }
}