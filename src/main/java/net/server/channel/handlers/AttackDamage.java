package net.server.channel.handlers;

/** Validates packet damage before applying the critical display flag. */
final class AttackDamage {
    private AttackDamage() {}

    static int magnitude(int damage) {
        return damage == -1 ? 0 : damage & Integer.MAX_VALUE;
    }

    static int cap(int damage, long estimatedMaximum) {
        // Preserve the legacy 5x tolerance because the damage formulas are estimates.
        long limit = Math.min(Integer.MAX_VALUE, Math.max(0L, estimatedMaximum));
        limit = Math.min(Integer.MAX_VALUE, limit * 5L);
        return (int) Math.min(magnitude(damage), limit);
    }
}
