package net.server.channel.handlers;

import client.Character;
import client.inventory.Inventory;
import client.inventory.InventoryType;
import client.inventory.Item;
import client.inventory.Pet;
import server.CashShop;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class PetQuarantineTest {
    @Test void preservesPetItemsInCashStorageWithoutSendingEarlyPackets() throws Exception {
        Character player = mock(Character.class);
        Inventory equip = mock(Inventory.class);
        Inventory equipped = mock(Inventory.class);
        Inventory cash = mock(Inventory.class);
        CashShop storage = mock(CashShop.class);
        Pet pet = mock(Pet.class);
        Item dog = mock(Item.class);
        Item ewe = mock(Item.class);
        Item other = mock(Item.class);
        when(pet.getItemId()).thenReturn(5002292);
        when(player.getPets()).thenReturn(new Pet[]{pet, null, null});
        when(player.getInventory(InventoryType.EQUIP)).thenReturn(equip);
        when(player.getInventory(InventoryType.EQUIPPED)).thenReturn(equipped);
        when(player.getInventory(InventoryType.CASH)).thenReturn(cash);
        when(player.getCashShop()).thenReturn(storage);
        when(equip.list()).thenReturn(List.of());
        when(equipped.list()).thenReturn(List.of());
        when(cash.list()).thenReturn(List.of(dog, ewe, other));
        when(dog.getItemId()).thenReturn(5002292);
        when(dog.getPosition()).thenReturn((short) 1);
        when(ewe.getItemId()).thenReturn(5002293);
        when(ewe.getPosition()).thenReturn((short) 2);
        when(other.getItemId()).thenReturn(5000000);
        var method = PlayerLoggedinHandler.class.getDeclaredMethod("quarantineUnsupportedPetAbilities", Character.class);
        method.setAccessible(true);
        assertEquals(2, method.invoke(new PlayerLoggedinHandler(mock(service.NoteService.class)), player));
        verify(pet).setSummoned(false);
        verify(pet).saveToDb();
        verify(player).removePet(pet, false);
        verify(cash).removeSlot((short) 1);
        verify(cash).removeSlot((short) 2);
        verify(dog).setPosition((short) 0);
        verify(ewe).setPosition((short) 0);
        verify(storage).addToInventory(dog);
        verify(storage).addToInventory(ewe);
        verify(storage, never()).addToInventory(other);
        verify(player, never()).getClient();
    }
}
