package net.netty;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelDuplexHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelPromise;
import net.packet.Packet;
import net.opcodes.RecvOpcode;
import net.opcodes.SendOpcode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Opt-in login metadata only: never log payloads, credentials or exception messages. */
public final class LoginDiagnostics extends ChannelDuplexHandler {
    private static final Logger log = LoggerFactory.getLogger(LoginDiagnostics.class);
    private final long session;
    private final String stage;
    private int received;
    private int sent;
    private int lastSendOpcode = -1;
    private int lastSendBytes = -1;

    public LoginDiagnostics(long session, String stage) {
        this.session = session;
        this.stage = stage;
    }

    private void record(String direction, Object message, int count) {
        if (message instanceof ByteBuf buffer) {
            if (count > 512) {
                return;
            }
            log.info("LoginDiag session={} stage={} direction={} bytes={}",
                    session, stage, direction, buffer.readableBytes());
        } else if (message instanceof Packet packet) {
            byte[] bytes = packet.getBytes();
            int opcode = bytes.length < 2 ? -1 : (bytes[0] & 0xff) | ((bytes[1] & 0xff) << 8);
            if ("send".equals(direction)) {
                lastSendOpcode = opcode;
                lastSendBytes = bytes.length;
            }
            if (!shouldRecordPacket(direction, opcode, count)) {
                return;
            }
            log.info("LoginDiag session={} stage={} direction={} bytes={} opcode={}",
                    session, stage, direction, bytes.length, opcode);
        }
    }

    static boolean shouldRecordPacket(String direction, int opcode, int count) {
        if (count <= 512) {
            return true;
        }
        if ("receive".equals(direction)) {
            return opcode == RecvOpcode.NPC_TALK.getValue()
                    || opcode == RecvOpcode.NPC_TALK_MORE.getValue()
                    || opcode == RecvOpcode.NPC_SHOP.getValue();
        }
        return opcode == SendOpcode.NPC_TALK.getValue()
                || opcode == SendOpcode.OPEN_NPC_SHOP.getValue()
                || opcode == SendOpcode.CONFIRM_SHOP_TRANSACTION.getValue()
                || opcode == SendOpcode.STAT_CHANGED.getValue()
                || opcode == SendOpcode.UPDATE_CHAR_LOOK.getValue();
    }


    @Override
    public void channelRead(ChannelHandlerContext ctx, Object message) throws Exception {
        record("receive", message, ++received);
        super.channelRead(ctx, message);
    }

    @Override
    public void write(ChannelHandlerContext ctx, Object message, ChannelPromise promise) throws Exception {
        record("send", message, ++sent);
        super.write(ctx, message, promise);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        Throwable root = cause;
        for (int depth = 0; depth < 8 && root.getCause() != null && root.getCause() != root; depth++) {
            root = root.getCause();
        }
        log.info("LoginDiag session={} stage={} exception={} root={}",
                session, stage, cause.getClass().getSimpleName(), root.getClass().getSimpleName());
        super.exceptionCaught(ctx, cause);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        log.info("LoginDiag session={} stage={} closed received={} sent={} lastSendOpcode={} lastSendBytes={}",
                session, stage, received, sent, lastSendOpcode, lastSendBytes);
        super.channelInactive(ctx);
    }
}
