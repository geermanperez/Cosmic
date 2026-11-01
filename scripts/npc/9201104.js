/**
 *9201104 - Sage
 *@author Ronan
 */

function start() {
    if (cm.getMapId() == 610020000) {
        cm.sendOk("Oh, valiente aventurero. Con solo llegar a este lugar, realmente te distingues entre las masas, felicidades. Sin embargo,#rprestar atención#k: en el camino que hay por delante, que conduce a la poderosa fortaleza de#bTorreón de Bosque Carmesí#k, #rMenhires mortales#kse despliegan como trampas para quienes no son conscientes de los peligros que se avecinan.#rUn golpe es suficiente para derribarte.#k, así que ten cuidado. Si su objetivo es llegar a la Fortaleza, siga el sendero con atención.");
    } else if (cm.getMapId() == 610020003) {
        cm.sendOk("Pareces digno ahora de recibir una pista de lo que te espera. Una vez dentro de la sala principal de la Fortaleza, asegúrate de recordar el diseño de la estatua que ves allí. Eso es todo.");
    } else if (cm.getMapId() == 610020004) {
        cm.sendOk("Pareces digno ahora de recibir una pista de lo que te espera. Los dispositivos conocidos como Sigils se activan mediante detección cuando algunas habilidades de ciertos trabajos se activan cerca, asegúrate de que tu equipo esté completo para cuando llegue el momento. Eso es todo.");
    } else {
        cm.sendOk("Hasta ahora tu progreso es espléndido, buen trabajo. Sin embargo, para llegar a la Fortaleza, debes afrontar y superar esta terrible experiencia, continúa.");
    }
    cm.dispose();
}
