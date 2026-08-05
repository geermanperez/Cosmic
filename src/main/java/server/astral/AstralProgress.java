package server.astral;

import client.Character;
import client.inventory.manipulator.InventoryManipulator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class AstralProgress {
    public static final int FRAGMENT_ITEM_ID = 4001199;
    public static final int WEEKLY_FRAGMENT_CAP = 40;

    private static final Logger log = LoggerFactory.getLogger(AstralProgress.class);

    private AstralProgress() {
    }

    public static void rewardBossKill(Character player, int requestedFragments) {
        if (player == null || player.isGM() || requestedFragments <= 0) {
            return;
        }

        try (Connection con = DatabaseConnection.getConnection()) {
            con.setAutoCommit(false);
            try {
                int earned = lockWeeklyProgress(con, player.getAccountID());
                int granted = Math.min(requestedFragments, WEEKLY_FRAGMENT_CAP - earned);
                if (granted <= 0) {
                    con.rollback();
                    player.dropMessage(5, "[Forja Astral] Alcanzaste el limite semanal de " + WEEKLY_FRAGMENT_CAP + " fragmentos.");
                    return;
                }

                if (!InventoryManipulator.addById(player.getClient(), FRAGMENT_ITEM_ID, (short) granted, "ASTRAL", -1)) {
                    con.rollback();
                    player.dropMessage(5, "[Forja Astral] Libera espacio en ETC. No se consumio tu limite semanal.");
                    return;
                }

                try (PreparedStatement ps = con.prepareStatement("""
                        UPDATE astral_weekly_progress
                        SET fragments_earned = fragments_earned + ?, boss_kills = boss_kills + 1
                        WHERE account_id = ? AND week_start = DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
                        """)) {
                    ps.setInt(1, granted);
                    ps.setInt(2, player.getAccountID());
                    ps.executeUpdate();
                }
                con.commit();
                player.dropMessage(5, "[Forja Astral] Obtuviste " + granted + " Fragmento(s) Astral(es). Semana: " + (earned + granted) + "/" + WEEKLY_FRAGMENT_CAP + ".");
            } catch (SQLException e) {
                con.rollback();
                throw e;
            } finally {
                con.setAutoCommit(true);
            }
        } catch (SQLException e) {
            log.warn("Failed to reward Astral fragments. chrId={}", player.getId(), e);
        }
    }

    private static int lockWeeklyProgress(Connection con, int accountId) throws SQLException {
        try (PreparedStatement insert = con.prepareStatement("""
                INSERT IGNORE INTO astral_weekly_progress (account_id, week_start)
                VALUES (?, DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY))
                """)) {
            insert.setInt(1, accountId);
            insert.executeUpdate();
        }

        try (PreparedStatement select = con.prepareStatement("""
                SELECT fragments_earned FROM astral_weekly_progress
                WHERE account_id = ? AND week_start = DATE_SUB(CURRENT_DATE, INTERVAL WEEKDAY(CURRENT_DATE) DAY)
                FOR UPDATE
                """)) {
            select.setInt(1, accountId);
            try (ResultSet rs = select.executeQuery()) {
                return rs.next() ? rs.getInt("fragments_earned") : 0;
            }
        }
    }
}
