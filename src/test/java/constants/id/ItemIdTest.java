package constants.id;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ItemIdTest {

    @Test
    void quarantinesOnlyTheTwoCustomPetsAndExistingAbilities() {
        assertTrue(ItemId.isYunaQuarantinedPet(5002292));
        assertTrue(ItemId.isYunaQuarantinedPet(5002293));
        assertTrue(ItemId.isYunaQuarantinedCashItem(5002292));
        assertTrue(ItemId.isYunaQuarantinedCashItem(ItemId.MESO_MAGNET));
        assertFalse(ItemId.isYunaQuarantinedPet(5002291));
        assertFalse(ItemId.isYunaQuarantinedPet(5002294));
        assertFalse(ItemId.isYunaQuarantinedCashItem(5000000));
        assertFalse(ItemId.isYunaQuarantinedCashItem(2000000));
    }

    @Test
    void detectsYunaUnsupportedPetAbilities() {
        assertTrue(ItemId.isYunaUnsupportedPetAbility(ItemId.MESO_MAGNET));
        assertTrue(ItemId.isYunaUnsupportedPetAbility(ItemId.ITEM_POUCH));
        assertTrue(ItemId.isYunaUnsupportedPetAbility(ItemId.AUTO_HP_POTION_POUCH));
        assertTrue(ItemId.isYunaUnsupportedPetAbility(ItemId.AUTO_MP_POTION_POUCH));
        assertTrue(ItemId.isYunaUnsupportedPetAbility(ItemId.WING_BOOTS));
        assertFalse(ItemId.isYunaUnsupportedPetAbility(1811999));
        assertFalse(ItemId.isYunaUnsupportedPetAbility(1812005));
    }

    @Test
    void isCashPackage() {
        assertTrue(ItemId.isCashPackage(9102237));
    }

    @Test
    void isNotCashPackage() {
        assertFalse(ItemId.isCashPackage(4000000));
    }
}
