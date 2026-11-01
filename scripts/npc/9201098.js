/**
 *9201098 - Lukan
 *@author Ronan
 */

function start() {
    if (cm.getQuestStatus(8223) == 2) {
        if (cm.haveItem(3992041)) {
            cm.sendOk("Nosotros, los defensores de Antaño, nos estamos reuniendo actualmente en el Sactum Interior dentro de la Fortaleza, a punto de iniciar una ofensiva contra los Maestros Retorcidos y su ejército. Únase a nosotros allí en cualquier momento.");
        } else {
            if (!cm.canHold(3992041)) {
                cm.sendOk("Por favor, prepare una ranura en su SETUP para la clave que tengo que darle. Es fundamental entrar al Santuario Interior, dentro de la Torre del Homenaje.");
            } else {
                cm.sendOk("Entonces perdiste tu llave, ¿verdad? Muy bien, te haré otro, pero no lo pierdas otra vez. Es fundamental entrar al Santuario Interior, dentro de la Torre del Homenaje.");
                cm.gainItem(3992041, 1);
            }
        }
    } else {
        cm.sendOk("Oh, valiente aventurero. La casa Stormcasters, a la que pertenezco, protege los alrededores de Yore, este paisaje, de las fuerzas de la guardia de los Maestros Retorcidos que diariamente amenazan a los ciudadanos. Por favor ayúdanos en la defensa de Yore.");
    }

    cm.dispose();
}
