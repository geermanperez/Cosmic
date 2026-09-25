function enter(pi) {
    pi.playPortalSound();
    if (pi.getPlayer().getMapId() === 211060200) {
        pi.warp(211060201, "down00");
    } else {
        pi.warp(211060200, "up00");
    }
    return true;
}
