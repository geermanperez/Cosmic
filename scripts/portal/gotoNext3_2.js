function enter(pi) {
    pi.playPortalSound();
    var pName = "" + pi.getPortal().getName();
    if (pName === "out01") {
        pi.warp(211060610, "in00");
    } else {
        pi.warp(211060700, "west00");
    }
    return true;
}
