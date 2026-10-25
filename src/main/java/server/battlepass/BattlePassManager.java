package server.battlepass;

import client.Character;
import client.inventory.manipulator.InventoryManipulator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class BattlePassManager {
    private static final Logger log = LoggerFactory.getLogger(BattlePassManager.class);
    private static final BattlePassManager instance = new BattlePassManager();
    private static final ZoneId TIMEZONE = ZoneId.of("UTC");

    public record RewardItem(int itemId, int count) {}

    public record DayReward(int day, List<RewardItem> items, int nx, int mesos, String title) {}

    public record BattlePassInfo(int day, int streak, boolean canClaimToday, LocalDate lastClaimDate) {}

    public enum ClaimResult {
        SUCCESS,
        ALREADY_CLAIMED,
        NO_SPACE,
        ERROR
    }

    private final Map<Integer, DayReward> rewards = new HashMap<>();

    public static BattlePassManager getInstance() {
        return instance;
    }

    private BattlePassManager() {
        initRewards();
    }

    private void initRewards() {
        // Day 1
        rewards.put(1, new DayReward(1, List.of(new RewardItem(2000005, 50)), 1000, 100000, "50x Power Elixir"));
        // Day 2
        rewards.put(2, new DayReward(2, List.of(new RewardItem(5211060, 1)), 1500, 150000, "1x 2x EXP Coupon (2h)"));
        // Day 3
        rewards.put(3, new DayReward(3, List.of(new RewardItem(5041000, 5)), 2000, 200000, "5x VIP Teleport Rock"));
        // Day 4
        rewards.put(4, new DayReward(4, List.of(new RewardItem(5220000, 5)), 2500, 250000, "5x Gachapon Ticket"));
        // Day 5
        rewards.put(5, new DayReward(5, List.of(new RewardItem(5072000, 3), new RewardItem(2050004, 50)), 3000, 300000, "3x Super Megaphone & 50x All Cure"));
        // Day 6
        rewards.put(6, new DayReward(6, List.of(new RewardItem(2022179, 3)), 4000, 500000, "3x Onyx Apple"));
        // Day 7 - Milestone 1
        rewards.put(7, new DayReward(7, List.of(new RewardItem(2340000, 1)), 5000, 1000000, "1x White Scroll (Hito Semanal)"));

        // Day 8
        rewards.put(8, new DayReward(8, List.of(new RewardItem(2000005, 75)), 1500, 200000, "75x Power Elixir"));
        // Day 9
        rewards.put(9, new DayReward(9, List.of(new RewardItem(5360015, 2)), 2000, 250000, "2x 2x Drop Coupon (4h)"));
        // Day 10
        rewards.put(10, new DayReward(10, List.of(new RewardItem(5130000, 5)), 2500, 300000, "5x Safety Charm"));
        // Day 11
        rewards.put(11, new DayReward(11, List.of(new RewardItem(5220000, 5)), 3000, 350000, "5x Gachapon Ticket"));
        // Day 12
        rewards.put(12, new DayReward(12, List.of(new RewardItem(2049100, 1)), 3500, 400000, "1x Chaos Scroll 60%"));
        // Day 13
        rewards.put(13, new DayReward(13, List.of(new RewardItem(2022179, 5)), 4000, 500000, "5x Onyx Apple"));
        // Day 14 - Milestone 2
        rewards.put(14, new DayReward(14, List.of(new RewardItem(2340000, 1)), 7500, 2000000, "1x White Scroll (Hito 2 Semanas)"));

        // Day 15
        rewards.put(15, new DayReward(15, List.of(new RewardItem(2000005, 100)), 2000, 300000, "100x Power Elixir"));
        // Day 16
        rewards.put(16, new DayReward(16, List.of(new RewardItem(5041000, 5)), 2500, 350000, "5x VIP Teleport Rock"));
        // Day 17
        rewards.put(17, new DayReward(17, List.of(new RewardItem(5220000, 8)), 3000, 400000, "8x Gachapon Ticket"));
        // Day 18
        rewards.put(18, new DayReward(18, List.of(new RewardItem(5072000, 5)), 3500, 500000, "5x Super Megaphone"));
        // Day 19
        rewards.put(19, new DayReward(19, List.of(new RewardItem(2022179, 5)), 4000, 600000, "5x Onyx Apple"));
        // Day 20
        rewards.put(20, new DayReward(20, List.of(new RewardItem(2049100, 2)), 5000, 1000000, "2x Chaos Scroll 60%"));
        // Day 21 - Milestone 3
        rewards.put(21, new DayReward(21, List.of(new RewardItem(2340000, 1), new RewardItem(2049100, 1)), 10000, 3000000, "1x White Scroll & 1x Chaos Scroll (Hito 3 Semanas)"));

        // Day 22
        rewards.put(22, new DayReward(22, List.of(new RewardItem(2000005, 100)), 2500, 400000, "100x Power Elixir"));
        // Day 23
        rewards.put(23, new DayReward(23, List.of(new RewardItem(5360015, 3)), 3000, 500000, "3x 2x Drop Coupon (4h)"));
        // Day 24
        rewards.put(24, new DayReward(24, List.of(new RewardItem(5220000, 10)), 3500, 600000, "10x Gachapon Ticket"));
        // Day 25
        rewards.put(25, new DayReward(25, List.of(new RewardItem(5041000, 10)), 4000, 750000, "10x VIP Teleport Rock"));
        // Day 26
        rewards.put(26, new DayReward(26, List.of(new RewardItem(2022179, 7)), 5000, 1000000, "7x Onyx Apple"));
        // Day 27
        rewards.put(27, new DayReward(27, List.of(new RewardItem(2049100, 2)), 6000, 1500000, "2x Chaos Scroll 60%"));
        // Day 28 - Milestone 4
        rewards.put(28, new DayReward(28, List.of(new RewardItem(2340000, 2)), 10000, 3000000, "2x White Scroll (Hito 4 Semanas)"));
        // Day 29
        rewards.put(29, new DayReward(29, List.of(new RewardItem(2022179, 10), new RewardItem(2000005, 100)), 7500, 2000000, "10x Onyx Apple & 100x Power Elixir"));
        // Day 30 - Grand Milestone
        rewards.put(30, new DayReward(30, List.of(new RewardItem(2340000, 2), new RewardItem(2049100, 3), new RewardItem(3010025, 1)), 15000, 5000000, "2x White Scroll, 3x Chaos Scroll & Silla Maple Tree (Hito Final 30 Días)"));
    }

    public BattlePassInfo getInfo(Character chr) {
        int accId = chr.getAccountID();
        LocalDate today = LocalDate.now(TIMEZONE);

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT day_count, streak_count, last_claim_date FROM battle_pass WHERE account_id = ?")) {
            ps.setInt(1, accId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    int recordedDay = rs.getInt("day_count");
                    int streak = rs.getInt("streak_count");
                    Date dateVal = rs.getDate("last_claim_date");
                    LocalDate lastClaim = dateVal != null ? dateVal.toLocalDate() : null;

                    if (lastClaim != null && lastClaim.equals(today)) {
                        return new BattlePassInfo(recordedDay, streak, false, lastClaim);
                    } else if (lastClaim != null && lastClaim.plusDays(1).equals(today)) {
                        int nextDay = (recordedDay % 30) + 1;
                        return new BattlePassInfo(nextDay, streak + 1, true, lastClaim);
                    } else {
                        int nextDay = (recordedDay % 30) + 1;
                        return new BattlePassInfo(nextDay, 1, true, lastClaim);
                    }
                }
            }
        } catch (SQLException e) {
            log.error("Failed to load battle pass for account {}", accId, e);
        }

        return new BattlePassInfo(1, 1, true, null);
    }

    public boolean canClaim(Character chr) {
        return getInfo(chr).canClaimToday();
    }

    public ClaimResult claimReward(Character chr) {
        BattlePassInfo info = getInfo(chr);
        if (!info.canClaimToday()) {
            return ClaimResult.ALREADY_CLAIMED;
        }

        DayReward reward = rewards.get(info.day());
        if (reward == null) {
            return ClaimResult.ERROR;
        }

        // Check inventory space for each item
        for (RewardItem item : reward.items()) {
            if (!InventoryManipulator.checkSpace(chr.getClient(), item.itemId(), item.count(), "")) {
                return ClaimResult.NO_SPACE;
            }
        }

        // Give items
        for (RewardItem item : reward.items()) {
            InventoryManipulator.addById(chr.getClient(), item.itemId(), (short) item.count(), "", -1);
        }

        // Give NX
        if (reward.nx() > 0) {
            chr.getCashShop().gainCash(1, reward.nx());
            chr.showHint("Has recibido #b" + reward.nx() + " NX Cash#k del Pase de Batalla.", 300);
        }

        // Give Mesos
        if (reward.mesos() > 0) {
            chr.gainMeso(reward.mesos());
        }

        // Save to DB
        int accId = chr.getAccountID();
        int chrId = chr.getId();
        LocalDate today = LocalDate.now(TIMEZONE);

        String sql = "INSERT INTO battle_pass (account_id, character_id, day_count, streak_count, last_claim_date) "
                   + "VALUES (?, ?, ?, ?, ?) "
                   + "ON DUPLICATE KEY UPDATE character_id = VALUES(character_id), day_count = VALUES(day_count), streak_count = VALUES(streak_count), last_claim_date = VALUES(last_claim_date)";

        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, accId);
            ps.setInt(2, chrId);
            ps.setInt(3, info.day());
            ps.setInt(4, info.streak());
            ps.setDate(5, Date.valueOf(today));
            ps.executeUpdate();
            return ClaimResult.SUCCESS;
        } catch (SQLException e) {
            log.error("Failed to save battle pass claim for account {}", accId, e);
            return ClaimResult.ERROR;
        }
    }

    public DayReward getRewardForDay(int day) {
        return rewards.get(day);
    }

    public Map<Integer, DayReward> getAllRewards() {
        return Collections.unmodifiableMap(rewards);
    }
}
