function enter(pi) {
    var eim = pi.getEventInstance();
    var reg = 0;

    // Lock removed: multiple players can enter the same room simultaneously
    pi.playPortalSound();
    pi.warp(926110301 + reg, 0); //next
    return true;
}