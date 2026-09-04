package server;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class ShopItemSelectionTest {
    private final ShopItem redPotion = new ShopItem((short) 1000, 2000000, 50, 0);
    private final ShopItem bluePotion = new ShopItem((short) 1000, 2000003, 200, 0);
    private final List<ShopItem> items = List.of(redPotion, bluePotion);

    @Test void matchesValidSlotAndId() {
        assertSame(redPotion, Shop.findRequestedItem(items, (short) 0, 2000000));
    }

    @Test void resolvesKnownIdWhenSlotIsStale() {
        assertSame(bluePotion, Shop.findRequestedItem(items, (short) 0, 2000003));
        assertSame(bluePotion, Shop.findRequestedItem(items, (short) -1, 2000003));
    }

    @Test void neverUsesAnUnrelatedSlotForUnknownId() {
        assertNull(Shop.findRequestedItem(items, (short) 0, 9999999));
        assertNull(Shop.findRequestedItem(items, (short) 99, 9999999));
        assertNull(Shop.findRequestedItem(List.of(), (short) 0, 2000000));
    }
}
