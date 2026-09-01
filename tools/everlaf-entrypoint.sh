#!/bin/sh
set -eu

BASE_CONFIG="/opt/server/config.base.yaml"
RUNTIME_CONFIG="/opt/server/config.yaml"

if [ ! -f "$BASE_CONFIG" ]; then
  echo "[Everlaf] Missing $BASE_CONFIG"
  exit 1
fi

cp "$BASE_CONFIG" "$RUNTIME_CONFIG"

# Everlaf MS identity for the active Scania world slot.
sed -i '0,/server_message: Welcome to Scania!/s//server_message: Welcome to Everlaf MS!/' "$RUNTIME_CONFIG"
sed -i '0,/event_message: Scania!/s//event_message: Everlaf MS - Classic Global MapleStory/' "$RUNTIME_CONFIG"
sed -i '0,/why_am_i_recommended: Welcome to Scania!/s//why_am_i_recommended: Everlaf MS - Classic progression/' "$RUNTIME_CONFIG"

# Classic rates: 1x EXP / 1x mesos / 1x drops / 1x boss drops / 1x quests.
sed -i '0,/exp_rate: 10/s//exp_rate: 1/' "$RUNTIME_CONFIG"
sed -i '0,/meso_rate: 10/s//meso_rate: 1/' "$RUNTIME_CONFIG"
sed -i '0,/drop_rate: 10/s//drop_rate: 1/' "$RUNTIME_CONFIG"
sed -i '0,/boss_drop_rate: 10/s//boss_drop_rate: 1/' "$RUNTIME_CONFIG"
sed -i '0,/quest_rate: 5/s//quest_rate: 1/' "$RUNTIME_CONFIG"

# Keep travel/fishing at vanilla speed/rate as part of the classic relaunch.
sed -i '0,/fishing_rate: 10/s//fishing_rate: 1/' "$RUNTIME_CONFIG"
sed -i '0,/travel_rate: 10/s//travel_rate: 1/' "$RUNTIME_CONFIG"

# Strong incentive to level in parties while keeping solo progression vanilla.
sed -i 's/PARTY_BONUS_EXP_RATE: 1.0/PARTY_BONUS_EXP_RATE: 3.0/' "$RUNTIME_CONFIG"

printf '%s\n' \
  '[Everlaf] Runtime configuration applied:' \
  '  EXP 1x | MESO 1x | DROP 1x | BOSS DROP 1x | QUEST 1x' \
  '  PARTY BONUS EXP 3x'

exec java -jar ./Server.jar
