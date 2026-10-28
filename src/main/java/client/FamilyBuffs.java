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

    public static int durationMillis(FamilyEntitlement entitlement) {
        int minutes = switch (entitlement) {
            case SELF_DROP_1_5, SELF_EXP_1_5, SELF_DROP_2, SELF_EXP_2 -> 15;
            case FAMILY_BONDING, SELF_DROP_2_30MIN, SELF_EXP_2_30MIN,
                    PARTY_DROP_2_30MIN, PARTY_EXP_2_30MIN -> 30;
            default -> throw new IllegalArgumentException("Not a hunting entitlement: " + entitlement);
        };
        return minutes * 60_000;
    }

    public static boolean affectsExperience(FamilyEntitlement entitlement) {
        return entitlement == FamilyEntitlement.FAMILY_BONDING || switch (entitlement) {
            case SELF_EXP_1_5, SELF_EXP_2, SELF_EXP_2_30MIN, PARTY_EXP_2_30MIN -> true;
            default -> false;
        };
    }

    public static boolean affectsDrop(FamilyEntitlement entitlement) {
        return entitlement == FamilyEntitlement.FAMILY_BONDING || switch (entitlement) {
            case SELF_DROP_1_5, SELF_DROP_2, SELF_DROP_2_30MIN, PARTY_DROP_2_30MIN -> true;
            default -> false;
        };
    }

    public static int ratePercent(FamilyEntitlement entitlement) {
        return entitlement == FamilyEntitlement.SELF_EXP_1_5
                || entitlement == FamilyEntitlement.SELF_DROP_1_5 ? 150 : 200;
    }

    public static void apply(int characterId, FamilyEntitlement entitlement) {
        int duration = durationMillis(entitlement);
        long now = System.currentTimeMillis();
        exp.values().removeIf(value -> value.expiresAt <= now);
        drop.values().removeIf(value -> value.expiresAt <= now);
        double rate = ratePercent(entitlement) / 100.0;
        Benefit benefit = new Benefit(rate, now + duration);
        if (affectsExperience(entitlement)) exp.put(characterId, benefit);
        if (affectsDrop(entitlement)) drop.put(characterId, benefit);
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
