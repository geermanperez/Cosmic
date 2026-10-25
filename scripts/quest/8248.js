/*
 * EverleafMS Rebirth Pass reminder.
 * This retired quest ID is reused only as a remote reminder; it is never started.
 */

var status = -1;

function start(mode, type, selection) {
    if (mode !== 1) {
        qm.dispose();
        return;
    }

    status++;
    if (status !== 0) {
        qm.dispose();
        return;
    }

    var completed = qm.getRebirthPassDeliveredDays();
    if (completed < 0) {
        qm.sendOk("#e#r[EverleafMS Rebirth Pass]#k#n\r\n\r\nI could not retrieve your pass status right now. Please talk to Mimi again in a moment.");
        return;
    }

    if (completed >= 7) {
        qm.sendOk("#e#b[EverleafMS Rebirth Pass]#k#n\r\n\r\n#gYou completed all 7 days!#k Thank you for playing EverleafMS.");
        return;
    }

    if (qm.hasRebirthPassClaimToday()) {
        qm.sendOk("#e#b[EverleafMS Rebirth Pass]#k#n\r\n\r\nYou already claimed today's reward. Your progress is #b" + completed + " / 7#k.\r\nCome back tomorrow for Day " + (completed + 1) + ".");
        return;
    }

    qm.sendOk("#e#b[EverleafMS Rebirth Pass]#k#n\r\n\r\n#gYour Day " + (completed + 1) + " reward is ready!#k\r\nTalk to #bMimi#k in town to claim it.\r\n\r\nCurrent progress: #b" + completed + " / 7#k");
}

function end(mode, type, selection) {
    qm.dispose();
}
