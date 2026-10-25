/*
 * EverleafMS Rebirth Pass — read-only preview.
 * Claiming remains disabled until crash-safe grants and item IDs are verified.
 * Mimi is never auto-opened by this script.
 */
var status = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode !== 1) {
        cm.dispose();
        return;
    }
    status++;
    if (status === 0) {
        var completed = cm.getRebirthPassDeliveredDays();
        var state = cm.hasRebirthPassClaimToday();
        var progress = completed < 0 ? "Unavailable" : completed + " / 7";
        var message = "#e#bEverleafMS Rebirth Pass#k#n\r\n\r\n" +
          "Return every day for new rewards!\r\n" +
          "Progress: #b" + progress + "#k\r\n" +
          (state ? "Daily reward: already claimed or pending.\r\n" : "") +
          "\r\n#dDay 1:#k 100 HP + 100 MP, 50,000 mesos, Return Scrolls\r\n" +
          "#dDay 2:#k Two 2x EXP Coupons\r\n" +
          "#dDay 3:#k 14-day Pet\r\n" +
          "#dDay 4:#k Three Gachapon Tickets, 100,000 mesos\r\n" +
          "#dDay 5:#k 7-day Teleport Rock and EXP Coupon\r\n" +
          "#dDay 6:#k Hair and Face Coupons\r\n" +
          "#dDay 7:#k Permanent Chair and 2,000 NX\r\n\r\n" +
          "#rRewards are temporarily unavailable while the pass is being prepared.#k";
        cm.sendOk(message);
    } else {
        cm.dispose();
    }
}
