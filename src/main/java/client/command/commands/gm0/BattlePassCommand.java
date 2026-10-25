package client.command.commands.gm0;

import client.Client;
import client.command.Command;
import constants.id.NpcId;
import scripting.npc.NPCScriptManager;

public class BattlePassCommand extends Command {
    {
        setDescription("Abre el menú del Pase de Batalla Diario.");
    }

    @Override
    public void execute(Client c, String[] params) {
        NPCScriptManager.getInstance().start(c, NpcId.MAPLE_ADMINISTRATOR, "battlepass", null);
    }
}
