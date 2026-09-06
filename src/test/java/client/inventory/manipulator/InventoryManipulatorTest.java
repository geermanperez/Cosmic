package client.inventory.manipulator;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InventoryManipulatorTest {

    @ParameterizedTest
    @CsvSource({
            "2060000, true",  // Bow arrow
            "2061000, true",  // Crossbow arrow
            "2070000, true",  // Throwing star
            "2330000, true",  // Bullet
            "2000000, false"  // Regular use item
    })
    void shouldDetermineWhetherDropRemovesEntireStack(int itemId, boolean expected) {
        assertEquals(expected, InventoryManipulator.dropsEntireStack(itemId));
    }
}
