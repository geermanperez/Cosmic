package provider.wz;

import org.junit.jupiter.api.Test;
import provider.Data;
import provider.DataTool;

import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

class VonLeonDropTest {

    @Test
    void testVonLeonMobWzStatsAndFlags() throws Exception {
        Path mobStringsPath = Path.of("wz/String.wz/Mob.img.xml");
        assertTrue(mobStringsPath.toFile().exists(), "Mob.img.xml missing");

        Data stringData;
        try (FileInputStream input = new FileInputStream(mobStringsPath.toFile())) {
            stringData = new XMLDomMapleData(input, mobStringsPath.getParent());
        }

        // 8840000 Von Leon
        Path vlPath = Path.of("wz/Mob.wz/8840000.img.xml");
        assertTrue(vlPath.toFile().exists(), "8840000.img.xml missing");
        Data vlData;
        try (FileInputStream input = new FileInputStream(vlPath.toFile())) {
            vlData = new XMLDomMapleData(input, vlPath.getParent());
        }
        Data vlInfo = vlData.getChildByPath("info");
        assertNotNull(vlInfo, "info section missing for 8840000");

        assertEquals(129, DataTool.getInt(vlInfo.getChildByPath("level")));
        assertEquals(550000000, DataTool.getInt(vlInfo.getChildByPath("maxHP")));
        assertEquals(1, DataTool.getInt(vlInfo.getChildByPath("boss")));
        assertEquals(1, DataTool.getInt(vlInfo.getChildByPath("explosiveReward")));

        Data vlName = stringData.getChildByPath("8840000/name");
        assertNotNull(vlName, "8840000 name missing in String.wz");
        assertEquals("Von Leon", vlName.getData());

        // 8860008 Chaos Von Leon
        Path cvlPath = Path.of("wz/Mob.wz/8860008.img.xml");
        assertTrue(cvlPath.toFile().exists(), "8860008.img.xml missing");
        Data cvlData;
        try (FileInputStream input = new FileInputStream(cvlPath.toFile())) {
            cvlData = new XMLDomMapleData(input, cvlPath.getParent());
        }
        Data cvlInfo = cvlData.getChildByPath("info");
        assertNotNull(cvlInfo, "info section missing for 8860008");

        assertEquals(140, DataTool.getInt(cvlInfo.getChildByPath("level")));
        assertEquals(880000000, DataTool.getInt(cvlInfo.getChildByPath("maxHP")));
        assertEquals(1, DataTool.getInt(cvlInfo.getChildByPath("boss")));
        assertEquals(1, DataTool.getInt(cvlInfo.getChildByPath("explosiveReward")));

        Data cvlName = stringData.getChildByPath("8860008/name");
        assertNotNull(cvlName, "8860008 name missing in String.wz");
        assertEquals("Chaos Von Leon", cvlName.getData());
    }

    @Test
    void testVonLeonLiquibaseDropExtensionIntegrity() throws Exception {
        Path extPath = Path.of("src/main/resources/db/extensions/20261013-von-leon-drops.xml");
        assertTrue(extPath.toFile().exists(), "20261013-von-leon-drops.xml missing");

        String content = Files.readString(extPath);
        assertTrue(content.contains("DELETE FROM drop_data WHERE dropperid IN (8840000, 8860008);"));

        Pattern rowPattern = Pattern.compile("\\((\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(\\d+),\\s*(-?\\d+),\\s*(\\d+)\\)");
        Matcher matcher = rowPattern.matcher(content);

        Set<String> seenDrops = new HashSet<>();
        int countVl = 0;
        int countCvl = 0;

        while (matcher.find()) {
            int dropperId = Integer.parseInt(matcher.group(1));
            int itemId = Integer.parseInt(matcher.group(2));
            int minQ = Integer.parseInt(matcher.group(3));
            int maxQ = Integer.parseInt(matcher.group(4));
            int chance = Integer.parseInt(matcher.group(6));

            String key = dropperId + "-" + itemId;
            assertFalse(seenDrops.contains(key), "Duplicate drop detected: " + key);
            seenDrops.add(key);

            assertTrue(dropperId == 8840000 || dropperId == 8860008, "Invalid dropper: " + dropperId);
            assertTrue(chance > 0 && chance <= 1000000, "Invalid chance: " + chance);
            assertTrue(minQ > 0, "minQ must be > 0: " + minQ);
            assertTrue(maxQ >= minQ, "maxQ must be >= minQ: " + maxQ + " < " + minQ);

            if (itemId == 0) {
                // Mesos
                assertTrue(maxQ > minQ, "maxQ must be > minQ for mesos to avoid Randomizer.nextInt(0): [" + minQ + ", " + maxQ + "]");
            } else if (maxQ != 1) {
                // Multi-item drop
                assertTrue(maxQ > minQ, "maxQ must be > minQ when max != 1 to avoid Randomizer.nextInt(0): [" + minQ + ", " + maxQ + "]");
            }

            if (dropperId == 8840000) countVl++;
            if (dropperId == 8860008) countCvl++;
        }

        assertTrue(countVl >= 40, "Von Leon drops count insufficient: " + countVl);
        assertTrue(countCvl >= 40, "Chaos Von Leon drops count insufficient: " + countCvl);
    }
}
