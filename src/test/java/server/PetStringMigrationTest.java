package server;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import tools.DatabaseConnection;

import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;

class PetStringMigrationTest {
    private static ItemInformationProvider items;

    @BeforeAll
    static void loadItemDataWithoutLiveDatabase() {
        try (var database = mockStatic(DatabaseConnection.class)) {
            database.when(DatabaseConnection::getConnection)
                    .thenReturn(mock(Connection.class, RETURNS_DEEP_STUBS));
            items = ItemInformationProvider.getInstance();
        }
    }

    @Test
    void loadsAffectedEverleafPetNames() {
        assertEquals("DOGDOG", items.getName(5002292));
        assertEquals("Black Ewe", items.getName(5002293));
    }
}
