package client;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Timed hunting benefits survive character reconstruction during channel changes. */
public final class FamilyBuffs {
    record Benefit(double rate, long expiresAt) {
        double activeRate(long now) {
            return now < expiresAt ? rate : 1.0;
        }
    }

    private static final Map<Integer, Benefit> exp = new ConcurrentHashMap<>();
    private static final Map<Integer, Benefit> drop = new ConcurrentHashMap<>();

    private FamilyBuffs() {}

    public static void apply(int characterId, FamilyEntitlement entitlement) {
        int minutes = switch (entitlement) {
            case SELF_DROP_1_5, SELF_EXP_1_5, SELF_DROP_2, SELF_EXP_2 -> 15;
            case FAMILY_BONDING, SELF_DROP_2_30MIN, SELF_EXP_2_30MIN,
                    PARTY_DROP_2_30MIN, PARTY_EXP_2_30MIN -> 30;
            default -> throw new IllegalArgumentException("Not a hunting entitlement: " + entitlement);
        };
        long now = System.currentTimeMillis();
        exp.values().removeIf(value -> value.expiresAt <= now);
        drop.values().removeIf(value -> value.expiresAt <= now);
        boolean bonding = entitlement == FamilyEntitlement.FAMILY_BONDING;
        boolean experience = switch (entitlement) {
            case SELF_EXP_1_5, SELF_EXP_2, SELF_EXP_2_30MIN, PARTY_EXP_2_30MIN -> true;
            default -> false;
        };
        double rate = entitlement == FamilyEntitlement.SELF_EXP_1_5
                || entitlement == FamilyEntitlement.SELF_DROP_1_5 ? 1.5 : 2.0;
        Benefit benefit = new Benefit(rate, now + minutes * 60_000L);
        if (experience || bonding) exp.put(characterId, benefit);
        if (!experience || bonding) drop.put(characterId, benefit);
    }

    private static double rate(Map<Integer, Benefit> benefits, int characterId) {
        Benefit benefit = benefits.get(characterId);
        if (benefit == null) return 1.0;
        long now = System.currentTimeMillis();
        if (now >= benefit.expiresAt) benefits.remove(characterId, benefit);
        return benefit.activeRate(now);
    }

    public static double expRate(int characterId) {
        return rate(exp, characterId);
    }

    public static double dropRate(int characterId) {
        return rate(drop, characterId);
    }
}
