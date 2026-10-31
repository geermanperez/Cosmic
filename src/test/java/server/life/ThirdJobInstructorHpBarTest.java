package server.life;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ThirdJobInstructorHpBarTest {
    @ParameterizedTest
    @ValueSource(ints = {9001000, 9001001, 9001002, 9001003, 9001008})
    void instructorsMustNotSendHiddenBossHpBars(int id) {
        Monster instructor = LifeFactory.getMonster(id);

        assertNotNull(instructor);
        assertTrue(instructor.isBoss());
        assertFalse(instructor.hasBossHPBar());
    }

    @Test
    void zakumKeepsItsVisibleBossHpBar() {
        Monster zakum = LifeFactory.getMonster(8800000);

        assertNotNull(zakum);
        assertTrue(zakum.hasBossHPBar());
    }
}
