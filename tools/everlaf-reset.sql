-- Everlaf MS - Player wipe only
-- Purpose: reset accounts, characters and player-owned runtime data WITHOUT
-- deleting static server content such as drops, mobs, NPC/PQ scripts, maps or WZ data.
--
-- IMPORTANT:
-- 1) Stop the MapleStory server before running this script.
-- 2) Make a database backup first.
-- 3) Run against the `cosmic` database.
-- 4) Restart the server after completion.

USE cosmic;

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

DROP PROCEDURE IF EXISTS everlaf_delete_player_tables;
DELIMITER $$
CREATE PROCEDURE everlaf_delete_player_tables()
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
          AND TABLE_NAME NOT IN ('accounts', 'characters')
          -- Static/configuration tables must never be wiped by this reset.
          AND TABLE_NAME NOT LIKE 'databasechangelog%';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

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
END$$
DELIMITER ;

CALL everlaf_delete_player_tables();
DROP PROCEDURE everlaf_delete_player_tables;

-- Core player entities. Characters first, then accounts.
DELETE FROM characters;
DELETE FROM accounts;

-- Clean social/runtime tables that may not expose accountid/characterid columns.
-- Each block is conditional so the script remains compatible with schema revisions.
DROP PROCEDURE IF EXISTS everlaf_clear_if_exists;
DELIMITER $$
CREATE PROCEDURE everlaf_clear_if_exists(IN tbl VARCHAR(128))
BEGIN
    IF EXISTS (
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = tbl
    ) THEN
        SET @sql = CONCAT('DELETE FROM `', REPLACE(tbl, '`', '``'), '`');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

CALL everlaf_clear_if_exists('guilds');
CALL everlaf_clear_if_exists('alliance');
CALL everlaf_clear_if_exists('alliances');
CALL everlaf_clear_if_exists('family_character');
CALL everlaf_clear_if_exists('families');
CALL everlaf_clear_if_exists('messenger');
CALL everlaf_clear_if_exists('messenger_members');
CALL everlaf_clear_if_exists('party');
CALL everlaf_clear_if_exists('parties');
CALL everlaf_clear_if_exists('dueyitems');
CALL everlaf_clear_if_exists('dueypackages');
CALL everlaf_clear_if_exists('hiredmerchants');
CALL everlaf_clear_if_exists('playernpcs');
CALL everlaf_clear_if_exists('playernpcs_equip');
CALL everlaf_clear_if_exists('FredStorage');

DROP PROCEDURE everlaf_clear_if_exists;

-- Reset AUTO_INCREMENT where supported and relevant.
ALTER TABLE characters AUTO_INCREMENT = 1;
ALTER TABLE accounts AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

-- Validation: both values must be 0 after a successful wipe.
SELECT COUNT(*) AS remaining_accounts FROM accounts;
SELECT COUNT(*) AS remaining_characters FROM characters;

-- Static gameplay tables are intentionally untouched.
-- Examples: drop tables, mob/drop configuration, shop configuration,
-- Liquibase changelog tables, server scripts, WZ/XML maps and PQ/event scripts.
