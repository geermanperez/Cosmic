CREATE TABLE IF NOT EXISTS boss_ranking (
    character_id INT NOT NULL,
    boss_id      INT NOT NULL,
    boss_name    VARCHAR(40) NOT NULL,
    kills        INT NOT NULL DEFAULT 0,
    points       INT NOT NULL DEFAULT 0,
    last_kill_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (character_id, boss_id),
    KEY idx_boss_ranking_points (points),
    KEY idx_boss_ranking_character (character_id),
    KEY idx_boss_ranking_last_kill (last_kill_at)
);
