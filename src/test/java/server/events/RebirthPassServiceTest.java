package server.events;

import client.Character;
import client.inventory.Inventory;
import client.inventory.InventoryType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RebirthPassServiceTest {

    @Test
    @DisplayName("today() should resolve to Argentina timezone (America/Argentina/Catamarca)")
    void testTodayTimeZone() {
        LocalDate expected = LocalDate.now(ZoneId.of("America/Argentina/Catamarca"));
        LocalDate actual = RebirthPassService.today();
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("hasInventorySpace should validate required slots per reward day")
    void testInventorySpaceValidation() {
        Character chr = mock(Character.class);
        Inventory useInv = mock(Inventory.class);
        Inventory cashInv = mock(Inventory.class);
        Inventory setupInv = mock(Inventory.class);

        when(chr.getInventory(InventoryType.USE)).thenReturn(useInv);
        when(chr.getInventory(InventoryType.CASH)).thenReturn(cashInv);
        when(chr.getInventory(InventoryType.SETUP)).thenReturn(setupInv);

        // Day 1 requires 1 Use slot
        when(useInv.getNumFreeSlot()).thenReturn((short) 0);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 1));
        when(useInv.getNumFreeSlot()).thenReturn((short) 1);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 1));

        // Day 2 requires 2 Cash slots
        when(cashInv.getNumFreeSlot()).thenReturn((short) 1);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 2));
        when(cashInv.getNumFreeSlot()).thenReturn((short) 2);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 2));

        // Day 3 requires 1 Cash slot
        when(cashInv.getNumFreeSlot()).thenReturn((short) 0);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 3));
        when(cashInv.getNumFreeSlot()).thenReturn((short) 1);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 3));

        // Day 4 requires 1 Cash slot
        when(cashInv.getNumFreeSlot()).thenReturn((short) 0);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 4));
        when(cashInv.getNumFreeSlot()).thenReturn((short) 1);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 4));

        // Day 5 requires 2 Cash slots (Teleport Rock + EXP Coupon)
        when(cashInv.getNumFreeSlot()).thenReturn((short) 1);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 5));
        when(cashInv.getNumFreeSlot()).thenReturn((short) 2);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 5));

        // Day 6 requires 2 Cash slots (VIP Hair + VIP Face)
        when(cashInv.getNumFreeSlot()).thenReturn((short) 1);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 6));
        when(cashInv.getNumFreeSlot()).thenReturn((short) 2);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 6));

        // Day 7 requires 1 Setup slot (The Relaxer chair)
        when(setupInv.getNumFreeSlot()).thenReturn((short) 0);
        assertFalse(RebirthPassService.hasInventorySpace(chr, 7));
        when(setupInv.getNumFreeSlot()).thenReturn((short) 1);
        assertTrue(RebirthPassService.hasInventorySpace(chr, 7));
    }

    @Test
    @DisplayName("Null character should safely fail closed with RESULT_ERROR")
    void testNullCharacterClaim() {
        int result = RebirthPassService.claim(null);
        assertEquals(RebirthPassService.RESULT_ERROR, result);
    }
}
