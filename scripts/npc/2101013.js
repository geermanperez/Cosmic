/* Author: aaroncsn <MapleSea Like>
	NPC Name: 		Karcasa
	Map(s): 		The Burning Sands: Tents of the Entertainers(260010600)
	Description: 		Warps to Victoria Island
*/
var towns = [100000000, 101000000, 102000000, 103000000, 104000000];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.sendNext("Sí... ¿tienes miedo de la velocidad o de las alturas? ¿No puedes confiar en mis habilidades de vuelo? Créame, ¡he resuelto todos los problemas!");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            cm.sendNext("¡No sé cómo te enteraste de esto, pero viniste al lugar correcto! Para aquellos que deambularon por el desierto de Nihal y sienten nostalgia, les ofrezco un vuelo directo a Victorial Island, ¡sin escalas! No te preocupes por el barco volador: ¡sólo ha caído una o dos veces! ¿No te sientes claustrofóbico al estar en un largo vuelo en ese pequeño barco?");
        } else if (status == 1) {
            cm.sendYesNo("Por favor recuerda dos cosas. Primero, esta línea es en realidad para envíos al extranjero, así que#rNo puedo garantizar exactamente en qué ciudad aterrizarás.#k. Segundo, como te pondré en este vuelo especial, será un poco caro. El cargo por servicio es#e#b10.000 mesos#n#k. Hay un vuelo que está a punto de despegar. ¿Estás interesado en este vuelo directo?");
        } else if (status == 2) {
            cm.sendNext("Bien, listo para despegar ~");
        } else if (status == 3) {
            if (cm.getMeso() >= 10000) {
                cm.gainMeso(-10000);
                cm.warp(towns[Math.floor(Math.random() * towns.length)]);
            } else {
                cm.sendNextPrev("Oye, ¿te falta efectivo? Te dije que necesitarás#b10,000#kmesos para seguir con esto.");
                cm.dispose();
            }
        }
    }
}