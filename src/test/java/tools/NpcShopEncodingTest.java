package tools;

import client.Stat;
import client.inventory.Item;
import client.inventory.ModifyInventory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import server.ItemInformationProvider;
import java.sql.Connection;
import server.ShopItem;
import net.opcodes.SendOpcode;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NpcShopEncodingTest {
    @BeforeAll static void loadItemDataWithoutLiveDatabase() {
        try (var database = mockStatic(DatabaseConnection.class)) {
            database.when(DatabaseConnection::getConnection)
                    .thenReturn(mock(Connection.class, RETURNS_DEEP_STUBS));
            ItemInformationProvider.getInstance();
        }
    }

    @Test void decodesMixedPotionAndRechargeRowsExactlyLikeLocalClient() {
        var items = List.of(new ShopItem((short) 1000, 2000000, 50, 0),
                new ShopItem((short) 1000, 2000003, 200, 0),
                new ShopItem((short) 1000, 2060000, 1, 0),
                new ShopItem((short) 1000, 2061000, 1, 0),
                new ShopItem((short) 1, 2070000, 0, 0),
                new ShopItem((short) 1, 2330000, 0, 0),
                new ShopItem((short) 1000, 2000001, 160, 0));
        byte[] bytes = PacketCreator.encodeNPCShop(1011100, items, id -> 0.3, id -> 1000).getBytes();
        assertEquals(8 + 3 * 24 + 4 * 30, bytes.length);
        var b = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.OPEN_NPC_SHOP.getValue(), b.getShort());
        assertEquals(1011100, b.getInt());
        assertEquals(7, b.getShort());
        for (ShopItem item : items) {
            assertEquals(item.getItemId(), b.getInt());
            assertEquals(item.getPrice(), b.getInt());
            assertEquals(0, b.getInt());
            assertEquals(0, b.getInt());
            assertEquals(0, b.getInt());
            int category = item.getItemId() / 10000;
            // Stock EXE handles 207; Yuna's shop hook adds 206 alongside 233.
            if (category == 206 || category == 207 || category == 233) {
                assertEquals(0.3, b.getDouble());
                assertEquals(1000, b.getShort());
            } else {
                assertEquals(1, b.getShort());
                assertEquals(1000, b.getShort());
            }
        }
        assertFalse(b.hasRemaining());
    }

    @Test void arrowItemTrailerKeepsFollowingPotionAligned() {
        for (int arrowId : List.of(2060000, 2061000)) {
            var arrow = new Item(arrowId, (short) 1, (short) 100);
            var potion = new Item(2000000, (short) 2, (short) 5);
            var bytes = PacketCreator.modifyInventory(true, List.of(
                    new ModifyInventory(0, arrow), new ModifyInventory(0, potion))).getBytes();
            var b = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
            assertEquals(SendOpcode.INVENTORY_OPERATION.getValue(), b.getShort());
            assertEquals(1, b.get());
            assertEquals(2, b.get());
            for (Item item : List.of(arrow, potion)) {
                assertEquals(0, b.get()); // add
                assertEquals(2, b.get()); // USE inventory
                assertEquals(item.getPosition(), b.getShort());
                assertEquals(2, b.get()); // bundle item
                assertEquals(item.getItemId(), b.getInt());
                assertEquals(0, b.get()); // not cash
                b.getLong(); // expiration
                assertEquals(item.getQuantity(), b.getShort());
                assertEquals(0, b.getShort()); // empty owner
                assertEquals(0, b.getShort()); // flags
                if (item == arrow) {
                    b.getLong(); // Yuna's 0x4E3FDF hook consumes the serial for arrows
                }
            }
            assertFalse(b.hasRemaining());
        }
    }

    @Test void hairAndMesoUpdatesUseFourByteValuesWithoutPetTrailer() {
        for (Stat stat : List.of(Stat.HAIR, Stat.MESO)) {
            byte[] bytes = PacketCreator.updatePlayerStats(List.of(new Pair<>(stat, 31000)), true, null).getBytes();
            assertEquals(11, bytes.length);
            var b = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
            assertEquals(SendOpcode.STAT_CHANGED.getValue(), b.getShort());
            assertEquals(1, b.get());
            assertEquals(stat.getValue(), b.getInt());
            assertEquals(31000, b.getInt());
            assertFalse(b.hasRemaining());
        }
    }
}
