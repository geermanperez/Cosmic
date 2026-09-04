package net.netty;

import org.junit.jupiter.api.Test;
import net.opcodes.RecvOpcode;
import net.opcodes.SendOpcode;
import static org.junit.jupiter.api.Assertions.*;

class ShopDiagnosticsTest {
    @Test void recordsShopTrafficAfterLoginLimit() {
        assertTrue(LoginDiagnostics.shouldRecordPacket("receive", RecvOpcode.NPC_SHOP.getValue(), 135));
        assertTrue(LoginDiagnostics.shouldRecordPacket("receive", RecvOpcode.NPC_TALK.getValue(), 136));
        assertTrue(LoginDiagnostics.shouldRecordPacket("send", SendOpcode.OPEN_NPC_SHOP.getValue(), 280));
        assertTrue(LoginDiagnostics.shouldRecordPacket("send", SendOpcode.CONFIRM_SHOP_TRANSACTION.getValue(), 281));
    }

    @Test void keepsOtherTrafficBoundedAndDirectionSpecific() {
        assertTrue(LoginDiagnostics.shouldRecordPacket("receive", 41, 512));
        assertFalse(LoginDiagnostics.shouldRecordPacket("receive", 41, 513));
        assertFalse(LoginDiagnostics.shouldRecordPacket("receive", SendOpcode.OPEN_NPC_SHOP.getValue(), 513));
        assertTrue(LoginDiagnostics.shouldRecordPacket("send", SendOpcode.STAT_CHANGED.getValue(), 3000));
        assertTrue(LoginDiagnostics.shouldRecordPacket("send", SendOpcode.UPDATE_CHAR_LOOK.getValue(), 3001));
    }
}
