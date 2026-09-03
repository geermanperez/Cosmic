function start(ms) {
    if (!ms.getPlayer().isGM()) {
        ms.getPlayer().dropMessage(1, "El mapa 970030000 se encuentra deshabilitado.");
        ms.warp(100000000, 0);
    }
}
