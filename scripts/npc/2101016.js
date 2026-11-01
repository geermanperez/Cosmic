var arena;
var status = 0;

function start() {
    arena = cm.getPlayer().getAriantColiseum();
    if (arena == null) {
        cm.sendOk("¡Oye, no te vi en el campo durante la batalla en la arena! ¿Qué estás haciendo aquí?");
        cm.dispose();
        return;
    }

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            copns = arena.getAriantScore(cm.getPlayer());
            if (copns < 1 && !cm.getPlayer().isGM()) {
                cm.sendOk("¡Qué pena que no hayas conseguido ninguna joya!");
                cm.dispose();
            } else {
                cm.sendNext("Ok, veamos... Lo hiciste muy bien y trajiste #b" + copns + "#kjoyas que me encantan. Como has completado la partida, te recompensaré con una puntuación de Battle Arena de#b" + arena.getAriantRewardTier(cm.getPlayer()) + "agujas#k. Si quieres saber más sobre la puntuación de Battle Arena, habla con#b#p2101015##k.");
            }
        } else if (status == 1) {
            //cm.warp(980010020, 0);
            copns = arena.getAriantRewardTier(cm.getPlayer());
            arena.clearAriantRewardTier(cm.getPlayer());
            arena.clearAriantScore(cm.getPlayer());
            cm.removeAll(4031868);

            cm.getPlayer().gainExp(92.7 * cm.getPlayer().getExpRate() * copns, true, true);
            cm.getPlayer().gainAriantPoints(copns);
            cm.sendOk("¡Está bien! ¡Hazme más joyas la próxima vez! ¡Jajajajaja!");
            cm.dispose();
        }
    }
}