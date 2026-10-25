package server.events;

import tools.DatabaseConnection;
import java.sql.*;
import java.time.LocalDate;
import java.time.ZoneId;

/**
 * Persistence boundary for the Everleaf Rebirth Pass.
 *
 * Deliberately does not grant rewards: inventory persistence and the
 * DELIVERED transition must be made crash-safe before claims are enabled.
 */
public final class RebirthPassService {
    private static final ZoneId EVENT_ZONE = ZoneId.of("America/Argentina/Catamarca");

    private RebirthPassService() { }

    public static LocalDate today() {
        return LocalDate.now(EVENT_ZONE);
    }

    /** Read-only: number of safely delivered rewards for an account. */
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

    /** Read-only: includes PENDING rows so an interrupted claim cannot be retried blindly. */
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

    /** Intentionally unavailable until reward delivery and recovery are implemented. */
    public static boolean claim(int accountId, int characterId) {
        return false;
    }
}
