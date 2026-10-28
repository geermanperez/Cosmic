package client.command.commands.gm0;

import client.Client;
import client.command.Command;
import constants.id.MapId;

/** Public shortcut to the Boss Rush recruitment map. */
public class RushCommand extends Command {
    {
        setDescription("Go to Gaga's Boss Rush recruitment map.");
    }

    @Override
    public void execute(Client c, String[] params) {
        if (c.getPlayer().getEventInstance() != null) {
            c.getPlayer().yellowMessage("You cannot use @rush while participating in an event.");
            return;
        }

        c.getPlayer().changeMap(MapId.EXCLUSIVE_TRAINING_CENTER);
    }
}
