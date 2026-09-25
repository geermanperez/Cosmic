function enter(pi) {
    pi.playPortalSound();
    if (pi.getPlayer().getMapId() === 211060400) {
        pi.warp(211060401, "down00");
    } else {
        pi.warp(211060400, "up00");
    }
    return true;
}
