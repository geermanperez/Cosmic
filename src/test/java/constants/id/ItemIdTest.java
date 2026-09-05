package constants.id;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ItemIdTest {

    @Test
    void recognizesTheWholeSevenDigitPetCategory() {
        assertTrue(ItemId.isPet(5000000));
        assertTrue(ItemId.isPet(5002292));
        assertTrue(ItemId.isPet(5009999));
        assertFalse(ItemId.isPet(5010000));
        assertFalse(ItemId.isPet(4999999));
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
