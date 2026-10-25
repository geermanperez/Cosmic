package server.events;

import client.Character;
import client.inventory.InventoryType;
import client.inventory.Item;
import client.inventory.Pet;
import client.inventory.manipulator.InventoryManipulator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;

/**
 * Service for managing the EverleafMS 7-Day Rebirth Pass.
 *
 * Provides transactional claim reservation, reward distribution, persistence,
 * and duplicate protection across account and characters.
 */
public final class RebirthPassService {
    private static final Logger log = LoggerFactory.getLogger(RebirthPassService.class);
    private static final ZoneId EVENT_ZONE = ZoneId.of("America/Argentina/Catamarca");

    public static final int RESULT_SUCCESS = 0;
    public static final int RESULT_ALREADY_CLAIMED_TODAY = 1;
    public static final int RESULT_ALL_COMPLETED = 2;
    public static final int RESULT_INVENTORY_FULL = 3;
    public static final int RESULT_ERROR = 4;

    private RebirthPassService() { }

    public static LocalDate today() {
        return LocalDate.now(EVENT_ZONE);
    }

    /** Returns number of safely delivered rewards for an account. */
    public static int deliveredDays(int accountId) throws SQLException {
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(
                 "SELECT COUNT(*) FROM everleaf_rebirth_claims WHERE account_id = ? AND status = 'DELIVERED'")) {
            statement.setInt(1, accountId);
            try (ResultSet results = statement.executeQuery()) {
                return results.next() ? results.getInt(1) : 0;
            }
        }
    }

    /** Checks whether an account has an active claim (PENDING or DELIVERED) on a given date. */
    public static boolean hasClaimOnDate(int accountId, LocalDate date) throws SQLException {
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(
                 "SELECT 1 FROM everleaf_rebirth_claims WHERE account_id = ? AND claim_date = ? LIMIT 1")) {
            statement.setInt(1, accountId);
            statement.setDate(2, Date.valueOf(date));
            try (ResultSet results = statement.executeQuery()) {
                return results.next();
            }
        }
    }

    /**
     * Executes an atomic, idempotent claim for the next reward day of the Rebirth Pass.
     *
     * @param chr The character claiming the reward.
     * @return Result code (RESULT_SUCCESS, RESULT_ALREADY_CLAIMED_TODAY, RESULT_ALL_COMPLETED, RESULT_INVENTORY_FULL, RESULT_ERROR)
     */
    public static synchronized int claim(Character chr) {
        if (chr == null || chr.getClient() == null) {
            return RESULT_ERROR;
        }

        int accountId = chr.getAccountID();
        int characterId = chr.getId();
        LocalDate today = today();

        try {
            // 1. Check if already claimed today
            if (hasClaimOnDate(accountId, today)) {
                return RESULT_ALREADY_CLAIMED_TODAY;
            }

            // 2. Determine target day
            int completedDays = deliveredDays(accountId);
            int targetDay = completedDays + 1;
            if (targetDay > 7) {
                return RESULT_ALL_COMPLETED;
            }

            // 3. Validate inventory space before reserving
            if (!hasInventorySpace(chr, targetDay)) {
                return RESULT_INVENTORY_FULL;
            }

            // 4. Reserve claim exclusively in MySQL with status 'PENDING'
            long claimId = reserveClaim(accountId, targetDay, today, characterId);
            if (claimId <= 0) {
                return RESULT_ALREADY_CLAIMED_TODAY;
            }

            // 5. Grant rewards
            boolean delivered = deliverReward(chr, targetDay);
            if (!delivered) {
                markClaimFailed(claimId);
                return RESULT_ERROR;
            }

            // 6. Persist character and CashShop state
            try {
                chr.saveCharToDB(false);
                try (Connection con = DatabaseConnection.getConnection()) {
                    chr.getCashShop().save(con);
                }
            } catch (Exception e) {
                log.error("Failed to persist character state after rebirth claim for account {}", accountId, e);
                markClaimFailed(claimId);
                return RESULT_ERROR;
            }

            // 7. Transition reservation to 'DELIVERED'
            confirmClaimDelivered(claimId);
            return RESULT_SUCCESS;

        } catch (SQLException e) {
            log.error("Database error during Rebirth Pass claim for account {}", accountId, e);
            return RESULT_ERROR;
        } catch (Exception e) {
            log.error("Unexpected error during Rebirth Pass claim for account {}", accountId, e);
            return RESULT_ERROR;
        }
    }

    public static boolean hasInventorySpace(Character chr, int day) {
        switch (day) {
            case 1:
                return chr.getInventory(InventoryType.USE).getNumFreeSlot() >= 1;
            case 2:
                return chr.getInventory(InventoryType.CASH).getNumFreeSlot() >= 2;
            case 3:
                return chr.getInventory(InventoryType.CASH).getNumFreeSlot() >= 1;
            case 4:
                return chr.getInventory(InventoryType.CASH).getNumFreeSlot() >= 1;
            case 5:
                return chr.getInventory(InventoryType.CASH).getNumFreeSlot() >= 2;
            case 6:
                return chr.getInventory(InventoryType.CASH).getNumFreeSlot() >= 2;
            case 7:
                return chr.getInventory(InventoryType.SETUP).getNumFreeSlot() >= 1;
            default:
                return false;
        }
    }

    private static long reserveClaim(int accountId, int targetDay, LocalDate date, int characterId) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                 "INSERT INTO everleaf_rebirth_claims (account_id, pass_day, claim_date, status, character_id, created_at) " +
                 "VALUES (?, ?, ?, 'PENDING', ?, NOW())", Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, accountId);
            ps.setInt(2, targetDay);
            ps.setDate(3, Date.valueOf(date));
            ps.setInt(4, characterId);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        } catch (SQLIntegrityConstraintViolationException e) {
            log.warn("Rebirth Pass claim duplicate rejected for account {}, day {}: {}", accountId, targetDay, e.getMessage());
            return -1;
        } catch (SQLException e) {
            log.error("Failed to reserve Rebirth Pass claim for account {}", accountId, e);
            return -1;
        }
        return -1;
    }

    private static boolean deliverReward(Character chr, int day) {
        try {
            switch (day) {
                case 1:
                    chr.addMaxHp(100);
                    chr.addMaxMp(100);
                    chr.gainMeso(50000, true);
                    InventoryManipulator.addById(chr.getClient(), 2030000, (short) 5); // Return Scroll - Nearest Town
                    return true;
                case 2:
                    InventoryManipulator.addById(chr.getClient(), 5211000, (short) 2); // 2x 2x EXP Card
                    return true;
                case 3:
                    int petId = Pet.createPet(5000001); // Brown Puppy
                    if (petId <= 0) {
                        return false;
                    }
                    Item petItem = new Item(5000001, (short) 0, (short) 1, petId);
                    petItem.setExpiration(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(14));
                    InventoryManipulator.addFromDrop(chr.getClient(), petItem, true);
                    return true;
                case 4:
                    InventoryManipulator.addById(chr.getClient(), 5220000, (short) 3); // 3x Gachapon Ticket
                    chr.gainMeso(100000, true);
                    return true;
                case 5:
                    long rockExp = System.currentTimeMillis() + TimeUnit.DAYS.toMillis(7);
                    InventoryManipulator.addById(chr.getClient(), 5040000, (short) 1, rockExp); // 7-day Teleport Rock
                    InventoryManipulator.addById(chr.getClient(), 5211000, (short) 1); // 1x 2x EXP Card
                    return true;
                case 6:
                    InventoryManipulator.addById(chr.getClient(), 5150001, (short) 1); // Henesys Hair VIP
                    InventoryManipulator.addById(chr.getClient(), 5152001, (short) 1); // Henesys Face VIP
                    return true;
                case 7:
                    InventoryManipulator.addById(chr.getClient(), 3010000, (short) 1); // The Relaxer
                    chr.getCashShop().gainCash(1, 2000); // 2,000 NX Credit
                    chr.dropMessage(5, "You have received 2,000 NX Credit!");
                    return true;
                default:
                    return false;
            }
        } catch (Exception e) {
            log.error("Failed to deliver reward for day {} to character {}", day, chr.getId(), e);
            return false;
        }
    }

    private static void confirmClaimDelivered(long claimId) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                 "UPDATE everleaf_rebirth_claims SET status = 'DELIVERED', delivered_at = NOW() WHERE id = ?")) {
            ps.setLong(1, claimId);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to mark Rebirth Pass claim {} as DELIVERED", claimId, e);
        }
    }

    private static void markClaimFailed(long claimId) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                 "UPDATE everleaf_rebirth_claims SET status = 'FAILED' WHERE id = ?")) {
            ps.setLong(1, claimId);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to mark Rebirth Pass claim {} as FAILED", claimId, e);
        }
    }
}
