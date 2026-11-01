/**
 *9201103 - Sage
 *@author Ronan
 */

function start() {
    if (cm.getLevel() >= 100) {
        cm.sendOk("Con frecuencia, aventureros como tú realizan expediciones dentro de Crimsonwood Keep, donde muchas personas de muchos grupos cooperan, resolviendo acertijos y derrotando enemigos fuertes, pudiendo obtener muchos premios en el proceso. Para encontrar más información sobre esto, ingrese al torreón en la habitación superior derecha.");
    } else {
        cm.sendOk("Dentro de Keep, se pueden formar expediciones para intentar el PQ de Crimsonwood Keep, que requiere arces de nivel 100 o más. Parece que aún no eres apto para intentarlo, entrena un poco más si quieres intentarlo.");
    }
    cm.dispose();
}
