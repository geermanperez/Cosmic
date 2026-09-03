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
package server;

import client.Client;
import client.inventory.InventoryType;
import client.inventory.Item;
import client.inventory.Pet;
import client.inventory.manipulator.InventoryManipulator;
import constants.id.ItemId;
import constants.inventory.ItemConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.DatabaseConnection;
import tools.PacketCreator;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * @author Matze
 */
public class Shop {
    private static final Logger log = LoggerFactory.getLogger(Shop.class);
    private static final Set<Integer> rechargeableItems = new LinkedHashSet<>();

    private final int id;
    private final int npcId;
    private final List<ShopItem> items;
    private final int tokenvalue = 1000000000;
    private final int token = ItemId.GOLDEN_MAPLE_LEAF;

    static {
        for (int throwingStarId : ItemId.allThrowingStarIds()) {
            rechargeableItems.add(throwingStarId);
        }
        rechargeableItems.add(ItemId.BLAZE_CAPSULE);
        rechargeableItems.add(ItemId.GLAZE_CAPSULE);
        rechargeableItems.add(ItemId.BALANCED_FURY);
        rechargeableItems.remove(ItemId.DEVIL_RAIN_THROWING_STAR); // doesn't exist
        for (int bulletId : ItemId.allBulletIds()) {
            rechargeableItems.add(bulletId);
        }
    }

    private Shop(int id, int npcId) {
        this.id = id;
        this.npcId = npcId;
        items = new ArrayList<>();
    }

    private void addItem(ShopItem item) {
        items.add(item);
    }

    public void sendShop(Client c) {
        c.getPlayer().setShop(this);
        c.sendPacket(PacketCreator.getNPCShop(c, getNpcId(), items));
    }

    public void buy(Client c, short slot, int itemId, short quantity) {
        if (quantity <= 0) {
            if (ItemConstants.isRechargeable(itemId)) {
                quantity = 1;
            } else {
                c.sendPacket(PacketCreator.shopTransaction((byte) 0x6));
                return;
            }
        }

        ShopItem item = findBySlot(slot);
        if (item == null || item.getItemId() != itemId) {
            for (ShopItem si : items) {
                if (si.getItemId() == itemId) {
                    item = si;
                    break;
                }
            }
        }
        if (item == null) {
            log.warn("Item {} not found in shop {}", itemId, id);
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x6));
            return;
        }

        ItemInformationProvider ii = ItemInformationProvider.getInstance();
        if (item.getPitch() > 0) {
            int amount = (int) Math.min((long) item.getPitch() * quantity, Integer.MAX_VALUE);

            if (c.getPlayer().getInventory(InventoryType.ETC).countById(ItemId.PERFECT_PITCH) >= amount) {
                if (InventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                    if (ItemConstants.isEquipment(itemId)) {
                        for (int i = 0; i < quantity; i++) {
                            InventoryManipulator.addById(c, itemId, (short) 1, "", -1);
                        }
                    } else if (!ItemConstants.isRechargeable(itemId)) {
                        InventoryManipulator.addById(c, itemId, quantity, "", -1);
                    } else {
                        short slotMax = ii.getSlotMax(c, item.getItemId());
                        InventoryManipulator.addById(c, itemId, slotMax, "", -1);
                    }
                    InventoryManipulator.removeById(c, InventoryType.ETC, ItemId.PERFECT_PITCH, amount, false, false);
                    c.sendPacket(PacketCreator.shopTransaction((byte) 0));
                } else {
                    c.sendPacket(PacketCreator.shopTransaction((byte) 3));
                }
            } else {
                c.sendPacket(PacketCreator.shopTransaction((byte) 0xD));
            }
        } else {
            long cost = (long) Math.max(0, item.getPrice()) * (ItemConstants.isRechargeable(itemId) ? 1 : quantity);
            if (cost > Integer.MAX_VALUE) {
                cost = Integer.MAX_VALUE;
            }

            if (c.getPlayer().getMeso() >= cost) {
                if (InventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                    if (ItemConstants.isEquipment(itemId)) {
                        for (int i = 0; i < quantity; i++) {
                            InventoryManipulator.addById(c, itemId, (short) 1, "", -1);
                        }
                    } else if (!ItemConstants.isRechargeable(itemId)) {
                        InventoryManipulator.addById(c, itemId, quantity, "", -1);
                    } else {
                        short slotMax = ii.getSlotMax(c, item.getItemId());
                        InventoryManipulator.addById(c, itemId, slotMax, "", -1);
                    }
                    if (cost > 0) {
                        c.getPlayer().gainMeso((int) -cost, false);
                    }
                    c.sendPacket(PacketCreator.shopTransaction((byte) 0));
                } else {
                    c.sendPacket(PacketCreator.shopTransaction((byte) 3));
                }
            } else if (c.getPlayer().getInventory(InventoryType.CASH).countById(token) != 0) {
                int amount = c.getPlayer().getInventory(InventoryType.CASH).countById(token);
                long value = (long) amount * tokenvalue;
                if (c.getPlayer().getMeso() + value >= cost) {
                    long cardreduce = value - cost;
                    long diff = cardreduce + c.getPlayer().getMeso();
                    if (InventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                        if (ItemConstants.isEquipment(itemId)) {
                            for (int i = 0; i < quantity; i++) {
                                InventoryManipulator.addById(c, itemId, (short) 1, "", -1);
                            }
                        } else if (ItemConstants.isPet(itemId)) {
                            int petid = Pet.createPet(itemId);
                            InventoryManipulator.addById(c, itemId, quantity, "", petid, -1);
                        } else if (!ItemConstants.isRechargeable(itemId)) {
                            InventoryManipulator.addById(c, itemId, quantity, "", -1);
                        } else {
                            short slotMax = ii.getSlotMax(c, item.getItemId());
                            InventoryManipulator.addById(c, itemId, slotMax, "", -1);
                        }
                        c.getPlayer().gainMeso((int) diff, false);
                        c.sendPacket(PacketCreator.shopTransaction((byte) 0));
                    } else {
                        c.sendPacket(PacketCreator.shopTransaction((byte) 3));
                    }
                } else {
                    c.sendPacket(PacketCreator.shopTransaction((byte) 2));
                }
            } else {
                c.sendPacket(PacketCreator.shopTransaction((byte) 2));
            }
        }
    }

    private static boolean canSell(Item item, short quantity) {
        if (item == null) { //Basic check
            return false;
        }

        short iQuant = item.getQuantity();
        if (iQuant == 0xFFFF) {
            iQuant = 1;
        } else if (iQuant < 0) {
            return false;
        }

        if (!ItemConstants.isRechargeable(item.getItemId())) {
            return iQuant != 0 && quantity <= iQuant;
        }

        return true;
    }

    private static short getSellingQuantity(Item item, short quantity) {
        if (ItemConstants.isRechargeable(item.getItemId())) {
            quantity = item.getQuantity();
            if (quantity == 0xFFFF) {
                quantity = 1;
            }
        }

        return quantity;
    }

    public void sell(Client c, InventoryType type, short slot, short quantity) {
        if (quantity == 0xFFFF || quantity == 0) {
            quantity = 1;
        } else if (quantity < 0) {
            return;
        }

        Item item = c.getPlayer().getInventory(type).getItem(slot);
        if (canSell(item, quantity)) {
            quantity = getSellingQuantity(item, quantity);
            InventoryManipulator.removeFromSlot(c, type, (byte) slot, quantity, false);

            ItemInformationProvider ii = ItemInformationProvider.getInstance();
            int recvMesos = ii.getPrice(item.getItemId(), quantity);
            if (recvMesos > 0) {
                c.getPlayer().gainMeso(recvMesos, false);
            }
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x8));
        } else {
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x5));
        }
    }

    public void recharge(Client c, short slot) {
        ItemInformationProvider ii = ItemInformationProvider.getInstance();
        Item item = c.getPlayer().getInventory(InventoryType.USE).getItem(slot);
        if (item == null || !ItemConstants.isRechargeable(item.getItemId())) {
            return;
        }
        short slotMax = ii.getSlotMax(c, item.getItemId());
        if (item.getQuantity() < 0) {
            return;
        }
        if (item.getQuantity() < slotMax) {
            int price = (int) Math.ceil(ii.getUnitPrice(item.getItemId()) * (slotMax - item.getQuantity()));
            if (c.getPlayer().getMeso() >= price) {
                item.setQuantity(slotMax);
                c.getPlayer().forceUpdateItem(item);
                c.getPlayer().gainMeso(-price, false, true, false);
                c.sendPacket(PacketCreator.shopTransaction((byte) 0x8));
            } else {
                c.sendPacket(PacketCreator.shopTransaction((byte) 0x2));
            }
        }
    }

    private ShopItem findBySlot(short slot) {
        if (slot >= 0 && slot < items.size()) {
            return items.get(slot);
        }
        return null;
    }

    public List<ShopItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public static Shop createGmShop() {
        Shop gmShop = new Shop(1337, 11000);
        int[] gmItemIds = new int[]{
            // Scrolls
            2340000, 2040807, 2041200, 2044908, 2044815, 2044512, 2044712, 2044612, 2043312, 2043117,
            2043217, 2043023, 2044417, 2044317, 2043812, 2044117, 2044217, 2044025, 2043712,
            // Potions & Buffs
            2050004, 2022179, 2022273, 2000005, 2000004, 2000003, 2000002, 2000001, 2000000,
            // Stars & Bullets
            2070018, 2070016, 2070006, 2330005, 2332000, 2331000, 2060004, 2061004,
            // ETC / Rocks
            4006001, 4001017, 4031179,
            // Megaphones
            5072000, 5390000, 5390001, 5390002, 5390005, 5390006,
            // Equips & GM gears
            1002140, 1042003, 1062007, 1322013, 1072010, 1002959, 1122000, 1082149,
            1492013, 1482013, 1452044, 1472052, 1462039, 1332050, 1312031, 1322052,
            1302059, 1442045, 1432038, 1382036, 1412026, 1422028, 1402036, 1372032,
            // Mounts & Saddles
            1912000, 1902000, 1902001, 1902002, 1912005, 1902005, 1902006, 1902007,
            1912011, 1902015, 1902016, 1902017, 1902018
        };
        for (int itemId : gmItemIds) {
            if (ItemConstants.isRechargeable(itemId)) {
                gmShop.addItem(new ShopItem((short) 1, itemId, 1, 0));
            } else {
                gmShop.addItem(new ShopItem((short) 1000, itemId, 1, 0));
            }
        }
        for (Integer recharge : rechargeableItems) {
            boolean already = false;
            for (int itemId : gmItemIds) {
                if (itemId == recharge) {
                    already = true;
                    break;
                }
            }
            if (!already) {
                gmShop.addItem(new ShopItem((short) 1, recharge, 1, 0));
            }
        }
        return gmShop;
    }

    public static Shop createFromDB(int id, boolean isShopId) {
        Shop ret = null;
        int shopId;
        try (Connection con = DatabaseConnection.getConnection()) {
            final String query;
            if (isShopId) {
                query = "SELECT * FROM shops WHERE shopid = ?";
            } else {
                query = "SELECT * FROM shops WHERE npcid = ?";
            }

            try (PreparedStatement ps = con.prepareStatement(query)) {
                ps.setInt(1, id);

                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        shopId = rs.getInt("shopid");
                        ret = new Shop(shopId, rs.getInt("npcid"));
                    } else {
                        if (isShopId && id == 1337) {
                            return createGmShop();
                        }
                        return null;
                    }
                }
            }

            try (PreparedStatement ps = con.prepareStatement("SELECT itemid, price, pitch FROM shopitems WHERE shopid = ? ORDER BY position DESC")) {
                ps.setInt(1, shopId);

                try (ResultSet rs = ps.executeQuery()) {
                    List<Integer> recharges = new ArrayList<>(rechargeableItems);
                    while (rs.next()) {
                        if (ItemConstants.isRechargeable(rs.getInt("itemid"))) {
                            ShopItem starItem = new ShopItem((short) 1, rs.getInt("itemid"), rs.getInt("price"), rs.getInt("pitch"));
                            ret.addItem(starItem);
                            if (rechargeableItems.contains(starItem.getItemId())) {
                                recharges.remove(Integer.valueOf(starItem.getItemId()));
                            }
                        } else {
                            ret.addItem(new ShopItem((short) 1000, rs.getInt("itemid"), rs.getInt("price"), rs.getInt("pitch")));
                        }
                    }
                    for (Integer recharge : recharges) {
                        ret.addItem(new ShopItem((short) 1000, recharge, 0, 0));
                    }
                }
            }
            if (isShopId && id == 1337 && ret.items.isEmpty()) {
                return createGmShop();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            if (isShopId && id == 1337) {
                return createGmShop();
            }
        }
        return ret;
    }

    public int getNpcId() {
        return npcId;
    }

    public int getId() {
        return id;
    }
}
