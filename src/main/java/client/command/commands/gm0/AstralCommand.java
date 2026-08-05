package client.command.commands.gm0;

import client.Client;
import client.command.Command;

public class AstralCommand extends Command {
    private static final int ASTRAL_NPC_ID = 9209003;

    {
        setDescription("Open the Astral Forge.");
    }

    @Override
    public void execute(Client client, String[] params) {
        client.getAbstractPlayerInteraction().openNpc(ASTRAL_NPC_ID, "9209003");
    }
}
