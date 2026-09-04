package tools;

import client.Stat;
import org.junit.jupiter.api.Test;
import server.ShopItem;
import net.opcodes.SendOpcode;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class NpcShopEncodingTest {
    @Test void decodesMixedPotionAndRechargeRowsExactlyLikeLocalClient() {
        var items = List.of(new ShopItem((short) 1000, 2000000, 50, 0),
                new ShopItem((short) 1000, 2000003, 200, 0),
                new ShopItem((short) 1, 2070000, 0, 0));
        byte[] bytes = PacketCreator.encodeNPCShop(1011100, items, id -> 0.3, id -> 1000).getBytes();
        assertEquals(8 + 24 + 24 + 30, bytes.length);
        var b = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.OPEN_NPC_SHOP.getValue(), b.getShort());
        assertEquals(1011100, b.getInt());
        assertEquals(3, b.getShort());
        for (ShopItem item : items) {
            assertEquals(item.getItemId(), b.getInt());
            assertEquals(item.getPrice(), b.getInt());
            assertEquals(0, b.getInt());
            assertEquals(0, b.getInt());
            assertEquals(0, b.getInt());
            if (item.getItemId() / 10000 == 207) {
                assertEquals(0.3, b.getDouble());
                assertEquals(1000, b.getShort());
            } else {
                assertEquals(1, b.getShort());
                assertEquals(1000, b.getShort());
            }
        }
        assertFalse(b.hasRemaining());
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
