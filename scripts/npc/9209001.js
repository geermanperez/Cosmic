/*
 * EverleafMS Rebirth Pass — NPC Mimi (9209001)
 *
 * 7-Day progression event with crash-safe MySQL transactional claims.
 * Mimi only opens when manually talked to by the player.
 */

var status = -1;
var selectedOption = -1;

var REWARD_DESCRIPTIONS = [
    "Day 1: +100 Max HP, +100 Max MP, 50,000 Mesos, 5x Town Return Scrolls",
    "Day 2: 2x 2x EXP Cards",
    "Day 3: 14-Day Pet (Brown Puppy)",
    "Day 4: 3x Gachapon Tickets, 100,000 Mesos",
    "Day 5: 7-Day Teleport Rock, 1x 2x EXP Card",
    "Day 6: VIP Hair Style Coupon & VIP Face Coupon",
    "Day 7: The Relaxer Chair & 2,000 NX Credit"
];

function getRequiredTab(day) {
    switch (day) {
        case 1: return "Use";
        case 2: return "Cash";
        case 3: return "Cash";
        case 4: return "Cash";
        case 5: return "Cash";
        case 6: return "Cash";
        case 7: return "Setup";
        default: return "Inventory";
    }
}

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
        if (completed < 0) {
            cm.sendOk("#e#r[EverleafMS Rebirth Pass]#k#n\r\n\r\nUnable to retrieve your Rebirth Pass status at this time. Please try again later.");
            cm.dispose();
            return;
        }

        var claimedToday = cm.hasRebirthPassClaimToday();
        var nextDay = completed + 1;

        var msg = "#e#b[EverleafMS Rebirth Pass]#k#n\r\n";
        msg += "Welcome, #h #! Log in each day to advance your Rebirth Pass and claim exclusive progression rewards.\r\n\r\n";

        msg += "#bTotal Progress:#k " + completed + " / 7 days completed\r\n";
        if (completed >= 7) {
            msg += "#gStatus: All 7 days completed! Congratulations!#k\r\n\r\n";
        } else if (claimedToday) {
            msg += "#dStatus: Already claimed for today. Next reward unlocks tomorrow!#k\r\n\r\n";
        } else {
            msg += "#gStatus: Day " + nextDay + " reward is AVAILABLE NOW!#k\r\n\r\n";
        }

        msg += "#e7-Day Rewards Overview:#n\r\n";
        for (var d = 1; d <= 7; d++) {
            var desc = REWARD_DESCRIPTIONS[d - 1];
            if (d <= completed) {
                msg += "#g[Day " + d + " - CLAIMED]#k " + desc + "\r\n";
            } else if (d === nextDay && !claimedToday) {
                msg += "#e#r[Day " + d + " - READY TO CLAIM]#k#n " + desc + "\r\n";
            } else if (d === nextDay && claimedToday) {
                msg += "#b[Day " + d + " - Next in queue]#k " + desc + "\r\n";
            } else {
                msg += "#k[Day " + d + " - Locked]#k " + desc + "\r\n";
            }
        }
        msg += "\r\n";

        if (!claimedToday && nextDay <= 7) {
            msg += "#b#L0#Claim Day " + nextDay + " Reward Now!#l#k\r\n";
        }
        msg += "#L1#View Event Rules & Details#l\r\n";

        cm.sendSimple(msg);

    } else if (status === 1) {
        selectedOption = selection;

        if (selectedOption === 0) {
            // Attempt claim
            var completed = cm.getRebirthPassDeliveredDays();
            var targetDay = completed + 1;
            var result = cm.claimRebirthPassReward();

            if (result === 0) { // RESULT_SUCCESS
                var successMsg = "#e#b[EverleafMS Rebirth Pass]#k#n\r\n\r\n";
                successMsg += "#gCongratulations!#k You have successfully claimed your #bDay " + targetDay + "#k reward!\r\n\r\n";
                successMsg += "#dReward received:#k " + REWARD_DESCRIPTIONS[targetDay - 1] + "\r\n\r\n";
                if (targetDay < 7) {
                    successMsg += "Be sure to return tomorrow after midnight to claim Day " + (targetDay + 1) + "!";
                } else {
                    successMsg += "#gYou have completed the entire EverleafMS Rebirth Pass! Enjoy your rewards!#k";
                }
                cm.sendOk(successMsg);
            } else if (result === 1) { // RESULT_ALREADY_CLAIMED_TODAY
                cm.sendOk("#e#b[EverleafMS Rebirth Pass]#k#n\r\n\r\nYou have already claimed today's reward for this account.\r\nPlease come back tomorrow after midnight (server time) to claim your next reward!");
            } else if (result === 2) { // RESULT_ALL_COMPLETED
                cm.sendOk("#e#b[EverleafMS Rebirth Pass]#k#n\r\n\r\nYou have already completed all 7 days of the Rebirth Pass! Thank you for playing EverleafMS.");
            } else if (result === 3) { // RESULT_INVENTORY_FULL
                cm.sendOk("#e#r[Inventory Full]#k#n\r\n\r\nYour inventory does not have enough free slots for this reward!\r\nPlease ensure you have free slots in your #b" + getRequiredTab(targetDay) + "#k inventory tab and try again.");
            } else { // RESULT_ERROR
                cm.sendOk("#e#r[Error]#k#n\r\n\r\nAn error occurred while processing your reward claim. Please try again later or contact server staff.");
            }
            cm.dispose();

        } else if (selectedOption === 1) {
            // View Rules
            var rules = "#e#b[EverleafMS Rebirth Pass — Rules & Information]#k#n\r\n\r\n";
            rules += "1. #bOne Claim Per Day:#k Each account may claim at most one Rebirth Pass reward per calendar day (resetting at midnight server time).\r\n\r\n";
            rules += "2. #bAccount-Wide Progress:#k Progress is tracked per account across all characters. Rewards are delivered to the character claiming them.\r\n\r\n";
            rules += "3. #bNo Progress Loss:#k Skipping a day will not reset your progress. You will always pick up right where you left off.\r\n\r\n";
            rules += "4. #bInventory Requirement:#k Ensure you have sufficient free inventory slots (Use, Cash, Setup) before claiming.\r\n\r\n";
            rules += "5. #bItem Expirations:#k The Day 3 Pet lasts 14 days; the Day 5 Teleport Rock lasts 7 days; the Day 7 Chair is permanent.";
            cm.sendOk(rules);
            cm.dispose();
        } else {
            cm.dispose();
        }
    } else {
        cm.dispose();
    }
}
