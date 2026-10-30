package net.server.channel.handlers;

import client.autoban.AutobanManager;
import client.Character;
import client.Client;
import client.Skill;
import client.SkillFactory;
import constants.skills.SuperGM;
import net.packet.InPacket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import server.StatEffect;
import server.maps.MapleMap;
import testutil.HandlerTest;
import testutil.Packets;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpecialMoveHandlerTest extends HandlerTest {
    private final SpecialMoveHandler handler = new SpecialMoveHandler();

    @Mock
    private AutobanManager autobanManager;

    @Mock
    private MapleMap map;

    @Mock
    private StatEffect statEffect;

    @BeforeEach
    void setupCharacterAndSkill() throws Exception {
        lenient().when(chr.getAutobanManager()).thenReturn(autobanManager);
        lenient().when(chr.isAlive()).thenReturn(true);
        lenient().when(chr.getMap()).thenReturn(map);

        Skill skill = new Skill(SuperGM.HEAL_PLUS_DISPEL);
        skill.addLevelEffect(statEffect);

        Field skillsField = SkillFactory.class.getDeclaredField("skills");
        skillsField.setAccessible(true);
        @SuppressWarnings("unchecked")
        Map<Integer, Skill> existingSkills = (Map<Integer, Skill>) skillsField.get(null);
        Map<Integer, Skill> testSkills = new HashMap<>(existingSkills != null ? existingSkills : Map.of());
        testSkills.put(SuperGM.HEAL_PLUS_DISPEL, skill);
        skillsField.set(null, testSkills);

        lenient().when(chr.getSkillLevel(any(Skill.class))).thenReturn((byte) 1);
    }

    @Test
    void shouldHandleHealPlusDispelWithSevenTrailingBytesWithoutCrashing() {
        // Build packet: 4 bytes tick + 4 bytes skillId + 1 byte level + 7 trailing bytes (reproducing Ultron packet)
        InPacket packet = Packets.buildInPacket(out -> {
            out.writeInt(123456); // tick
            out.writeInt(SuperGM.HEAL_PLUS_DISPEL); // skill ID
            out.writeByte(1); // skill level
            // 7 trailing bytes (e.g., target/position info or sub-opcodes)
            out.writeBytes(new byte[]{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07});
        });

        assertDoesNotThrow(() -> handler.handlePacket(packet, client));
        verify(statEffect).applyTo(any(), any());
    }

    @Test
    void shouldHandleHealPlusDispelWithNoTrailingBytes() {
        InPacket packet = Packets.buildInPacket(out -> {
            out.writeInt(123456); // tick
            out.writeInt(SuperGM.HEAL_PLUS_DISPEL); // skill ID
            out.writeByte(1); // skill level
        });

        assertDoesNotThrow(() -> handler.handlePacket(packet, client));
        verify(statEffect).applyTo(any(), any());
    }
}
