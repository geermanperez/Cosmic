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
   @Author: Resinate
*/
package client.command.commands.gm2;

import client.Client;
import client.command.Command;
import server.maps.MapObject;
import server.maps.MapObjectType;

import java.util.Arrays;
import java.util.List;

public class LootCommand extends Command {

    {
        setDescription("Loot all drops on the map.");
    }

    @Override
    public void execute(Client c, String[] params) {
        int gmLevel = c.getGMLevel();
        if (gmLevel < 2 || gmLevel > 6) {
            c.getPlayer().dropMessage(1, "No puedes usar !loot. Solo roles GM 2 a 6.");
            return;
        }
        List<MapObject> items = c.getPlayer().getMap().getMapObjectsInRange(c.getPlayer().getPosition(), Double.POSITIVE_INFINITY, Arrays.asList(MapObjectType.ITEM));
        for (MapObject item : items) {
            c.getPlayer().pickupItem(item);
        }

    }
}
