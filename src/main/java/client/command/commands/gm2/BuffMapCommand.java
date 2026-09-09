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
package client.command.commands.gm2;

import client.Character;
import client.Client;
import client.Skill;
import client.SkillFactory;
import client.command.Command;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.StatEffect;

public class BuffMapCommand extends Command {
    private static final Logger log = LoggerFactory.getLogger(BuffMapCommand.class);

    private static final int[] BUFF_SKILLS = {
            4101004, // Haste
            2311003, // Holy Symbol
            1301007, // Hyper Body
            2301004, // Bless
            1005     // Echo of Hero
    };

    {
        setDescription("Give GM buffs to the whole map.");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        if (player == null || player.getMap() == null) {
            return;
        }

        if (log.isDebugEnabled()) {
            log.debug("BuffMap: executed by GM {} on map {}", player.getName(), player.getMapId());
        }

        for (Character target : player.getMap().getAllPlayers()) {
            if (target != null && target.isAlive()) {
                for (int skillId : BUFF_SKILLS) {
                    Skill skill = SkillFactory.getSkill(skillId);
                    if (skill != null) {
                        StatEffect effect = skill.getEffect(skill.getMaxLevel());
                        if (effect != null) {
                            effect.applyTo(target);
                        }
                    }
                }
                target.healHpMp();
                if (log.isDebugEnabled()) {
                    log.debug("BuffMap: applied buffs to player {}", target.getName());
                }
            }
        }
    }
}
