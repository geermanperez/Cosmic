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
import config.YamlConfig;
import constants.id.MapId;
import net.AbstractPacketHandler;
import net.packet.InPacket;
import net.server.coordinator.world.InviteCoordinator;
import net.server.coordinator.world.InviteCoordinator.InviteType;
import net.server.world.Party;
import net.server.world.PartyCharacter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.maps.FieldLimit;
import server.maps.MapleMap;
import tools.PacketCreator;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Moogra
 * @author Ubaware
 */
public final class FamilyUseHandler extends AbstractPacketHandler {
    private static final Logger log = LoggerFactory.getLogger(FamilyUseHandler.class);
    private static final int PARTY_EXP_2_DURATION = 60 * 60 * 1000;

    @Override
    public final void handlePacket(InPacket p, Client c) {
        Character player = c.getPlayer();
        if (!YamlConfig.config.server.USE_FAMILY_SYSTEM) {
            log.info("Family entitlement rejected for {}: family system disabled", player != null ? player.getName() : "unknown");
            return;
        }

        int entitlementId = p.readInt();
        FamilyEntitlement[] entitlements = FamilyEntitlement.values();
        if (entitlementId < 0 || entitlementId >= entitlements.length) {
            log.warn("Family entitlement rejected for {}: invalid entitlement id {}", player != null ? player.getName() : "unknown", entitlementId);
            return;
        }

        FamilyEntitlement type = entitlements[entitlementId];
        int cost = type.getRepCost();
        FamilyEntry entry = player.getFamilyEntry();
        if (entry == null) {
            log.info("Family entitlement rejected for {}: no family entry", player.getName());
            return;
        }
        int repBefore = entry.getReputation();
        if (repBefore < cost) {
            log.info("Family entitlement rejected for {}: insufficient REP for {} (id {}, rep {}, cost {})",
                    player.getName(), type.getName(), entitlementId, repBefore, cost);
            return;
        }
        if (entry.isEntitlementUsed(type)) {
            log.info("Family entitlement rejected for {}: {} (id {}) already used today",
                    player.getName(), type.getName(), entitlementId);
            return;
        }
        log.info("Family entitlement request: chr {} (id {}) entitlement {} (id {}, cost {}, rep before {})",
                player.getName(), player.getId(), type.getName(), entitlementId, cost, repBefore);
        c.sendPacket(PacketCreator.getFamilyInfo(entry));
        Character victim;
        if (type == FamilyEntitlement.FAMILY_REUINION || type == FamilyEntitlement.SUMMON_FAMILY) {
            victim = c.getChannelServer().getPlayerStorage().getCharacterByName(p.readString());
            if (victim != null && victim != player) {
                if (victim.getFamily() == player.getFamily()) {
                    MapleMap targetMap = victim.getMap();
                    MapleMap ownMap = player.getMap();
                    if (targetMap != null) {
                        if (type == FamilyEntitlement.FAMILY_REUINION) {
                            if (!FieldLimit.CANNOTMIGRATE.check(ownMap.getFieldLimit()) && !FieldLimit.CANNOTVIPROCK.check(targetMap.getFieldLimit())
                                    && (targetMap.getForcedReturnId() == MapId.NONE || MapId.isMapleIsland(targetMap.getId())) && targetMap.getEventInstance() == null) {

                                c.getPlayer().changeMap(victim.getMap(), victim.getMap().getPortal(0));
                                useEntitlement(entry, type, repBefore, 0, List.of(player));
                            } else {
                                log.info("Family entitlement rejected for {}: invalid reunion map/state", player.getName());
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
                                InviteCoordinator.createInvite(InviteType.FAMILY_SUMMON, player, victim, victim.getId(), player.getMap());
                                victim.sendPacket(PacketCreator.sendFamilySummonRequest(player.getFamily().getName(), player.getName()));
                                useEntitlement(entry, type, repBefore, 0, List.of(player));
                            } else {
                                log.info("Family entitlement rejected for {}: invalid summon map/state", player.getName());
                                c.sendPacket(PacketCreator.sendFamilyMessage(75, 0));
                                return;
                            }
                        }
                    }
                } else {
                    log.info("Family entitlement rejected for {}: target {} is not in same family", player.getName(), victim.getName());
                    c.sendPacket(PacketCreator.sendFamilyMessage(67, 0));
                }
            } else {
                log.info("Family entitlement rejected for {}: target missing or self target", player.getName());
            }
        } else if (type == FamilyEntitlement.FAMILY_BONDING) {
            log.info("Family entitlement rejected for {}: {} is not implemented", player.getName(), type.getName());
        } else {
            boolean party = false;
            boolean isExp = false;
            boolean isDrop = false;
            int multiplier = 1;
            int duration = 15;
            do {
                switch (type) {
                    case PARTY_EXP_2_30MIN:
                        party = true;
                        isExp = true;
                        type = FamilyEntitlement.SELF_EXP_2_30MIN;
                        duration = 60;
                        continue;
                    case PARTY_DROP_2_30MIN:
                        party = true;
                        type = FamilyEntitlement.SELF_DROP_2_30MIN;
                        continue;
                    case SELF_DROP_2_30MIN:
                        duration = 30;
                    case SELF_DROP_2:
                        multiplier = 2;
                    case SELF_DROP_1_5:
                        isDrop = true;
                        break;
                    case SELF_EXP_2_30MIN:
                        duration = 30;
                    case SELF_EXP_2:
                        multiplier = 2;
                    case SELF_EXP_1_5:
                        isExp = true;
                    default:
                        break;
                }
                break;
            } while (true);

            FamilyEntitlement requestedType = entitlements[entitlementId];
            int durationMillis = requestedType == FamilyEntitlement.PARTY_EXP_2_30MIN ? PARTY_EXP_2_DURATION : duration * 60 * 1000;
            List<Character> targets = getEntitlementTargets(player, party);
            if (targets.isEmpty()) {
                log.info("Family entitlement rejected for {}: no valid online targets for {} (party {})",
                        player.getName(), requestedType.getName(), party);
                return;
            }
            if (multiplier <= 1) {
                log.info("Family entitlement rejected for {}: unsupported non-integer rate for {}",
                        player.getName(), requestedType.getName());
                return;
            }
            if (useEntitlement(entry, requestedType, repBefore, durationMillis, targets)) {
                for (Character target : targets) {
                    target.applyFamilyEntitlementRate(isExp, isDrop, multiplier, durationMillis, requestedType.getName());
                }
            }
        }
    }

    private List<Character> getEntitlementTargets(Character player, boolean party) {
        List<Character> targets = new ArrayList<>();
        if (!party) {
            targets.add(player);
            return targets;
        }

        Party playerParty = player.getParty();
        if (playerParty == null) {
            targets.add(player);
            return targets;
        }

        for (PartyCharacter member : playerParty.getPartyMembersOnline()) {
            Character partyMember = player.getWorldServer().getPlayerStorage().getCharacterById(member.getId());
            if (partyMember != null) {
                targets.add(partyMember);
            }
        }
        return targets;
    }

    private boolean useEntitlement(FamilyEntry entry, FamilyEntitlement entitlement, int repBefore, int duration, List<Character> targets) {
        if (entry.useEntitlement(entitlement)) {
            entry.gainReputation(-entitlement.getRepCost(), false);
            if (!entry.saveReputation()) {
                log.warn("Family entitlement activated for {}, but reputation save failed after {} (id {})",
                        entry.getName(), entitlement.getName(), entitlement.ordinal());
            }
            entry.getChr().sendPacket(PacketCreator.getFamilyInfo(entry));
            log.info("Family entitlement activated: chr {} entitlement {} (id {}) rep {} -> {} duration {}ms targets {}",
                    entry.getName(), entitlement.getName(), entitlement.ordinal(), repBefore, entry.getReputation(), duration,
                    targets.stream().map(Character::getName).toList());
            return true;
        }
        log.info("Family entitlement rejected for {}: DB/usage insert failed or already used for {} (id {})",
                entry.getName(), entitlement.getName(), entitlement.ordinal());
        return false;
    }
}
