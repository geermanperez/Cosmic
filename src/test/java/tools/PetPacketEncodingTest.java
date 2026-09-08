package tools;

import client.Character;
import client.inventory.Pet;
import net.opcodes.SendOpcode;
import net.packet.OutPacket;
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
    void remotePlayerSpawnEncodesRemotePets() {
        Pet pet = mock(Pet.class);
        when(pet.getItemId()).thenReturn(5002292);
        when(pet.getName()).thenReturn("Nova");
        when(pet.getUniqueId()).thenReturn(0x10203040);
        when(pet.getPos()).thenReturn(new Point(120, -35));
        when(pet.getStance()).thenReturn(3);
        when(pet.getFh()).thenReturn(9876);

        OutPacket packet = OutPacket.create(SendOpcode.SPAWN_PLAYER);
        PacketCreator.addRemotePetInfo(packet, new Pet[]{pet, null, null});

        ByteBuffer b = ByteBuffer.wrap(packet.getBytes()).order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.SPAWN_PLAYER.getValue(), b.getShort());
        assertEquals(1, b.get()); // has_pet = 1
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
        assertEquals(0, b.get()); // end of remote pets
        assertFalse(b.hasRemaining());
    }

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
    void despawnPetLocalIncludesReasonByte() {
        Character chr = mock(Character.class);
        Pet pet = mock(Pet.class);
        when(chr.getId()).thenReturn(1234);
        when(chr.getPetIndex(pet)).thenReturn((byte) 2);

        // Hunger unsummon
        ByteBuffer bHunger = ByteBuffer.wrap(PacketCreator.showPet(chr, pet, true, true).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.SPAWN_PET.getValue(), bHunger.getShort());
        assertEquals(1234, bHunger.getInt());
        assertEquals(2, bHunger.get());
        assertEquals(0, bHunger.get());
        assertEquals(1, bHunger.get()); // hunger reason
        assertFalse(bHunger.hasRemaining());

        // Normal unsummon
        ByteBuffer bNormal = ByteBuffer.wrap(PacketCreator.showPet(chr, pet, true, false).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.SPAWN_PET.getValue(), bNormal.getShort());
        assertEquals(1234, bNormal.getInt());
        assertEquals(2, bNormal.get());
        assertEquals(0, bNormal.get());
        assertEquals(0, bNormal.get()); // normal unsummon reason
        assertFalse(bNormal.hasRemaining());
    }

    @Test
    void despawnPetRemoteOmitsReasonByte() {
        Character chr = mock(Character.class);
        Pet pet = mock(Pet.class);
        when(chr.getId()).thenReturn(1234);
        when(chr.getPetIndex(pet)).thenReturn((byte) 2);

        ByteBuffer b = ByteBuffer.wrap(PacketCreator.removeRemotePet(chr, pet).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.SPAWN_PET.getValue(), b.getShort());
        assertEquals(1234, b.getInt());
        assertEquals(2, b.get());
        assertEquals(0, b.get());
        assertFalse(b.hasRemaining()); // NO reason byte for remote client
    }

    @Test
    void movePetEncodesStartPosAndMovementList() {
        Point startPos = new Point(450, -120);
        server.movement.LifeMovementFragment move = mock(server.movement.LifeMovementFragment.class);

        ByteBuffer b = ByteBuffer.wrap(PacketCreator.movePet(1234, (byte) 0, startPos, java.util.List.of(move)).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.MOVE_PET.getValue(), b.getShort());
        assertEquals(1234, b.getInt());
        assertEquals(0, b.get()); // slot
        assertEquals(450, b.getShort()); // startPos.x
        assertEquals(-120, b.getShort()); // startPos.y
        assertEquals(1, b.get()); // moves.size()
    }
}
