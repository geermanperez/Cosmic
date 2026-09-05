package tools;

import client.Character;
import client.inventory.Pet;
import net.opcodes.SendOpcode;
import org.junit.jupiter.api.Test;

import java.awt.Point;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PetPacketEncodingTest {
    @Test
    void spawnPetMatchesEverleafClientDecoder() {
        Character chr = mock(Character.class);
        Pet pet = mock(Pet.class);
        when(chr.getId()).thenReturn(1234);
        when(chr.getPetIndex(pet)).thenReturn((byte) 1);
        when(pet.getItemId()).thenReturn(5002292);
        when(pet.getName()).thenReturn("Nova");
        when(pet.getUniqueId()).thenReturn(0x10203040);
        when(pet.getPos()).thenReturn(new Point(120, -35));
        when(pet.getStance()).thenReturn(3);
        when(pet.getFh()).thenReturn(9876);

        ByteBuffer b = ByteBuffer.wrap(PacketCreator.showPet(chr, pet, false, false).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.SPAWN_PET.getValue(), b.getShort());
        assertEquals(1234, b.getInt());
        assertEquals(1, b.get());
        assertEquals(1, b.get()); // active
        assertEquals(0, b.get()); // client creation flag
        assertEquals(5002292, b.getInt());
        assertEquals(4, b.getShort());
        assertEquals('N', b.get());
        assertEquals('o', b.get());
        assertEquals('v', b.get());
        assertEquals('a', b.get());
        assertEquals(0x10203040L, b.getLong());
        assertEquals(120, b.getShort());
        assertEquals(-35, b.getShort());
        assertEquals(3, b.get());
        assertEquals(9876, b.getShort());
        assertEquals(0, b.get()); // name-tag override
        assertEquals(0, b.get()); // chat-balloon override
        assertFalse(b.hasRemaining());
    }

    @Test
    void despawnPetEndsAfterTheActiveFlag() {
        Character chr = mock(Character.class);
        Pet pet = mock(Pet.class);
        when(chr.getId()).thenReturn(1234);
        when(chr.getPetIndex(pet)).thenReturn((byte) 2);

        ByteBuffer b = ByteBuffer.wrap(PacketCreator.showPet(chr, pet, true, true).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.SPAWN_PET.getValue(), b.getShort());
        assertEquals(1234, b.getInt());
        assertEquals(2, b.get());
        assertEquals(0, b.get());
        assertFalse(b.hasRemaining());
    }
}
