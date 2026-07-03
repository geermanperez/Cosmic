/*
 	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
 		       Matthias Butz <matze@odinms.de>
 		       Jan Christian Meyer <vimes@odinms.de>

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
package net.server.task;

import client.Job;
import config.YamlConfig;
import net.server.Server;
import tools.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @author Matze
 * @author Quit
 * @author Ronan
 */
public class RankingLoginTask implements Runnable {
    private long lastUpdate = System.currentTimeMillis();

    private void resetMoveRank(boolean job) throws SQLException {
        String query = "UPDATE characters SET " + (job ? "jobRankMove = 0" : "rankMove = 0");
        try (Connection con = DatabaseConnection.getConnection()) {
            PreparedStatement reset = con.prepareStatement(query);
            reset.executeUpdate();
        }
    }

    private void updateRanking(int job, int world) throws SQLException {
