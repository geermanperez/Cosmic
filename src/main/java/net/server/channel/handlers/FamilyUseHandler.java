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
package net.server.channel.handlers;

import client.Character;
import client.Client;
import client.FamilyEntitlement;
import client.FamilyEntry;
import client.FamilyBuffs;
import java.util.ArrayList;
import java.util.List;
import config.YamlConfig;
import constants.id.MapId;
import net.AbstractPacketHandler;
import net.packet.InPacket;
import net.server.coordinator.world.InviteCoordinator;
import net.server.coordinator.world.InviteCoordinator.InviteType;
import server.maps.FieldLimit;
import server.maps.MapleMap;
import tools.PacketCreator;

/**
 * @author Moogra
 * @author Ubaware
 */
public final class FamilyUseHandler extends AbstractPacketHandler {
    @Override
    public final void handlePacket(InPacket p, Client c) {
        if (!YamlConfig.config.server.USE_FAMILY_SYSTEM) {
            return;
        }
        int id = p.readInt();
        if (id < 0 || id >= FamilyEntitlement.values().length) {
            c.getPlayer().dropMessage(5, "Invalid Family entitlement.");
            return;
        }
        FamilyEntitlement type = FamilyEntitlement.values()[id];
        int cost = type.getRepCost();
        FamilyEntry entry = c.getPlayer().getFamilyEntry();
        if (entry == null) {
            c.getPlayer().dropMessage(5, "You must belong to a Family to use an entitlement.");
            return;
        }
        if (entry.getReputation() < cost) {
            c.getPlayer().dropMessage(5, "You need " + cost + " Family reputation to use this entitlement.");
            return;
        }
        if (entry.getEntitlementUsageCount(type) >= type.getUsageLimit()) {
            c.getPlayer().dropMessage(5, "You have already used this Family entitlement today.");
            return;
        }
        c.sendPacket(PacketCreator.getFamilyInfo(entry));
        Character victim;
        if (type == FamilyEntitlement.FAMILY_REUINION || type == FamilyEntitlement.SUMMON_FAMILY) {
            victim = c.getChannelServer().getPlayerStorage().getCharacterByName(p.readString());
            if (victim != null && victim != c.getPlayer()) {
                if (victim.getFamily() == c.getPlayer().getFamily()) {
                    MapleMap targetMap = victim.getMap();
                    MapleMap ownMap = c.getPlayer().getMap();
                    if (targetMap != null) {
                        if (type == FamilyEntitlement.FAMILY_REUINION) {
                            if (!FieldLimit.CANNOTMIGRATE.check(ownMap.getFieldLimit()) && !FieldLimit.CANNOTVIPROCK.check(targetMap.getFieldLimit())
                                    && (targetMap.getForcedReturnId() == MapId.NONE || MapId.isMapleIsland(targetMap.getId())) && targetMap.getEventInstance() == null) {

                                c.getPlayer().changeMap(victim.getMap(), victim.getMap().getPortal(0));
                                useEntitlement(entry, type);
                            } else {
                                c.sendPacket(PacketCreator.sendFamilyMessage(75, 0)); // wrong message, but close enough. (client should check this first anyway)
                                return;
                            }
                        } else {
                            if (!FieldLimit.CANNOTMIGRATE.check(targetMap.getFieldLimit()) && !FieldLimit.CANNOTVIPROCK.check(ownMap.getFieldLimit())
                                    && (ownMap.getForcedReturnId() == MapId.NONE || MapId.isMapleIsland(ownMap.getId())) && ownMap.getEventInstance() == null) {

                                if (InviteCoordinator.hasInvite(InviteType.FAMILY_SUMMON, victim.getId())) {
                                    c.sendPacket(PacketCreator.sendFamilyMessage(74, 0));
                                    return;
                                }
                                InviteCoordinator.createInvite(InviteType.FAMILY_SUMMON, c.getPlayer(), victim, victim.getId(), c.getPlayer().getMap());
                                victim.sendPacket(PacketCreator.sendFamilySummonRequest(c.getPlayer().getFamily().getName(), c.getPlayer().getName()));
                                useEntitlement(entry, type);
                            } else {
                                c.sendPacket(PacketCreator.sendFamilyMessage(75, 0));
                                return;
                            }
                        }
                    }
                } else {
                    c.sendPacket(PacketCreator.sendFamilyMessage(67, 0));
                }
            }
        } else {
            Character player = c.getPlayer();
            List<Character> recipients = new ArrayList<>();
            recipients.add(player);
            if (type == FamilyEntitlement.FAMILY_BONDING) {
                List<FamilyEntry> pending = new ArrayList<>(entry.getJuniors());
                for (int i = 0; i < pending.size(); i++) {
                    FamilyEntry junior = pending.get(i);
                    if (junior == null) continue;
                    pending.addAll(junior.getJuniors());
                    Character member = junior.getChr();
                    if (member != null && member.isLoggedinWorld()) recipients.add(member);
                }
                if (recipients.size() < 7) {
                    player.dropMessage(5, "Family Bonding requires 6 juniors online below you in the pedigree.");
                    return;
                }
            } else if (type == FamilyEntitlement.PARTY_EXP_2_30MIN
                    || type == FamilyEntitlement.PARTY_DROP_2_30MIN) {
                for (Character member : player.getPartyMembersOnSameMap()) {
                    if (member != player) recipients.add(member);
                }
            }
            if (useEntitlement(entry, type)) {
                for (Character recipient : recipients) {
                    FamilyBuffs.apply(recipient.getId(), type);
                    recipient.dropMessage(5, type.getName() + " is now active.");
                }
            } else {
                player.dropMessage(5, "The Family entitlement could not be activated. Please try again.");
            }
        }
    }

    private boolean useEntitlement(FamilyEntry entry, FamilyEntitlement entitlement) {
        if (entry.useEntitlement(entitlement)) {
            entry.gainReputation(-entitlement.getRepCost(), false);
            entry.getChr().sendPacket(PacketCreator.getFamilyInfo(entry));
            return true;
        }
        return false;
    }
}
