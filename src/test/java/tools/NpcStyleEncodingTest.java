package tools;

import net.opcodes.SendOpcode;
import org.junit.jupiter.api.Test;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

class NpcStyleEncodingTest {
    private ByteBuffer decodeHeader(int[] styles) {
        var b = ByteBuffer.wrap(PacketCreator.getNPCTalkStyle(9900000, "Style", styles).getBytes())
                .order(ByteOrder.LITTLE_ENDIAN);
        assertEquals(SendOpcode.NPC_TALK.getValue(), b.getShort());
        assertEquals(4, b.get());
        assertEquals(9900000, b.getInt());
        assertEquals(7, b.get());
        assertEquals(0, b.get());
        int textLength = Short.toUnsignedInt(b.getShort());
        assertEquals(5, textLength);
        b.position(b.position() + textLength);
        return b;
    }

    @Test void yunaDecode4ReadsCountAndEveryStyleWithoutOverrun() {
        // Actual skin list from session 7884, plus hair and face dialogs.
        for (int[] styles : new int[][] {
                {0, 1, 2, 4, 5, 9, 10, 11},
                {30000, 30020, 30030},
                {20000, 20100, 20200},
                {1}
        }) {
            var b = decodeHeader(styles);
            // yunams.dll patches EXE 0x747172 from Decode1 to Decode4.
            assertEquals(styles.length, b.getInt());
            for (int style : styles) assertEquals(style, b.getInt());
            assertFalse(b.hasRemaining());
        }
    }

    @Test void previewLimitKeepsCountAndPayloadConsistent() {
        int[] styles = IntStream.range(30000, 30130).toArray();
        var b = decodeHeader(styles);
        assertEquals(120, b.getInt());
        for (int i = 0; i < 120; i++) assertEquals(styles[i], b.getInt());
        assertFalse(b.hasRemaining());
    }

    @Test void legacyByteCountReproducesTheReportedSkinPacketOverrun() {
        int[] styles = {0, 1, 2, 4, 5, 9, 10, 11};
        var legacy = ByteBuffer.allocate(1 + 4 * styles.length).order(ByteOrder.LITTLE_ENDIAN);
        legacy.put((byte) styles.length);
        for (int style : styles) legacy.putInt(style);
        legacy.flip();
        assertEquals(8, legacy.getInt());
        assertEquals(256, legacy.getInt()); // first displayed skin is corrupted
        assertEquals(25, legacy.remaining()); // seven more ints need 28 bytes
    }
}
