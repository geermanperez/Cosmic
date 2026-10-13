package provider.wz;

import org.junit.jupiter.api.Test;
import provider.Data;
import provider.DataTool;

import java.io.FileInputStream;
import java.nio.file.Path;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class LionHeartCastleMobTest {

    private record LhcMobSpec(String name, int level, int baseExp, int realExp3x, int minHp) {}

    private static final Map<Integer, LhcMobSpec> LHC_MOBS = Map.of(
            8210000, new LhcMobSpec("Crocky the Gatekeeper", 115, 31500, 94500, 750000),
            8210001, new LhcMobSpec("Reindeer", 141, 76200, 228600, 780000),
            8210002, new LhcMobSpec("Blood Reindeer", 144, 88200, 264600, 800000),
            8210003, new LhcMobSpec("Bearwolf", 148, 102000, 306000, 824000),
            8210004, new LhcMobSpec("Grey Vulture", 152, 120600, 361800, 859000),
            8210005, new LhcMobSpec("Castle Golem", 156, 141000, 423000, 887000)
    );

    @Test
    void testLhcMobsStatsAndExpMatchSpecifications() throws Exception {
        Path mobStringsPath = Path.of("wz/String.wz/Mob.img.xml");
        assertTrue(mobStringsPath.toFile().exists(), "Mob.img.xml string file missing");

        Data stringData;
        try (FileInputStream input = new FileInputStream(mobStringsPath.toFile())) {
            stringData = new XMLDomMapleData(input, mobStringsPath.getParent());
        }

        for (Map.Entry<Integer, LhcMobSpec> entry : LHC_MOBS.entrySet()) {
            int mobId = entry.getKey();
            LhcMobSpec spec = entry.getValue();

            Path mobPath = Path.of("wz/Mob.wz", mobId + ".img.xml");
            assertTrue(mobPath.toFile().exists(), "Mob file missing: " + mobPath);

            Data mobData;
            try (FileInputStream input = new FileInputStream(mobPath.toFile())) {
                mobData = new XMLDomMapleData(input, mobPath.getParent());
            }

            assertNotNull(mobData, "Mob data null for " + mobId);
            Data info = mobData.getChildByPath("info");
            assertNotNull(info, "Info section missing for " + mobId);

            int level = DataTool.getInt(info.getChildByPath("level"));
            int exp = DataTool.getInt(info.getChildByPath("exp"));
            int maxHp = DataTool.getInt(info.getChildByPath("maxHP"));

            assertEquals(spec.level(), level, "Mob " + mobId + " level mismatch");
            assertEquals(spec.baseExp(), exp, "Mob " + mobId + " base exp mismatch");
            assertEquals(spec.realExp3x(), exp * 3, "Mob " + mobId + " 3x exp mismatch");
            assertTrue(maxHp >= spec.minHp(), "Mob " + mobId + " HP too low: " + maxHp + " < " + spec.minHp());

            // Ensure placeholder bug values (level 100, exp 2000, maxHP 100000) are eliminated
            assertNotEquals(2000, exp, "Mob " + mobId + " still has placeholder 2000 exp");

            // Verify name in String.wz
            Data nameNode = stringData.getChildByPath(mobId + "/name");
            assertNotNull(nameNode, "String name node missing for " + mobId);
            assertEquals(spec.name(), nameNode.getData(), "Mob " + mobId + " name mismatch in String.wz");
        }
    }
}
