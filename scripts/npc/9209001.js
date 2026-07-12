/*
    EVENTO DIA DEL AMIGO
    NPC ID usado: 9209001, Mimi.
 */

var status = -1;
var selected = -1;

var CAMPAIGN_KEY = "friend_day_20260712";
var EVENT_NAME = "EVENTO DIA DEL AMIGO";
var ONYX_APPLE = 2022179;
var VIP_TELEPORT_ROCK = 5041000;
var FRIEND_RING = 1112800;
var FRIEND_RING_DAYS = 90;
var MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

var rewards = [
    { type: "meso", amount: 10000000, label: "10,000,000 mesos" },
    { type: "nx", amount: 1000, label: "1,000 NX" },
    { type: "item", itemId: ONYX_APPLE, quantity: 5, label: "Onyx Apple x5" },
    { type: "nx", amount: 1500, label: "1,500 NX" },
    { type: "item", itemId: VIP_TELEPORT_ROCK, quantity: 10, label: "VIP Teleport Rock x10" },
    { type: "nx", amount: 5000, label: "5,000 NX" },
    { type: "friendRing", itemId: FRIEND_RING, quantity: 1, label: "Anillo Dia del Amigo +5000 HP/MP por 90 dias" }
];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        var progress = getProgress();
        var text = "#e" + EVENT_NAME + "#n\r\n\r\n";
        text += "Progreso actual: #b" + progress.claimedDays + "/" + rewards.length + "#k dias cobrados.\r\n\r\n";
        text += buildRewardList(progress.claimedDays);
        text += "\r\n#L0#Cobrar recompensa de hoy#l";

        if (cm.getPlayer().gmLevel() >= 3) {
            text += "\r\n#L98#GM: cobrar siguiente dia ignorando fecha#l";
            text += "\r\n#L99#GM: reiniciar mi progreso de prueba#l";
        }

        cm.sendSimple(text);
    } else if (status == 1) {
        selected = selection;

        if (selected == 98 && cm.getPlayer().gmLevel() >= 3) {
            var gmPreview = getClaimPreview(true);
            if (!gmPreview.canClaim) {
                cm.sendOk(gmPreview.message);
                cm.dispose();
                return;
            }

            cm.sendYesNo("Modo GM de prueba:\r\n\r\nVas a cobrar el #bDia " + gmPreview.day + "#k ignorando el bloqueo diario.\r\n\r\nRecompensa: #e" + gmPreview.reward.label + "#n\r\n\r\nDeseas continuar?");
            return;
        }

        if (selected == 99 && cm.getPlayer().gmLevel() >= 3) {
            resetProgress();
            cm.sendOk("Progreso del " + EVENT_NAME + " reiniciado para esta cuenta.");
            cm.dispose();
            return;
        }

        var preview = getClaimPreview();
        if (!preview.canClaim) {
            cm.sendOk(preview.message);
            cm.dispose();
            return;
        }

        cm.sendYesNo("Vas a cobrar la recompensa del #bDia " + preview.day + "#k:\r\n\r\n#e" + preview.reward.label + "#n\r\n\r\nDeseas continuar?");
    } else if (status == 2) {
        var result = claimReward(selected == 98 && cm.getPlayer().gmLevel() >= 3);
        cm.sendOk(result.message);
        cm.dispose();
    }
}

function buildRewardList(claimedDays) {
    var text = "";
    for (var i = 0; i < rewards.length; i++) {
        var marker = i < claimedDays ? "#g[Cobrado]#k" : (i == claimedDays ? "#b[Siguiente]#k" : "#d[Pendiente]#k");
        text += marker + " Dia " + (i + 1) + ": " + rewards[i].label + "\r\n";
    }
    return text;
}

function getClaimPreview(ignoreDateGate) {
    var progress = getProgress();
    if (!ignoreDateGate && progress.claimedToday) {
        return { canClaim: false, message: "Ya cobraste la recompensa de hoy. Vuelve manana para el siguiente dia del pase." };
    }
    if (progress.claimedDays >= rewards.length) {
        return { canClaim: false, message: "Ya completaste todas las recompensas del " + EVENT_NAME + "." };
    }

    var reward = rewards[progress.claimedDays];
    if (!canHoldReward(reward)) {
        return { canClaim: false, message: "No tienes espacio suficiente en el inventario para recibir: #b" + reward.label + "#k." };
    }

    return {
        canClaim: true,
        day: progress.claimedDays + 1,
        reward: reward
    };
}

function claimReward(ignoreDateGate) {
    var preview = getClaimPreview(ignoreDateGate);
    if (!preview.canClaim) {
        return { ok: false, message: preview.message };
    }

    var accountId = cm.getPlayer().getAccountID();
    var characterId = cm.getPlayer().getId();
    var day = preview.day;
    var reward = preview.reward;

    var con = null;
    var ps = null;

    try {
        var DatabaseConnection = Java.type("tools.DatabaseConnection");
        con = DatabaseConnection.getConnection();

        var claimedOnSql = ignoreDateGate ? "DATE_ADD(CURRENT_DATE, INTERVAL " + day + " DAY)" : "CURRENT_DATE";
        ps = con.prepareStatement(
            "INSERT INTO daily_login_pass_claims " +
            "(account_id, character_id, campaign_key, reward_day, claimed_on, reward_type, reward_amount) " +
            "VALUES (?, ?, ?, ?, " + claimedOnSql + ", ?, ?)"
        );
        ps.setInt(1, accountId);
        ps.setInt(2, characterId);
        ps.setString(3, CAMPAIGN_KEY);
        ps.setInt(4, day);
        ps.setString(5, reward.type);
        ps.setInt(6, getRewardRecordAmount(reward));
        ps.executeUpdate();
        closeQuietly(ps);
        ps = null;

        if (reward.type == "meso") {
            cm.gainMeso(reward.amount);
        } else if (reward.type == "nx") {
            var CashShop = Java.type("server.CashShop");
            cm.getPlayer().getCashShop().gainCash(CashShop.NX_CREDIT, reward.amount);

            ps = con.prepareStatement("UPDATE accounts SET nxCredit = COALESCE(nxCredit, 0) + ? WHERE id = ?");
            ps.setInt(1, reward.amount);
            ps.setInt(2, accountId);
            ps.executeUpdate();
            closeQuietly(ps);
            ps = null;
        } else if (reward.type == "item") {
            cm.gainItem(reward.itemId, reward.quantity);
        } else if (reward.type == "friendRing") {
            giveFriendRing();
        } else {
            return { ok: false, message: "Tipo de recompensa no soportado: " + reward.type };
        }

        cm.getPlayer().saveCharToDB();
        return { ok: true, message: "Listo. Cobraste la recompensa del Dia " + day + ": #b" + reward.label + "#k." };
    } catch (err) {
        return { ok: false, message: "No se pudo cobrar la recompensa. Si ya cobraste hoy, vuelve manana.\r\n\r\nDetalle: " + err };
    } finally {
        closeQuietly(ps);
        closeQuietly(con);
    }
}

function canHoldReward(reward) {
    if (reward.type == "item" || reward.type == "friendRing") {
        return cm.canHold(reward.itemId, reward.quantity);
    }
    return true;
}

function getRewardRecordAmount(reward) {
    if (reward.type == "item" || reward.type == "friendRing") {
        return reward.itemId;
    }
    return reward.amount;
}

function giveFriendRing() {
    var ItemInformationProvider = Java.type("server.ItemInformationProvider");
    var InventoryManipulator = Java.type("client.inventory.manipulator.InventoryManipulator");
    var ItemConstants = Java.type("constants.inventory.ItemConstants");

    var equip = ItemInformationProvider.getInstance().getEquipById(FRIEND_RING);
    equip.setOwner("DIA AMIGO");
    equip.setHp(5000);
    equip.setMp(5000);
    equip.setExpiration(cm.getCurrentTime() + (FRIEND_RING_DAYS * MILLIS_PER_DAY));
    equip.setFlag(equip.getFlag() | ItemConstants.UNTRADEABLE);

    InventoryManipulator.addFromDrop(cm.getClient(), equip, true);
}

function getProgress() {
    var accountId = cm.getPlayer().getAccountID();
    var con = null;
    var ps = null;
    var rs = null;

    try {
        var DatabaseConnection = Java.type("tools.DatabaseConnection");
        con = DatabaseConnection.getConnection();
        ps = con.prepareStatement(
            "SELECT COUNT(*) AS claimed_days, " +
            "SUM(CASE WHEN claimed_on = CURRENT_DATE THEN 1 ELSE 0 END) AS claimed_today " +
            "FROM daily_login_pass_claims WHERE account_id = ? AND campaign_key = ?"
        );
        ps.setInt(1, accountId);
        ps.setString(2, CAMPAIGN_KEY);
        rs = ps.executeQuery();

        if (rs.next()) {
            return {
                claimedDays: rs.getInt("claimed_days"),
                claimedToday: rs.getInt("claimed_today") > 0
            };
        }
    } catch (err) {
        return { claimedDays: 0, claimedToday: false };
    } finally {
        closeQuietly(rs);
        closeQuietly(ps);
        closeQuietly(con);
    }

    return { claimedDays: 0, claimedToday: false };
}

function resetProgress() {
    var con = null;
    var ps = null;

    try {
        var DatabaseConnection = Java.type("tools.DatabaseConnection");
        con = DatabaseConnection.getConnection();
        ps = con.prepareStatement("DELETE FROM daily_login_pass_claims WHERE account_id = ? AND campaign_key = ?");
        ps.setInt(1, cm.getPlayer().getAccountID());
        ps.setString(2, CAMPAIGN_KEY);
        ps.executeUpdate();
    } finally {
        closeQuietly(ps);
        closeQuietly(con);
    }
}

function closeQuietly(resource) {
    if (resource != null) {
        try {
            resource.close();
        } catch (ignore) {
        }
    }
}
