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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Locale;

public class ResetCommand extends Command {
    private static final int RESET_REQUIRED_LEVEL = 255;
    private static final int RESET_COST = 50000000;
    private static final int RESET_AP_REWARD = 500;
    private static final int RESET_BASE_STAT = 10;

    {
        setDescription("Reset to level 1, preserving skills. Usage: @reset [explorer|cygnus|aran|evan].");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();

        Job resetJob = getResetJob(params);
        if (resetJob == null) {
            player.message("Uso: @reset [explorer|cygnus|aran|evan]");
            return;
        }

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
        ResetResult resetResult = persistReset(player.getId(), newMeso, resetJob.getId());
        if (!resetResult.success) {
            player.message("No se pudo completar el reset. Intentalo de nuevo en unos segundos.");
            return;
        }

        player.gainMeso(-RESET_COST, true);
        player.setLevel(1);
        player.setJob(resetJob);
        player.setExp(0);
        player.gainAp(resetResult.remainingAp - player.getRemainingAp(), true);
        player.updateStrDexIntLuk(RESET_BASE_STAT);
        player.updateSingleStat(Stat.LEVEL, 1);
        player.updateSingleStat(Stat.JOB, resetJob.getId());
        player.updateSingleStat(Stat.EXP, 0);
        player.updateSingleStat(Stat.AVAILABLEAP, resetResult.remainingAp);
        player.message("Reset realizado correctamente. Volviste a nivel 1 " + resetJob.name() + ", conservaste tus skills y tenes " + resetResult.remainingAp + " puntos para repartir.");
    }

    private Job getResetJob(String[] params) {
        if (params.length == 0) {
            return Job.BEGINNER;
        }
        if (params.length != 1) {
            return null;
        }

        return switch (params[0].toLowerCase(Locale.ROOT)) {
            case "explorer", "beginner" -> Job.BEGINNER;
            case "cygnus", "noblesse" -> Job.NOBLESSE;
            case "aran", "legend" -> Job.LEGEND;
            case "evan" -> Job.EVAN;
            default -> null;
        };
    }

    private ResetResult persistReset(int characterId, int newMeso, int resetJobId) {
        try (Connection con = DatabaseConnection.getConnection()) {
            con.setAutoCommit(false);
            try {
                int reborns;
                try (PreparedStatement select = con.prepareStatement("SELECT reborns FROM characters WHERE id = ? FOR UPDATE")) {
                    select.setInt(1, characterId);
                    try (ResultSet rs = select.executeQuery()) {
                        if (!rs.next()) {
                            con.rollback();
                            return ResetResult.failure();
                        }
                        reborns = rs.getInt("reborns");
                    }
                }

                if (reborns >= Integer.MAX_VALUE / RESET_AP_REWARD) {
                    con.rollback();
                    return ResetResult.failure();
                }

                int newReborns = reborns + 1;
                int newRemainingAp = newReborns * RESET_AP_REWARD;
                try (PreparedStatement ps = con.prepareStatement("UPDATE characters SET level = ?, job = ?, exp = ?, meso = ?, ap = ?, reborns = ?, str = ?, dex = ?, `int` = ?, luk = ? WHERE id = ?")) {
                    ps.setInt(1, 1);
                    ps.setInt(2, resetJobId);
                    ps.setInt(3, 0);
                    ps.setInt(4, newMeso);
                    ps.setInt(5, newRemainingAp);
                    ps.setInt(6, newReborns);
                    ps.setInt(7, RESET_BASE_STAT);
                    ps.setInt(8, RESET_BASE_STAT);
                    ps.setInt(9, RESET_BASE_STAT);
                    ps.setInt(10, RESET_BASE_STAT);
                    ps.setInt(11, characterId);
                    if (ps.executeUpdate() != 1) {
                        con.rollback();
                        return ResetResult.failure();
                    }
                }

                con.commit();
                return ResetResult.success(newRemainingAp);
            } catch (SQLException e) {
                con.rollback();
                throw e;
            } finally {
                con.setAutoCommit(true);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResetResult.failure();
        }
    }

    private static class ResetResult {
        private final boolean success;
        private final int remainingAp;

        private ResetResult(boolean success, int remainingAp) {
            this.success = success;
            this.remainingAp = remainingAp;
        }

        private static ResetResult success(int remainingAp) {
            return new ResetResult(true, remainingAp);
        }

        private static ResetResult failure() {
            return new ResetResult(false, 0);
        }
    }
}
