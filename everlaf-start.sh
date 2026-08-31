#!/bin/sh
set -eu

echo "[Everlaf] waiting for protected reset to complete..."
while [ ! -f /everlaf-state/reset.done ]; do
  sleep 1
done

echo "[Everlaf] reset gate released. Applying Everlaf MS runtime configuration..."
cp /opt/server/config.base.yaml /opt/server/config.yaml

sed -i \
  -e 's/#Properties for LatinMS 0/#Properties for Everlaf MS 0/' \
  -e 's/server_message: Bienvenido a LatinMS - MapleStory Latinoamerica!/server_message: Welcome to Everlaf MS!/' \
  -e 's/event_message: LatinMS v82 | EXP 2x | Mesos 2x | Quest 5x | Drops 2x/event_message: Everlaf MS | Classic GMS | EXP 1x | Mesos 1x | Drops 1x/' \
  -e 's/why_am_i_recommended: Servidor latino, comunidad amigable, rates equilibrados y progresion clasica./why_am_i_recommended: Classic MapleStory progression with enhanced party and PQ content./' \
  -e 's/^    exp_rate: 2$/    exp_rate: 1/' \
  -e 's/^    meso_rate: 2$/    meso_rate: 1/' \
  -e 's/^    drop_rate: 2$/    drop_rate: 1/' \
  -e 's/^    boss_drop_rate: 3$/    boss_drop_rate: 1/' \
  -e 's/^    quest_rate: 5$/    quest_rate: 1/' \
  -e 's/^    PARTY_BONUS_EXP_RATE: 1.0/    PARTY_BONUS_EXP_RATE: 5.0/' \
  /opt/server/config.yaml

echo "[Everlaf] Runtime configuration applied:"
echo "[Everlaf] EXP 1x | MESO 1x | DROP 1x | BOSS DROP 1x | QUEST 1x"
echo "[Everlaf] PARTY BONUS EXP 5x"
echo "[Everlaf] Existing PQ bonuses, mobs, scripts, commands, resets and custom maps are preserved."

exec java -jar ./Server.jar
