package net.server.channel.handlers;

import org.junit.jupiter.api.Test;
import server.life.Monster;
import server.life.MonsterStats;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AreaAttackTargetsTest {
    @Test
    void capsMultiLineDamageInsteadOfOverflowingNegative() {
        int total = AbstractDealDamageHandler.sumDamageLines(List.of(1_878_149_417, 1_746_022_936));

        assertEquals(Integer.MAX_VALUE, total);
        assertTrue(total > 0);
    }

    @Test
    void cappedMultiLineDamageCanReduceMonsterHpToZero() {
        MonsterStats stats = new MonsterStats();
        stats.setHp(50_000);
        Monster monster = new Monster(100100, stats);

        int total = AbstractDealDamageHandler.sumDamageLines(List.of(1_878_149_417, 1_746_022_936));

        assertEquals(50_000, monster.applyAndGetHpDamage(total, false));
        assertEquals(0, monster.getHp());
    }

    @Test
    void preservesNormalMultiLineDamage() {
        assertEquals(9_300, AbstractDealDamageHandler.sumDamageLines(List.of(3_000, 3_100, 3_200)));
    }

    @Test
    void normalizesClientDamageWithSignBitWithoutOverflow() {
        assertEquals(1, AbstractDealDamageHandler.sumDamageLines(List.of(Integer.MIN_VALUE + 1)));
    }

    @Test
    void ignoresMissAndNegativeDamageWithoutOverflowingToMaxInt() {
        assertEquals(0, AbstractDealDamageHandler.sumDamageLines(List.of(-1)));
        assertEquals(0, AbstractDealDamageHandler.sumDamageLines(List.of(-1, -1)));
        assertEquals(50, AbstractDealDamageHandler.sumDamageLines(List.of(50, -1)));
        assertEquals(75, AbstractDealDamageHandler.sumDamageLines(List.of(-1, 75)));
        assertEquals(120, AbstractDealDamageHandler.sumDamageLines(List.of(60, 60)));
        assertEquals(50, AbstractDealDamageHandler.sumDamageLines(List.of(Integer.MIN_VALUE + 50, -1)));
    }
}
