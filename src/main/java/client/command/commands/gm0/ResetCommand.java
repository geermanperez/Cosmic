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
package client.command.commands.gm0;

import client.Character;
import client.Client;
import client.Job;
import client.Stat;
import client.command.Command;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ResetCommand extends Command {
    private static final int RESET_REQUIRED_LEVEL = 255;
    private static final int RESET_COST = 50000000;
    private static final int BEGINNER_JOB_ID = 0;

    {
        setDescription("Reset level to 1 Beginner for 50,000,000 mesos.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();

        if (player.getLevel() < RESET_REQUIRED_LEVEL) {
            player.message("Necesitas ser nivel 255 para usar @reset.");
            return;
        }

        int currentMeso = player.getMeso();
        if (currentMeso < RESET_COST) {
            player.message("Necesitas 50.000.000 mesos para hacer reset.");
            return;
        }

        int newMeso = currentMeso - RESET_COST;
        if (!persistReset(player.getId(), newMeso)) {
            player.message("No se pudo completar el reset. Intentalo de nuevo en unos segundos.");
            return;
        }

        player.gainMeso(-RESET_COST, true);
        player.setLevel(1);
        player.setJob(Job.BEGINNER);
        player.setExp(0);
        player.updateSingleStat(Stat.LEVEL, 1);
        player.updateSingleStat(Stat.JOB, BEGINNER_JOB_ID);
        player.updateSingleStat(Stat.EXP, 0);
        player.message("Reset realizado correctamente. Volviste a nivel 1 Beginner conservando tus stats, skills y teclado.");
    }

    private boolean persistReset(int characterId, int newMeso) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("UPDATE characters SET level = ?, job = ?, exp = ?, meso = ? WHERE id = ?")) {
            ps.setInt(1, 1);
            ps.setInt(2, BEGINNER_JOB_ID);
            ps.setInt(3, 0);
            ps.setInt(4, newMeso);
            ps.setInt(5, characterId);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
