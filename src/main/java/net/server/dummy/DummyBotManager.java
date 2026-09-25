package net.server.dummy;

import client.Character;
import net.server.Server;
import net.server.channel.Channel;
import net.server.world.World;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.TimerManager;
import server.maps.MapleMap;
import server.maps.Portal;
import tools.DatabaseConnection;
import tools.PacketCreator;

import java.awt.Point;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Manages simulated AFK Dummy Player bots in Cosmic.
 * Loads characters from the database, spawns them in maps,
 * sits them on chairs if configured, and rotates their town every 4 hours.
 */
public class DummyBotManager {
    private static final Logger log = LoggerFactory.getLogger(DummyBotManager.class);
    private static final DummyBotManager instance = new DummyBotManager();

    public static final List<Integer> ROTATION_TOWNS = Arrays.asList(
            100000000, // Henesys
            910000000, // Free Market Entrance
            101000000, // Ellinia
            102000000, // Perion
            103000000, // Kerning City
            104000000, // Lith Harbor
            120000000, // Nautilus Harbor
            200000000, // Orbis
            211000000, // El Nath
            220000000, // Ludibrium
            240000000, // Leafre
            250000000  // Mu Lung
    );

    private final Map<Integer, Character> activeBots = new ConcurrentHashMap<>();
    private final Map<Integer, Integer> botChairs = new ConcurrentHashMap<>();
    private final Map<Integer, String> botNames = new ConcurrentHashMap<>();
    private boolean initialized = false;

    private DummyBotManager() {}

    public static DummyBotManager getInstance() {
        return instance;
    }

    public synchronized void init() {
        if (initialized) {
            return;
        }
        initialized = true;

        ensureDatabaseTable();
        loadBotsFromDatabase();

        // Schedule periodic 4-hour map rotation
        long fourHours = TimeUnit.HOURS.toMillis(4);
        TimerManager.getInstance().register(this::rotateBots, fourHours, fourHours);
        log.info("DummyBotManager initialized. Scheduled 4-hour map rotation.");
    }

    private void ensureDatabaseTable() {
        try (Connection con = DatabaseConnection.getConnection();
             Statement st = con.createStatement()) {
            st.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS `dummy_bots` (" +
                    "  `id` INT NOT NULL AUTO_INCREMENT," +
                    "  `character_id` INT NOT NULL," +
                    "  `name` VARCHAR(50) NOT NULL," +
                    "  `chair_id` INT DEFAULT 0," +
                    "  `world` INT DEFAULT 0," +
                    "  `channel` INT DEFAULT 1," +
                    "  `current_map` INT DEFAULT 100000000," +
                    "  `enabled` TINYINT(1) DEFAULT 1," +
                    "  PRIMARY KEY (`id`)," +
                    "  UNIQUE KEY `char_id_unique` (`character_id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"
            );
        } catch (SQLException e) {
            log.error("Failed to ensure dummy_bots table exists", e);
        }
    }

    private void loadBotsFromDatabase() {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT * FROM dummy_bots WHERE enabled = 1");
             ResultSet rs = ps.executeQuery()) {

            int count = 0;
            while (rs.next()) {
                int charId = rs.getInt("character_id");
                String name = rs.getString("name");
                int chairId = rs.getInt("chair_id");
                int world = rs.getInt("world");
                int channel = rs.getInt("channel");
                int currentMap = rs.getInt("current_map");

                boolean spawned = spawnBot(charId, name, chairId, world, channel, currentMap, null, false);
                if (spawned) {
                    count++;
                }
            }
            log.info("Spawned {} dummy AFK player bot(s) from database.", count);
        } catch (SQLException e) {
            log.error("Failed to load dummy bots from database", e);
        }
    }

    public synchronized boolean spawnBot(int charId, String name, int chairId, int world, int channel,
                                        int targetMapId, Point customPos, boolean saveToDb) {
        try {
            if (activeBots.containsKey(charId)) {
                despawnBot(charId);
            }

            Server server = Server.getInstance();
            World wserv = server.getWorld(world);
            if (wserv == null) {
                log.warn("Cannot spawn dummy bot {}: world {} not found", name, world);
                return false;
            }
            Channel cserv = wserv.getChannel(channel);
            if (cserv == null) {
                cserv = wserv.getChannel(1);
            }
            if (cserv == null) {
                log.warn("Cannot spawn dummy bot {}: channel {} not found", name, channel);
                return false;
            }

            DummyClient client = new DummyClient(world, cserv.getId());
            Character chr = Character.loadCharFromDB(charId, client, true);
            if (chr == null) {
                log.warn("Cannot spawn dummy bot: character ID {} not found in database", charId);
                return false;
            }

            client.setPlayer(chr);
            chr.setDummyBot(true);

            wserv.addPlayer(chr);
            cserv.addPlayer(chr);

            MapleMap map = cserv.getMapFactory().getMap(targetMapId);
            if (map == null) {
                map = cserv.getMapFactory().getMap(100000000); // Fallback to Henesys
            }

            Point spawnPos = (customPos != null) ? customPos : getSafeSpawnPosition(map);
            chr.setPosition(spawnPos);
            map.addPlayer(chr);

            if (chairId > 0) {
                chr.setChair(chairId);
                map.broadcastMessage(PacketCreator.showChair(chr.getId(), chairId));
                botChairs.put(charId, chairId);
            }

            activeBots.put(charId, chr);
            botNames.put(charId, chr.getName());

            // Mark account as logged in so server status and rankings show active online
            updateAccountLoginState(chr.getAccountID(), 1);

            if (saveToDb) {
                saveBotToDatabase(charId, chr.getName(), chairId, world, cserv.getId(), map.getId());
            }

            log.info("Spawned dummy AFK bot {} (ID: {}) in map {}", chr.getName(), charId, map.getId());
            return true;
        } catch (Exception e) {
            log.error("Error spawning dummy bot {}", name, e);
            return false;
        }
    }

    public synchronized void despawnBot(int charId) {
        Character chr = activeBots.remove(charId);
        botChairs.remove(charId);
        botNames.remove(charId);

        if (chr != null) {
            try {
                if (chr.getMap() != null) {
                    chr.getMap().removePlayer(chr);
                }
                World w = Server.getInstance().getWorld(chr.getWorld());
                if (w != null) {
                    w.removePlayer(chr);
                }
                Channel ch = chr.getClient().getChannelServer();
                if (ch != null) {
                    ch.removePlayer(chr);
                }

                updateAccountLoginState(chr.getAccountID(), 0);
                log.info("Despawned dummy bot {} (ID: {})", chr.getName(), charId);
            } catch (Exception e) {
                log.warn("Error despawning dummy bot ID {}", charId, e);
            }
        }
    }

    public synchronized boolean removeBot(int charId) {
        despawnBot(charId);
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("DELETE FROM dummy_bots WHERE character_id = ?")) {
            ps.setInt(1, charId);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            log.error("Failed to delete dummy bot from database", e);
            return false;
        }
    }

    public synchronized void rotateBots() {
        log.info("Rotating all active dummy AFK bots across towns...");
        for (Character chr : activeBots.values()) {
            try {
                int currentMapId = chr.getMapId();
                List<Integer> candidateTowns = ROTATION_TOWNS.stream()
                        .filter(m -> m != currentMapId)
                        .collect(Collectors.toList());

                if (candidateTowns.isEmpty()) {
                    continue;
                }
                int nextMapId = candidateTowns.get((int) (Math.random() * candidateTowns.size()));

                Channel cserv = chr.getClient().getChannelServer();
                if (cserv == null) {
                    continue;
                }
                MapleMap oldMap = chr.getMap();
                MapleMap newMap = cserv.getMapFactory().getMap(nextMapId);
                if (newMap == null) {
                    continue;
                }

                if (oldMap != null) {
                    oldMap.removePlayer(chr);
                }

                Point spawnPos = getSafeSpawnPosition(newMap);
                chr.setMap(newMap);
                chr.setPosition(spawnPos);
                newMap.addPlayer(chr);

                int chairId = botChairs.getOrDefault(chr.getId(), 0);
                if (chairId > 0) {
                    chr.setChair(chairId);
                    newMap.broadcastMessage(PacketCreator.showChair(chr.getId(), chairId));
                }

                updateBotMapInDb(chr.getId(), nextMapId);
                log.info("Dummy Bot {} rotated to map {}", chr.getName(), nextMapId);
            } catch (Exception e) {
                log.warn("Error rotating bot {}", chr.getName(), e);
            }
        }
    }

    public Point getSafeSpawnPosition(MapleMap map) {
        Portal portal = map.getPortal(0);
        if (portal == null) {
            portal = map.getPortal("sp");
        }
        Point base = (portal != null) ? new Point(portal.getPosition()) : new Point(0, 0);

        // Small random offset so multiple bots in the same map do not overlap identically
        base.x += (int) (Math.random() * 80 - 40);
        Point ground = map.getGroundBelow(base);
        return (ground != null) ? ground : base;
    }

    private void updateAccountLoginState(int accountId, int state) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("UPDATE accounts SET loggedin = ? WHERE id = ?")) {
            ps.setInt(1, state);
            ps.setInt(2, accountId);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.warn("Failed to update account login state for dummy bot account {}", accountId, e);
        }
    }

    private void saveBotToDatabase(int charId, String name, int chairId, int world, int channel, int currentMap) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "INSERT INTO dummy_bots (character_id, name, chair_id, world, channel, current_map, enabled) " +
                     "VALUES (?, ?, ?, ?, ?, ?, 1) " +
                     "ON DUPLICATE KEY UPDATE name = VALUES(name), chair_id = VALUES(chair_id), " +
                     "current_map = VALUES(current_map), enabled = 1")) {
            ps.setInt(1, charId);
            ps.setString(2, name);
            ps.setInt(3, chairId);
            ps.setInt(4, world);
            ps.setInt(5, channel);
            ps.setInt(6, currentMap);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.error("Failed to save dummy bot to database", e);
        }
    }

    private void updateBotMapInDb(int charId, int mapId) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("UPDATE dummy_bots SET current_map = ? WHERE character_id = ?")) {
            ps.setInt(1, mapId);
            ps.setInt(2, charId);
            ps.executeUpdate();
        } catch (SQLException e) {
            log.warn("Failed to update current_map for bot ID {}", charId, e);
        }
    }

    public Integer findCharacterIdByName(String name) {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT id FROM characters WHERE name = ?")) {
            ps.setString(1, name);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            log.error("Failed to lookup character ID by name: {}", name, e);
        }
        return null;
    }

    public void cleanup() {
        for (Character chr : activeBots.values()) {
            updateAccountLoginState(chr.getAccountID(), 0);
        }
    }

    public Map<Integer, Character> getActiveBots() {
        return Collections.unmodifiableMap(activeBots);
    }
}
