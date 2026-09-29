package provider.wz;

import org.junit.jupiter.api.Test;
import provider.Data;
import provider.DataProvider;
import provider.DataProviderFactory;
import provider.DataTool;
import server.maps.Portal;
import server.maps.PortalFactory;

import java.io.FileInputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LionHeartCastleMapTest {

    @Test
    void testLhcMapsLoadWithoutException() throws Exception {
        int[] mapIds = {
            211060000, 211060010, 211060100, 211060200, 211060201,
            211060300, 211060400, 211060401, 211060410, 211060500,
            211060600, 211060601, 211060610, 211060620, 211060700,
            211060800, 211060801, 211060810, 211060820, 211060830,
            211060900, 211061000, 211061001, 211061100
        };

        PortalFactory portalFactory = new PortalFactory();

        for (int mapId : mapIds) {
            Path path = Path.of("wz/Map.wz/Map/Map2", mapId + ".img.xml");
            assertTrue(path.toFile().exists(), "Map file missing: " + path);

            Data mapData;
            try (FileInputStream input = new FileInputStream(path.toFile())) {
                mapData = new XMLDomMapleData(input, path.getParent());
            }

            assertNotNull(mapData, "Map data null for " + mapId);
            Data info = mapData.getChildByPath("info");
            assertNotNull(info, "Info null for " + mapId);

            // MapFactory iterates life even in passage maps with no NPCs or mobs.
            assertNotNull(mapData.getChildByPath("life"), "Life section missing for " + mapId);

            Data portalData = mapData.getChildByPath("portal");
            assertNotNull(portalData, "Portal section null for " + mapId);

            List<Portal> portals = new ArrayList<>();
            for (Data p : portalData) {
                int pt = DataTool.getInt(p.getChildByPath("pt"));
                portals.add(portalFactory.makePortal(pt, p));
            }
            assertFalse(portals.isEmpty(), "No portals in " + mapId);
        }
    }
}
