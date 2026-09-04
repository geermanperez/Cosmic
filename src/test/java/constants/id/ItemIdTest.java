package constants.id;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ItemIdTest {

    @Test
    void quarantinesAllNonClassicPets() {
        assertTrue(ItemId.isYunaQuarantinedPet(5002292));
        assertTrue(ItemId.isYunaQuarantinedPet(5002293));
        assertTrue(ItemId.isYunaQuarantinedCashItem(5002292));
        assertTrue(ItemId.isYunaQuarantinedCashItem(5002293));
        assertTrue(ItemId.isYunaQuarantinedPet(5002291));
        assertTrue(ItemId.isYunaQuarantinedPet(5002294));
        assertTrue(ItemId.isYunaQuarantinedPet(5001000));
        assertTrue(ItemId.isYunaQuarantinedPet(5009999));
        assertFalse(ItemId.isYunaQuarantinedPet(5010000));
        assertFalse(ItemId.isYunaQuarantinedPet(4999999));
        assertFalse(ItemId.isYunaQuarantinedPet(5000054));
        assertFalse(ItemId.isYunaQuarantinedPet(5000102));
        assertFalse(ItemId.isYunaQuarantinedCashItem(5000000));
        assertFalse(ItemId.isYunaQuarantinedCashItem(2000000));
    }

    @Test
    void allowsTheFiveReenabledPetAbilities() {
        assertFalse(ItemId.isYunaQuarantinedCashItem(ItemId.MESO_MAGNET));
        assertFalse(ItemId.isYunaQuarantinedCashItem(ItemId.ITEM_POUCH));
        assertFalse(ItemId.isYunaQuarantinedCashItem(ItemId.AUTO_HP_POTION_POUCH));
        assertFalse(ItemId.isYunaQuarantinedCashItem(ItemId.AUTO_MP_POTION_POUCH));
        assertFalse(ItemId.isYunaQuarantinedCashItem(ItemId.WING_BOOTS));
        assertFalse(ItemId.isYunaQuarantinedCashItem(1811999));
        assertFalse(ItemId.isYunaQuarantinedCashItem(1812005));
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
