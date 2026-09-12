package net.server.channel.handlers;

import io.netty.buffer.Unpooled;
import net.packet.ByteBufInPacket;
import net.packet.InPacket;
import org.junit.jupiter.api.Test;
import server.life.Monster;
import server.life.MonsterStats;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AreaAttackTargetsTest {
    @Test
    void detectsTargetBlocksWithoutPerMonsterTrailer() {
        InPacket packet = targetBlock(2, 0, 1001, 1002, 1003, 1004, 1005, 1006);

        assertEquals(0, AbstractDealDamageHandler.detectAttackTargetTrailerSize(packet, 6, 2,
                Set.of(1001, 1002, 1003, 1004, 1005, 1006)::contains, 4));
        assertEquals(0, packet.getPosition());
    }

    @Test
    void detectsOriginalCosmicFourByteTargetTrailer() {
        InPacket packet = targetBlock(2, 4, 1001, 1002, 1003, 1004, 1005, 1006);

        assertEquals(4, AbstractDealDamageHandler.detectAttackTargetTrailerSize(packet, 6, 2,
                Set.of(1001, 1002, 1003, 1004, 1005, 1006)::contains, 0));
        assertEquals(0, packet.getPosition());
    }

    @Test
    void detectsExtendedTargetTrailerWithoutLosingLaterMobs() {
        InPacket packet = targetBlock(2, 8, 1001, 1002, 1003, 1004, 1005, 1006);

        assertEquals(8, AbstractDealDamageHandler.detectAttackTargetTrailerSize(packet, 6, 2,
                Set.of(1001, 1002, 1003, 1004, 1005, 1006)::contains, 4));
        assertEquals(0, packet.getPosition());
    }

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

    private static InPacket targetBlock(int damageLineCount, int trailerBytes, int... monsterOids) {
        var buffer = Unpooled.buffer();
        for (int monsterOid : monsterOids) {
            buffer.writeIntLE(monsterOid);
            buffer.writeZero(14);
            for (int i = 0; i < damageLineCount; i++) {
                buffer.writeIntLE(1_000 + i);
            }
            buffer.writeZero(trailerBytes);
        }
        return new ByteBufInPacket(buffer);
    }
}
