-- Everlaf MS - ONE-TIME player wipe
-- Resets player/account data while preserving static gameplay content.
-- Safe for future redeploys: once completed, the marker prevents another wipe.

USE cosmic;

CREATE TABLE IF NOT EXISTS everlaf_system_flags (
    flag_key VARCHAR(64) NOT NULL PRIMARY KEY,
    flag_value VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SET @EVERLAF_RESET_DONE = (
    SELECT COUNT(*)
    FROM everlaf_system_flags
    WHERE flag_key = 'player_wipe_2026_launch'
);

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

DROP PROCEDURE IF EXISTS everlaf_launch_reset;
DELIMITER $$
CREATE PROCEDURE everlaf_launch_reset()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE tbl VARCHAR(128);

    DECLARE cur CURSOR FOR
        SELECT DISTINCT TABLE_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND LOWER(COLUMN_NAME) IN (
              'characterid', 'character_id', 'charid', 'char_id',
              'accountid', 'account_id'
          )
          AND TABLE_NAME NOT IN (
              'accounts',
              'characters',
              'everlaf_system_flags'
          )
          AND TABLE_NAME NOT LIKE 'databasechangelog%';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF @EVERLAF_RESET_DONE = 0 THEN
        OPEN cur;
        reset_loop: LOOP
            FETCH cur INTO tbl;
            IF done = 1 THEN
                LEAVE reset_loop;
            END IF;

            SET @sql = CONCAT('DELETE FROM `', REPLACE(tbl, '`', '``'), '`');
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END LOOP;
        CLOSE cur;

        DELETE FROM characters;
        DELETE FROM accounts;

        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'guilds') THEN DELETE FROM guilds; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'alliance') THEN DELETE FROM alliance; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'alliances') THEN DELETE FROM alliances; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'family_character') THEN DELETE FROM family_character; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'families') THEN DELETE FROM families; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messenger') THEN DELETE FROM messenger; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messenger_members') THEN DELETE FROM messenger_members; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'party') THEN DELETE FROM party; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'parties') THEN DELETE FROM parties; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dueyitems') THEN DELETE FROM dueyitems; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'dueypackages') THEN DELETE FROM dueypackages; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hiredmerchants') THEN DELETE FROM hiredmerchants; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'playernpcs') THEN DELETE FROM playernpcs; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'playernpcs_equip') THEN DELETE FROM playernpcs_equip; END IF;
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'FredStorage') THEN DELETE FROM FredStorage; END IF;

        ALTER TABLE characters AUTO_INCREMENT = 1;
        ALTER TABLE accounts AUTO_INCREMENT = 1;

        INSERT INTO everlaf_system_flags(flag_key, flag_value)
        VALUES ('player_wipe_2026_launch', 'Everlaf MS launch wipe completed');
    END IF;
END$$
DELIMITER ;

CALL everlaf_launch_reset();
DROP PROCEDURE everlaf_launch_reset;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

SELECT
    CASE WHEN EXISTS (
        SELECT 1 FROM everlaf_system_flags WHERE flag_key = 'player_wipe_2026_launch'
    ) THEN 'Everlaf MS wipe marker present' ELSE 'Everlaf MS wipe marker missing' END AS reset_status;
SELECT COUNT(*) AS remaining_accounts FROM accounts;
SELECT COUNT(*) AS remaining_characters FROM characters;
