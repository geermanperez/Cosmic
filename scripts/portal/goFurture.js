function enter(pi) {
    if (pi.getPlayer().getLevel() < 160) {
        pi.playerMessage(5, "You must be at least level 160 to enter Gate to the Future.");
        return false;
    }
    pi.playPortalSound();
    pi.warp(271000000, "out00");
    return true;
}
