package server.ranking;

import client.Character;
import constants.id.MobId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.astral.AstralProgress;
import server.life.Monster;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;

public final class BossRanking {
    private static final Logger log = LoggerFactory.getLogger(BossRanking.class);

    private record BossScore(String name, int points, int astralFragments) {}

    private static final Map<Integer, BossScore> BOSS_POINTS = Map.ofEntries(
            Map.entry(MobId.ZAKUM_3, new BossScore("Zakum", 10, 3)),
            Map.entry(MobId.PAPULATUS, new BossScore("Papulatus", 7, 2)),
            Map.entry(MobId.PIANUS_R, new BossScore("Pianus", 5, 2)),
            Map.entry(MobId.PIANUS_L, new BossScore("Pianus", 5, 2)),
            Map.entry(MobId.HORNTAIL, new BossScore("Horntail", 25, 5)),
            Map.entry(MobId.PINK_BEAN, new BossScore("Pink Bean", 30, 6)),
            Map.entry(MobId.FURIOUS_SCARLION, new BossScore("Scarlion", 15, 4)),
            Map.entry(MobId.FURIOUS_TARGA, new BossScore("Targa", 15, 4))
    );

    private BossRanking() {}

    public static void recordKill(Monster monster, Character killer) {
        if (monster == null || killer == null || killer.isGM()) {
            return;
        }

        BossScore score = BOSS_POINTS.get(monster.getId());
        if (score == null) {
            return;
        }

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("""
                     INSERT INTO boss_ranking (character_id, boss_id, boss_name, kills, points, last_kill_at)
                     VALUES (?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
                     ON DUPLICATE KEY UPDATE
                         boss_name = VALUES(boss_name),
                         kills = kills + 1,
                         points = points + VALUES(points),
                         last_kill_at = CURRENT_TIMESTAMP
                     """)) {
            ps.setInt(1, killer.getId());
            ps.setInt(2, monster.getId());
            ps.setString(3, score.name());
            ps.setInt(4, score.points());
            ps.executeUpdate();
            AstralProgress.rewardBossKill(killer, score.astralFragments());
        } catch (SQLException e) {
            log.warn("Failed to record boss ranking points. chrId={}, mobId={}", killer.getId(), monster.getId(), e);
        }
    }
}
