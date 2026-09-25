package client.command.commands.gm0;

import client.Client;
import client.command.Command;
import net.server.channel.handlers.EnterMTSHandler;
import scripting.npc.NPCScriptManager;

public class JarvisCommand extends Command {
    {
        setDescription("Opens the Jarvis personal assistant.");
    }

    @Override
    public void execute(Client c, String[] params) {
        if (!c.getPlayer().isAlive() || c.getPlayer().getEventInstance() != null) {
            c.getPlayer().dropMessage(5, "You cannot use Jarvis services at this moment.");
            return;
        }
        c.removeClickedNPC();
        NPCScriptManager.getInstance().dispose(c);
        NPCScriptManager.getInstance().start(c, EnterMTSHandler.JARVIS_NPC_ID, c.getPlayer());
    }
}
