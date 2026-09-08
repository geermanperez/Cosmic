package net.server.channel.handlers;

import client.Character;
import client.Skill;
import net.server.channel.handlers.AbstractDealDamageHandler.AttackInfo;
import net.server.channel.handlers.AbstractDealDamageHandler.AttackTarget;
import org.junit.jupiter.api.Test;
import server.StatEffect;
import server.life.Monster;
import server.life.MonsterStats;
import server.maps.MapleMap;

import java.awt.Point;
import java.awt.Rectangle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AreaAttackTargetsTest {
    @Test
    void completesSuperDragonRoarUpToItsConfiguredTargetLimit() {
        StatEffect effect = mock(StatEffect.class);
        when(effect.getMobCount()).thenReturn(3);
        when(effect.getBoundingBox(new Point(0, 0), false)).thenReturn(new Rectangle(0, -100, 300, 200));

        AttackInfo attack = attackWithEffect(effect);
        attack.skill = 9101004;
        attack.numAttacked = 1;
        attack.numDamage = 1;
        attack.numAttackedAndDamage = 0x11;
        attack.targets = new HashMap<>();
        attack.targets.put(1, new AttackTarget((short) 25, new ArrayList<>(List.of(5000))));

        Character character = mock(Character.class);
        MapleMap map = mock(MapleMap.class);
        when(character.getMap()).thenReturn(map);
        when(character.getPosition()).thenReturn(new Point(0, 0));
        when(character.isFacingLeft()).thenReturn(false);

        Monster original = monster(1, 50, 0, false);
        Monster nearest = monster(2, 100, 0, false);
        Monster nextNearest = monster(3, 200, 0, false);
        Monster overLimit = monster(4, 250, 0, false);
        Monster friendly = monster(5, 75, 0, true);
        Monster outside = monster(6, 400, 0, false);
        when(map.getAllMonsters()).thenReturn(List.of(overLimit, outside, nextNearest, friendly, nearest, original));

        AbstractDealDamageHandler.expandSuperDragonRoarTargets(attack, character);

        assertEquals(3, attack.numAttacked);
        assertEquals(0x31, attack.numAttackedAndDamage);
        assertTrue(attack.targets.containsKey(1));
        assertTrue(attack.targets.containsKey(2));
        assertTrue(attack.targets.containsKey(3));
        assertFalse(attack.targets.containsKey(4));
        assertFalse(attack.targets.containsKey(5));
        assertFalse(attack.targets.containsKey(6));
        assertEquals(List.of(5000), attack.targets.get(2).damageLines());
    }

    @Test
    void leavesRegularAreaSkillsUnchanged() {
        StatEffect effect = mock(StatEffect.class);
        when(effect.getMobCount()).thenReturn(6);

        AttackInfo attack = attackWithEffect(effect);
        attack.skill = 1001005; // Slash Blast (Warrior melee)
        attack.numAttacked = 1;
        attack.numDamage = 1;
        attack.numAttackedAndDamage = 0x11;
        attack.targets = new HashMap<>();
        attack.targets.put(1, new AttackTarget((short) 0, new ArrayList<>(List.of(100))));

        Character character = mock(Character.class);
        AbstractDealDamageHandler.expandSuperDragonRoarTargets(attack, character);

        assertEquals(1, attack.targets.size());
        assertEquals(0x11, attack.numAttackedAndDamage);
    }

    @Test
    void preservesMultiTargetMeleeSkillWithThreeTargets() {
        StatEffect effect = mock(StatEffect.class);
        when(effect.getMobCount()).thenReturn(3);

        AttackInfo attack = attackWithEffect(effect);
        attack.skill = 1121008; // Brandish (Hero melee)
        attack.numAttacked = 3;
        attack.numDamage = 2;
        attack.numAttackedAndDamage = 0x32;
        attack.targets = new HashMap<>();
        attack.targets.put(101, new AttackTarget((short) 0, new ArrayList<>(List.of(1500, 1600))));
        attack.targets.put(102, new AttackTarget((short) 0, new ArrayList<>(List.of(1450, 1550))));
        attack.targets.put(103, new AttackTarget((short) 0, new ArrayList<>(List.of(1520, 1580))));

        Character character = mock(Character.class);
        AbstractDealDamageHandler.expandSuperDragonRoarTargets(attack, character);

        assertEquals(3, attack.targets.size());
        assertEquals(3, attack.numAttacked);
        assertEquals(0x32, attack.numAttackedAndDamage);
        assertTrue(attack.targets.containsKey(101));
        assertTrue(attack.targets.containsKey(102));
        assertTrue(attack.targets.containsKey(103));
    }

    @Test
    void preservesMultiTargetMagicSkillWithSixTargets() {
        StatEffect effect = mock(StatEffect.class);
        when(effect.getMobCount()).thenReturn(6);

        AttackInfo attack = attackWithEffect(effect);
        attack.skill = 2301002; // Heal (Cleric magic)
        attack.magic = true;
        attack.numAttacked = 6;
        attack.numDamage = 1;
        attack.numAttackedAndDamage = 0x61;
        attack.targets = new HashMap<>();
        for (int i = 1; i <= 6; i++) {
            attack.targets.put(200 + i, new AttackTarget((short) 0, new ArrayList<>(List.of(800 + i))));
        }

        Character character = mock(Character.class);
        AbstractDealDamageHandler.expandSuperDragonRoarTargets(attack, character);

        assertEquals(6, attack.targets.size());
        assertEquals(6, attack.numAttacked);
        assertEquals(0x61, attack.numAttackedAndDamage);
        for (int i = 1; i <= 6; i++) {
            assertTrue(attack.targets.containsKey(200 + i));
        }
    }

    @Test
    void preservesMultiTargetRangedSkillWithMultipleTargets() {
        StatEffect effect = mock(StatEffect.class);
        when(effect.getMobCount()).thenReturn(6);

        AttackInfo attack = attackWithEffect(effect);
        attack.skill = 3201005; // Arrow Eruption (Sniper ranged)
        attack.ranged = true;
        attack.numAttacked = 4;
        attack.numDamage = 1;
        attack.numAttackedAndDamage = 0x41;
        attack.targets = new HashMap<>();
        for (int i = 1; i <= 4; i++) {
            attack.targets.put(300 + i, new AttackTarget((short) 0, new ArrayList<>(List.of(2000 + i))));
        }

        Character character = mock(Character.class);
        AbstractDealDamageHandler.expandSuperDragonRoarTargets(attack, character);

        assertEquals(4, attack.targets.size());
        assertEquals(4, attack.numAttacked);
        assertEquals(0x41, attack.numAttackedAndDamage);
        for (int i = 1; i <= 4; i++) {
            assertTrue(attack.targets.containsKey(300 + i));
        }
    }

    private static AttackInfo attackWithEffect(StatEffect effect) {
        return new AttackInfo() {
            @Override
            public StatEffect getAttackEffect(Character chr, Skill skill) {
                return effect;
            }
        };
    }

    private static Monster monster(int objectId, int x, int y, boolean friendly) {
        Monster monster = mock(Monster.class);
        MonsterStats stats = mock(MonsterStats.class);
        when(monster.getObjectId()).thenReturn(objectId);
        when(monster.getPosition()).thenReturn(new Point(x, y));
        when(monster.isAlive()).thenReturn(true);
        when(monster.getStats()).thenReturn(stats);
        when(stats.isFriendly()).thenReturn(friendly);
        return monster;
    }
}
