package client;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FamilyBuffsTest {
    @Test
    void screenshotEntitlementDoublesOnlyExperience() {
        FamilyBuffs.apply(-1001, FamilyEntitlement.SELF_EXP_2_30MIN);
        assertEquals(2.0, FamilyBuffs.expRate(-1001));
        assertEquals(1.0, FamilyBuffs.dropRate(-1001));
    }

    @Test
    void fractionalDropBonusIsPreserved() {
        FamilyBuffs.apply(-1002, FamilyEntitlement.SELF_DROP_1_5);
        assertEquals(1.5, FamilyBuffs.dropRate(-1002));
        assertEquals(1.0, FamilyBuffs.expRate(-1002));
    }

    @Test
    void bondingGrantsBothBenefits() {
        FamilyBuffs.apply(-1003, FamilyEntitlement.FAMILY_BONDING);
        assertEquals(2.0, FamilyBuffs.expRate(-1003));
        assertEquals(2.0, FamilyBuffs.dropRate(-1003));
    }

    @Test
    void benefitExpiresAtDeadline() {
        FamilyBuffs.Benefit benefit = new FamilyBuffs.Benefit(2.0, 1000);
        assertEquals(2.0, benefit.activeRate(999));
        assertEquals(1.0, benefit.activeRate(1000));
        assertEquals(1.0, benefit.activeRate(1001));
    }

    @Test
    void teleportCannotGrantHuntingBonus() {
        assertThrows(IllegalArgumentException.class,
                () -> FamilyBuffs.apply(-1004, FamilyEntitlement.FAMILY_REUINION));
        assertEquals(1.0, FamilyBuffs.expRate(-1004));
        assertEquals(1.0, FamilyBuffs.dropRate(-1004));
    }
}
