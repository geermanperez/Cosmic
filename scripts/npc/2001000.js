/*
 *  Cliff - Happy Ville NPC
 */

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status > 0) {
            status--;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        cm.sendNext("¿Ves un montón de muñecos de nieve por ahí? Ve a hablar con uno de ellos y te llevará al famoso árbol de Navidad que es simplemente enorme. El árbol se puede decorar con varios tipos de adornos. ¿Qué opinas? Suena divertido, ¿verdad?");
    } else if (status == 1) {
        cm.sendNextPrev("Sólo 6 pueden estar en el lugar donde está el árbol a la vez, y no puedes#bcomercio o tienda abierta#kallá. Los adornos que dejas caer solo los puedes recoger tú mismo, así que no te preocupes por perderlos aquí.");
    } else if (status == 2) {
        cm.sendNextPrev("Por supuesto, los elementos que se dejan caer allí nunca desaparecerán. Una vez que salgas de allí a través del muñeco de nieve que hay dentro, todos los elementos que hayas dejado caer en ese mapa volverán a ti, por lo que no tendrás que recogerlos todos antes de abandonar el lugar. ¿No es dulce?");
    } else if (status == 3) {
        cm.sendPrev("Bueno, entonces ve a ver #p2002001#, compra algunos adornos navideños allí y luego decora el árbol con esos ~ ¡Oh, sí! A él no se le puede comprar el adorno más grande ni el más hermoso. Probablemente... haya sido tomado por un monstruo... eh, eh...");
        cm.dispose();
    }
}