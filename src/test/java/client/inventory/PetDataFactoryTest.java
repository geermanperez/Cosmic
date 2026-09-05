package client.inventory;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PetDataFactoryTest {
    @Test
    void loadsImportedEverleafPetMetadata() {
        assertEquals(2, PetDataFactory.getHunger(5002292));
        assertEquals(2, PetDataFactory.getHunger(5002293));
    }

    @Test
    void missingServerMetadataUsesSafeDefaultHungerRate() {
        assertEquals(1, PetDataFactory.getHunger(5009999));
    }
}
