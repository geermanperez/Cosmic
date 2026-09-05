package server;

import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class CashPetPolicyTest {
    private CashShop.CashItem item(int sn, int id) throws Exception {
        var constructor = CashShop.CashItem.class.getDeclaredConstructor(
                int.class, int.class, int.class, long.class, short.class, boolean.class);
        constructor.setAccessible(true);
        return constructor.newInstance(sn, id, 1, 90L, (short) 1, true);
    }

    @Test void allowsAllPetsAndRejectsBrokenOrRecursivePackages() throws Exception {
        var itemField = CashShop.CashItemFactory.class.getDeclaredField("items");
        var packageField = CashShop.CashItemFactory.class.getDeclaredField("packages");
        itemField.setAccessible(true);
        packageField.setAccessible(true);
        Object oldItems = itemField.get(null), oldPackages = packageField.get(null);
        try {
            var classic = item(1, 5000000);
            var modern = item(2, 5002500);
            var nested = item(3, 9100001);
            itemField.set(null, Map.of(1, classic, 2, modern, 3, nested));
            packageField.set(null, Map.of(9100000, List.of(1), 9100001, List.of(1, 2),
                    9100002, List.of(3), 9100003, List.of(999)));
            assertTrue(classic.isOnSale());
            assertTrue(modern.isOnSale());
            assertTrue(CashShop.CashItemFactory.isAllowed(9100000));
            assertTrue(CashShop.CashItemFactory.isAllowed(9100001));
            assertTrue(CashShop.CashItemFactory.isAllowed(9100002));
            assertFalse(CashShop.CashItemFactory.isAllowed(9100003));
            assertTrue(CashShop.CashItemFactory.isAllowed(1812000));
            packageField.set(null, Map.of(9100001, List.of(3)));
            assertFalse(CashShop.CashItemFactory.isAllowed(9100001));
        } finally {
            itemField.set(null, oldItems);
            packageField.set(null, oldPackages);
        }
    }
}
