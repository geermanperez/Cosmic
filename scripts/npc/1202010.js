var status = 0;

var spawnPnpc = false;
var spawnPnpcFee = 7000000;
var jobType = 21;

function start() {
    const GameConstants = Java.type('constants.game.GameConstants');
    if (parseInt(cm.getJobId() / 100) == jobType && cm.canSpawnPlayerNpc(GameConstants.getHallOfFameMapid(cm.getJob()))) {
        spawnPnpc = true;

        var sendStr = "You have walked a long way to reach the power, wisdom and courage you hold today, haven't you? What do you say about having right now #ra NPC on the Hall of Fame holding the current image of your character#k? Do you like it?";
        if (spawnPnpcFee > 0) {
            sendStr += " I can do it for you, for the fee of #b " + cm.numberWithCommas(spawnPnpcFee) + " mesos.#k";
        }

        cm.sendYesNo(sendStr);
    } else {
        cm.sendOk("¡He aquí los distinguidos y valientes héroes de Rien! Esos corazones valientes son los que desde hace mucho protegen a nuestro pueblo, nuestros valientes camaradas.");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    status++;
    if (mode == 0 && type != 1) {
        status -= 2;
    }
    if (status == -1) {
        start();

    } else {
        if (spawnPnpc) {
            if (mode > 0) {
                if (cm.getMeso() < spawnPnpcFee) {
                    cm.sendOk("Lo sentimos, no tienes suficientes mesos para comprar tu lugar en el Salón de la Fama.");
                    cm.dispose();
                    return;
                }

                const PlayerNPC = Java.type('server.life.PlayerNPC');
                const GameConstants = Java.type('constants.game.GameConstants');
                if (PlayerNPC.spawnPlayerNPC(GameConstants.getHallOfFameMapid(cm.getJob()), cm.getPlayer())) {
                    cm.sendOk("¡Ahí tienes! Espero que te guste.");
                    cm.gainMeso(-spawnPnpcFee);
                } else {
                    cm.sendOk("Lo sentimos, el Salón de la Fama está actualmente lleno...");
                }
            }

            cm.dispose();

        } else {
            // do nothing
        }
    }
}