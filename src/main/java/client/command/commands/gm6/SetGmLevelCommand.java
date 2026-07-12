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
package client.command.commands.gm6;

import client.Character;
import client.Client;
import client.command.Command;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class SetGmLevelCommand extends Command {
    private static final int DONOR_LEVEL = 2;

    {
        setDescription("Set GM level of a player.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        if (params.length < 2) {
            player.yellowMessage("Syntax: !setgmlevel <playername> <newlevel>");
            return;
        }

        final int newLevel;
        try {
            newLevel = Integer.parseInt(params[1]);
        } catch (NumberFormatException e) {
            player.yellowMessage("Syntax: !setgmlevel <playername> <newlevel>");
            return;
        }

        Character target = c.getChannelServer().getPlayerStorage().getCharacterByName(params[0]);
        if (target != null) {
            int previousLevel = target.gmLevel();
            target.setGMLevel(newLevel);
            target.getClient().setGMLevel(newLevel);

            try {
                persistGmLevelAndDonorExpiration(target, newLevel, previousLevel);
            } catch (SQLException e) {
                e.printStackTrace();
                player.dropMessage("GM level was changed in memory, but database update failed.");
                return;
            }

            target.dropMessage("You are now a level " + newLevel + " GM. See @commands for a list of available commands.");
            if (newLevel == DONOR_LEVEL) {
                target.dropMessage("Tu rango de donador queda activo por 30 dias.");
            }
            player.dropMessage(target + " is now a level " + newLevel + " GM.");
        } else {
            player.dropMessage("Player '" + params[0] + "' was not found on this channel.");
        }
    }

    private void persistGmLevelAndDonorExpiration(Character target, int newLevel, int previousLevel) throws SQLException {
        try (Connection con = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement("UPDATE characters SET gm = ? WHERE id = ?")) {
                ps.setInt(1, newLevel);
                ps.setInt(2, target.getId());
                ps.executeUpdate();
            }

            if (newLevel == DONOR_LEVEL) {
                try (PreparedStatement ps = con.prepareStatement(
                        "UPDATE accounts " +
                                "SET donor_until = DATE_ADD(CASE WHEN donor_until IS NOT NULL AND donor_until > NOW() THEN donor_until ELSE NOW() END, INTERVAL 30 DAY) " +
                                "WHERE id = ?")) {
                    ps.setInt(1, target.getAccountID());
                    ps.executeUpdate();
                }
            } else if (previousLevel == DONOR_LEVEL) {
                try (PreparedStatement ps = con.prepareStatement("UPDATE accounts SET donor_until = NULL WHERE id = ?")) {
                    ps.setInt(1, target.getAccountID());
                    ps.executeUpdate();
                }
            }
        }
    }
}
