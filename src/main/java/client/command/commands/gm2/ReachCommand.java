/*
    This file is part of the HeavenMS MapleStory Server, commands OdinMS-based
    Copyleft (L) 2016 - 2019 RonanLana

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
   @Author: Arthur L - Refactored command content into modules
*/
package client.command.commands.gm2;

import client.Character;
import client.Client;
import client.command.Command;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.maps.MapleMap;
import server.maps.Portal;

public class ReachCommand extends Command {
    private static final Logger log = LoggerFactory.getLogger(ReachCommand.class);

    {
        setDescription("Warp to a player.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        if (params.length < 1) {
            player.yellowMessage("Syntax: !reach <playername>");
            return;
        }

        Character victim = c.getWorldServer().getPlayerStorage().getCharacterByName(params[0]);
        if (victim != null && victim.isLoggedin()) {
            if (player.getClient().getChannel() != victim.getClient().getChannel()) {
                player.dropMessage(5, "Player '" + victim.getName() + "' is at channel " + victim.getClient().getChannel() + ".");
            } else {
                MapleMap map = victim.getMap();
                if (map == null) {
                    player.dropMessage(6, "Target map is unavailable.");
                    return;
                }
                player.saveLocationOnWarp();
                if (player.getMap() == map) {
                    if (log.isDebugEnabled()) {
                        log.debug("Reach/Follow in-map: GM {} -> Target {} at pos {}", player.getName(), victim.getName(), victim.getPosition());
                    }
                    player.changeMap(map, victim.getPosition());
                } else {
                    Portal portal = map.findClosestPlayerSpawnpoint(victim.getPosition());
                    if (portal == null) {
                        portal = map.getRandomPlayerSpawnpoint();
                    }
                    if (portal == null) {
                        portal = map.getPortal(0);
                    }
                    if (log.isDebugEnabled()) {
                        log.debug("Reach/Follow cross-map: GM {} -> Target {} at map {} portal {}",
                                player.getName(), victim.getName(), map.getId(), portal != null ? portal.getId() : -1);
                    }
                    player.forceChangeMap(map, portal);
                }
            }
        } else {
            player.dropMessage(6, "Unknown player.");
        }
    }
}
