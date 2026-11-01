/**
 *9201105 - Sage
 *@author Ronan
 */

function start() {
    if (cm.getMapId() == 610020005) {
        cm.sendOk("El Castillo Crimsonwood se encuentra justo delante; hoy has realizado una gran hazaña, te saludo. Atraviesa este bosque para entrar por las puertas de la Fortaleza.");
    } else {
        cm.sendOk("Hasta ahora tu progreso es espléndido, buen trabajo. Sin embargo, para llegar a la Fortaleza, debes afrontar y superar esta terrible experiencia, continúa.");
    }
    cm.dispose();
}
