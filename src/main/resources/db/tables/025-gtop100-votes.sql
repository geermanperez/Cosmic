CREATE TABLE IF NOT EXISTS gtop100_votes (
    id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    siteid VARCHAR(64) NOT NULL,
    pb_id VARCHAR(128) NOT NULL,
    success TINYINT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL,
    vote_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45) NOT NULL,
    reward_nx INT NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 0,
    total_votes INT NOT NULL DEFAULT 0,
    last_weekly_reward TIMESTAMP NULL DEFAULT NULL,
    last_monthly_reward TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_vote (siteid, pb_id),
    KEY account_idx (account_id),
    CONSTRAINT fk_gtop100_votes_account 
        FOREIGN KEY (account_id) 
        REFERENCES accounts (id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;