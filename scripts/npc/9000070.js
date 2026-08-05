/*
 * Forja Astral MVP. Reutiliza recursos v83 existentes para no requerir parche de cliente.
 * 4001199 = Fragmento Astral (se muestra como Straw en el cliente actual).
 * 1122013 = Reliquia Astral (se muestra como Gordon's Magic Iron).
 */

var status = -1;
var selection = -1;

var FRAGMENT = 4001199;
var RELIC = 1122013;
var FRAGMENTS_REQUIRED = 100;
var MESOS_REQUIRED = 50000000;
var RESETS_REQUIRED = 5;
var WEEKLY_CAP = 40;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selected) {
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        var progress = getProgress();
        var text = "#eForja Astral#n\r\n\r\n";
        text += "Los bosses principales entregan #bFragmentos Astrales#k. En este cliente se ven como #i" + FRAGMENT + "# #t" + FRAGMENT + "#, pero pertenecen a este sistema.\r\n\r\n";
        text += "Fragmentos en inventario: #b" + cm.getItemQuantity(FRAGMENT) + "#k\r\n";
        text += "Progreso semanal: #b" + progress.fragments + "/" + WEEKLY_CAP + "#k fragmentos, " + progress.kills + " bosses.\r\n";
        text += "Resets del personaje: #b" + progress.resets + "#k\r\n\r\n";
        text += "#L0#Forjar la Reliquia Astral#l\r\n";
        text += "#L1#Ver bosses y recompensas#l\r\n";
        text += "#L2#Explicame el sistema#l";
        cm.sendSimple(text);
        return;
    }

    if (status == 1) {
        selection = selected;
        if (selection == 0) {
            cm.sendYesNo("La Reliquia requiere:\r\n\r\n#b" + FRAGMENTS_REQUIRED + " Fragmentos Astrales\r\n" + formatMesos(MESOS_REQUIRED) + " mesos\r\n" + RESETS_REQUIRED + " resets#k\r\n\r\nLa reliquia queda ligada a tu cuenta y solo puede forjarse una vez. ¿Continuar?");
        } else if (selection == 1) {
            cm.sendOk("#eRecompensas por boss#n\r\n\r\nPapulatus y Pianus: #b2#k\r\nZakum: #b3#k\r\nScarlion y Targa: #b4#k\r\nHorntail: #b5#k\r\nPink Bean: #b6#k\r\n\r\nEl limite es de #b" + WEEKLY_CAP + " fragmentos por cuenta#k y se reinicia cada lunes.");
            cm.dispose();
        } else {
            cm.sendOk("Derrota bosses, junta fragmentos y vuelve a la Forja. La primera Reliquia Astral otorga #b25 a todos los atributos, 500 HP/MP y 3 ataque fisico/magico#k. El objeto utiliza temporalmente la apariencia y nombre de un pendant existente.");
            cm.dispose();
        }
        return;
    }

    if (status == 2 && selection == 0) {
        var result = forgeRelic();
        cm.sendOk(result.message);
        cm.dispose();
    }
}

function forgeRelic() {
    var progress = getProgress();
    if (progress.resets < RESETS_REQUIRED) {
        return { message: "Necesitas al menos #b" + RESETS_REQUIRED + " resets#k para usar la Forja Astral." };
    }
    if (cm.getItemQuantity(FRAGMENT) < FRAGMENTS_REQUIRED) {
        return { message: "Te faltan Fragmentos Astrales. Necesitas #b" + FRAGMENTS_REQUIRED + "#k." };
    }
    if (cm.getMeso() < MESOS_REQUIRED) {
        return { message: "Necesitas #b" + formatMesos(MESOS_REQUIRED) + " mesos#k." };
    }
    if (!cm.canHold(RELIC, 1)) {
        return { message: "Libera un espacio en tu inventario de EQUIP." };
    }

    var con = null;
    var ps = null;
    try {
        var DatabaseConnection = Java.type("tools.DatabaseConnection");
        con = DatabaseConnection.getConnection();
        con.setAutoCommit(false);

        ps = con.prepareStatement("INSERT INTO astral_relics (account_id, character_id, tier) VALUES (?, ?, 1)");
        ps.setInt(1, cm.getPlayer().getAccountID());
        ps.setInt(2, cm.getPlayer().getId());
        ps.executeUpdate();
        closeQuietly(ps);
        ps = null;

        var ItemInformationProvider = Java.type("server.ItemInformationProvider");
        var InventoryManipulator = Java.type("client.inventory.manipulator.InventoryManipulator");
        var ItemConstants = Java.type("constants.inventory.ItemConstants");
        var equip = ItemInformationProvider.getInstance().getEquipById(RELIC);
        equip.setOwner("ASTRAL I");
        equip.setStr(25);
        equip.setDex(25);
        equip.setInt(25);
        equip.setLuk(25);
        equip.setHp(500);
        equip.setMp(500);
        equip.setWatk(3);
        equip.setMatk(3);
        equip.setFlag(equip.getFlag() | ItemConstants.UNTRADEABLE);

        if (!InventoryManipulator.addFromDrop(cm.getClient(), equip, true)) {
            con.rollback();
            return { message: "No se pudo entregar la Reliquia. No se consumieron materiales." };
        }

        cm.gainItem(FRAGMENT, -FRAGMENTS_REQUIRED);
        cm.gainMeso(-MESOS_REQUIRED);
        con.commit();
        cm.getPlayer().saveCharToDB();
        return { message: "#eLa Reliquia Astral desperto.#n\r\n\r\nRecibiste #i" + RELIC + "# #b#t" + RELIC + "##k con poder Astral I. Quedo ligada a esta cuenta." };
    } catch (err) {
        if (con != null) {
            try { con.rollback(); } catch (ignore) {}
        }
        var detail = String(err);
        if (detail.indexOf("Duplicate") >= 0 || detail.indexOf("duplicate") >= 0) {
            return { message: "Esta cuenta ya forjo su Reliquia Astral." };
        }
        return { message: "No se pudo completar la forja. Intenta nuevamente.\r\n\r\nDetalle: " + detail };
    } finally {
        closeQuietly(ps);
        if (con != null) {
            try { con.setAutoCommit(true); } catch (ignore2) {}
        }
        closeQuietly(con);
    }
}

function getProgress() {
    var result = { fragments: 0, kills: 0, resets: 0 };
    var con = null;
    var ps = null;
    var rs = null;
    try {
        var DatabaseConnection = Java.type("tools.DatabaseConnection");
        con = DatabaseConnection.getConnection();
        ps = con.prepareStatement(
            "SELECT c.reborns, COALESCE(a.fragments_earned, 0) fragments_earned, COALESCE(a.boss_kills, 0) boss_kills " +
            "FROM characters c LEFT JOIN astral_weekly_progress a ON a.account_id = c.accountid " +
            "AND a.week_start = DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY) WHERE c.id = ?"
        );
        ps.setInt(1, cm.getPlayer().getId());
        rs = ps.executeQuery();
        if (rs.next()) {
            result.resets = rs.getInt("reborns");
            result.fragments = rs.getInt("fragments_earned");
            result.kills = rs.getInt("boss_kills");
        }
    } finally {
        closeQuietly(rs);
        closeQuietly(ps);
        closeQuietly(con);
    }
    return result;
}

function formatMesos(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function closeQuietly(resource) {
    if (resource != null) {
        try { resource.close(); } catch (ignore) {}
    }
}
