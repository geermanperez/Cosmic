package net.server.dummy;

import client.Client;
import net.packet.Packet;

/**
 * Dummy client representing an in-game simulated AFK bot player.
 */
public class DummyClient extends Client {

    public DummyClient(int world, int channel) {
        super(Type.CHANNEL, -900000L - (long) (Math.random() * 99999), "127.0.0.1", null, world, channel);
        this.setLoggedIn(true);
    }

    @Override
    public void sendPacket(Packet packet) {
        // Dummy client has no TCP connection; ignore outbound packets safely.
    }
}
