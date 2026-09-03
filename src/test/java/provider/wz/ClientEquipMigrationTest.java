package provider.wz;

import org.junit.jupiter.api.Test;
import provider.Data;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ClientEquipMigrationTest {
    @Test
    void importedCaitlynEquipsLoadThroughCosmicProvider() throws Exception {
        Map<String, String> equips = Map.of(
                "Cap/01001144", "Night Amelie",
                "Longcoat/01053507", "Ice Cream Lover Outfit (F)",
                "Shoes/01073324", "Frilly Pink Pajama Slippers",
                "Glove/01082751", "[BTS] Holly Mystic",
                "Cape/01102868", "Triple Bat Cape",
                "Ring/01112164", "Sweet Summer Label Ring",
                "Ring/01115137", "Falling Darkness Label Ring",
                "Weapon/01703160", "Teddy Bear Ribbon");
        Path stringsPath = Path.of("wz/String.wz/Eqp.img.xml");
        Data names;
        try (FileInputStream input = new FileInputStream(stringsPath.toFile())) {
            names = new XMLDomMapleData(input, stringsPath.getParent());
        }
        for (var entry : equips.entrySet()) {
            Path path = Path.of("wz/Character.wz", entry.getKey() + ".img.xml");
            try (FileInputStream input = new FileInputStream(path.toFile())) {
                Data data = new XMLDomMapleData(input, path.getParent());
                assertNotNull(data.getChildByPath("info/cash"), entry.getKey());
                assertEquals(DataType.INT, data.getChildByPath("info/cash").getType());
                assertFalse(((String) data.getChildByPath("info/islot").getData()).isBlank());
                assertFalse(((String) data.getChildByPath("info/vslot").getData()).isBlank());
            }
            String[] parts = entry.getKey().split("/");
            int id = Integer.parseInt(parts[1]);
            assertEquals(entry.getValue(), names.getChildByPath("Eqp/" + parts[0] + "/" + id + "/name").getData());
        }
    }
}
