# Combat damage validation

The attack parser now enforces the existing gross-damage threshold (five times
its estimated critical maximum) instead of merely recording a warning. This is
a conservative protection shared by melee, ranged and magic jobs, not a measured
DPS rebalance. Summons and Meso Explosion have separate paths.

Critical flags are decoded before comparison; -1 remains a miss. Each target
starts with the same base estimate, so elemental weakness cannot compound across
targets. Night Walker Triple Throw uses the throwing-star formula. Dark Sight
ends on melee/ranged attacks without requiring Vanish; GM Hide is preserved.

Before deployment, run `mvnw.cmd test` with JDK 21 and validate on a staging server:

- Night Walker: Vampire at low/max level, with/without Shadow Partner and Dark
  Sight, both with and without Vanish; check actual monster HP and healing.
- Darkness summon: verify its separate summon damage handler and expiration.
- Throwing jobs: Lucky Seven and Triple Throw with/without Shadow Partner.
- Warriors and mages: single and multiple targets, elemental weaknesses and
  critical/Sharp Eyes buffs; verify target order does not increase damage.
- Preserve special behavior: Snipe, Heaven's Hammer, Combo Tempest, Dojo skills,
  Meso Explosion, fixed-damage monsters, immunity and reflect.
- Compare normal and exaggerated damage packets; legitimate ordinary damage
  should remain unchanged, while excessive lines are capped before broadcast.

No WZ skill percentages or job-wide multipliers are changed by this correction.
The formulas are legacy estimates, so gameplay validation is still required
before reducing their tolerance or claiming all jobs have equivalent balance.
