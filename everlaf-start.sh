#!/bin/sh
set -eu

echo "[EverleafMs] waiting for protected reset to complete..."
while [ ! -f /everlaf-state/reset.done ]; do
  sleep 1
done

echo "[EverleafMs] reset gate released. Applying EverleafMs runtime configuration..."
cp /opt/server/config.base.yaml /opt/server/config.yaml

sed -i \
  -e 's/#Properties for LatinMS 0/#Properties for EverleafMs 0/' \
  -e 's/server_message: Bienvenido a LatinMS - MapleStory Latinoamerica!/server_message: Welcome to EverleafMs V83 Classic!/' \
  -e 's/event_message: LatinMS v82 | EXP 2x | Mesos 2x | Quest 5x | Drops 2x/event_message: EverleafMs V83 Classic | EXP 1x | Mesos 1x | Drops 1x | Party 5x/' \
  -e 's/why_am_i_recommended: Servidor latino, comunidad amigable, rates equilibrados y progresion clasica./why_am_i_recommended: Classic MapleStory progression, global community, adventure and enhanced party\/PQ content./' \
  -e 's/^    exp_rate: 2$/    exp_rate: 1/' \
  -e 's/^    meso_rate: 2$/    meso_rate: 1/' \
  -e 's/^    drop_rate: 2$/    drop_rate: 1/' \
  -e 's/^    boss_drop_rate: 3$/    boss_drop_rate: 1/' \
  -e 's/^    quest_rate: 5$/    quest_rate: 1/' \
  -e 's/^    PARTY_BONUS_EXP_RATE: 1.0/    PARTY_BONUS_EXP_RATE: 5.0/' \
  /opt/server/config.yaml

echo "[EverleafMs] Runtime configuration applied:"
echo "[EverleafMs] EXP 1x | MESO 1x | DROP 1x | BOSS DROP 1x | QUEST 1x"
echo "[EverleafMs] PARTY BONUS EXP 5x"
echo "[EverleafMs] Existing PQ bonuses, mobs, scripts, commands, resets and custom maps are preserved."

exec java -jar ./Server.jar
