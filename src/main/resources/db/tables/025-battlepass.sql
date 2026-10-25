CREATE TABLE IF NOT EXISTS battle_pass
(
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    account_id      INT          NOT NULL,
    character_id    INT          NOT NULL,
    day_count       INT          NOT NULL DEFAULT 1,
    streak_count    INT          NOT NULL DEFAULT 1,
    last_claim_date DATE         NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (account_id)
);
