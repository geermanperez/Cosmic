package client.command.commands.gm0;

import client.Client;
import client.command.Command;
import net.server.channel.handlers.EnterMTSHandler;
import scripting.npc.NPCScriptManager;

public class JarvisCommand extends Command {
    {
        setDescription("Abre el asistente de servicios de Jarvis.");
    }

    @Override
    public void execute(Client c, String[] params) {
        if (!c.getPlayer().isAlive() || c.getPlayer().getEventInstance() != null) {
            c.getPlayer().dropMessage(5, "No puedes usar los servicios de Jarvis en este momento.");
            return;
        }
        NPCScriptManager.getInstance().dispose(c);
        NPCScriptManager.getInstance().start(c, EnterMTSHandler.JARVIS_NPC_ID);
    }
}
