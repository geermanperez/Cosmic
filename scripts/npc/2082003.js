function start() {
    cm.sendSimple("Si tuvieras alas, estoy seguro de que podrías ir allí.  Pero eso por sí solo no será suficiente.  Si quieres volar a través de un viento más afilado que una espada, también necesitarás escamas resistentes.  Soy el único Halfling que queda que conoce el camino de regreso... Si quieres ir allí, puedo transformarte.  No importa lo que seas, en este momento te convertirás en un#bDragon#k...\r\n #L0##bQuiero convertirme en un dragón.#k#l");
}

function action(m, t, s) {
    if (m > 0) {
        cm.useItem(2210016);
        cm.warp(200090500, 0);
    }
    cm.dispose();
}  