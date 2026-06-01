# LatinMS NPC names and speech bubbles

## Scope

This review is for a MapleStory v83/Cosmic server that uses XML-exported WZ data under `wz/`.

Requested lobby labels:

| Party Quest | Visible NPC name |
| --- | --- |
| Henesys PQ | `Henesys PQ - Lv. 10+` |
| Kerning PQ | `Kerning PQ - Lv. 21+` |
| Ludibrium Maze PQ | `Ludibrium Maze PQ - Lv. 51+` |
| Ellin PQ | `Ellin PQ - Lv. 40+` |
| Romeo & Juliet PQ | `Romeo & Juliet PQ - Lv. 80+` |
| Pirate PQ | `Pirate PQ - Lv. 60+` |
| Orbis PQ | `Orbis PQ - Lv. 125+` |

## Files reviewed

| File or directory | Purpose |
| --- | --- |
| `wz/String.wz/Npc.img.xml` | Client-facing NPC strings in the XML WZ export. This includes `name`, `func`, and idle speech strings such as `n0`, `n1`, `d0`, `s0`. |
| `wz/Npc.wz/<npcId>.img.xml` | NPC visual and animation data in the XML WZ export. Some NPCs include `info/speak` or animation-local `speak` nodes that reference String WZ keys such as `n0` and `n1`. |
| `wz/Map.wz/Map/.../*.img.xml` | Map object placement. NPC objects use `<string name="id" value="NPC_ID"/>`. Example findings include Kerning PQ NPC `9020000` in `wz/Map.wz/Map/Map1/103000000.img.xml`, Ludi Maze NPC `9103001` in `wz/Map.wz/Map/Map2/220000000.img.xml`, and Orbis-related NPC `9200101` in `wz/Map.wz/Map/Map2/200000201.img.xml`. |
| `scripts/npc/` | Server NPC interaction scripts. File names are usually NPC IDs, for example `9020000.js`, `9103001.js`, `2133000.js`, `2112018.js`, and `2094000.js`. These affect click/dialog behavior, not the static name under the sprite. |
| `scripts/event/` | Party Quest event logic such as `HenesysPQ.js`, `KerningPQ.js`, `LudiMazePQ.js`, `EllinPQ.js`, `PiratePQ.js`, and `OrbisPQ.js`. |
| `src/main/java/provider/wz/XMLWZFile.java` | Server-side XML WZ reader. It reads `.img.xml` files from the configured WZ directory. It does not pack real client `.wz` files. |
| `src/main/java/provider/wz/WZFiles.java` | Declares WZ directories used by the server, defaulting to `wz/` unless `-Dwz-path=...` is supplied. |
| `src/main/java/net/opcodes/RecvOpcode.java` | Defines received opcode `NPC_ACTION(0xC5)`. |
| `src/main/java/net/opcodes/SendOpcode.java` | Defines sent opcode `NPC_ACTION(0x104)`. |
| `src/main/java/net/PacketProcessor.java` | Registers `RecvOpcode.NPC_ACTION` to `NPCAnimationHandler`. |
| `src/main/java/net/server/channel/handlers/NPCAnimationHandler.java` | Receives NPC animation/talk action packets and echoes `SendOpcode.NPC_ACTION` back to the client. This is the server-side fallback point for suppressing bubbles. |

## WZ tooling found

The project has tools under `src/main/java/tools/mapletools`, but they are data checkers/fetchers and SQL helpers. I did not find a safe built-in WZ packer/editor for writing binary client WZ files such as `String.wz`, `Npc.wz`, or `Map.wz`.

The repo does contain XML-exported WZ data under `wz/`. Editing `wz/String.wz/Npc.img.xml` may affect the server's own data reads, but the MapleStory client will only show changed NPC names if its actual client `String.wz` is also edited or rebuilt.

## Changing visible NPC names

Safest client-facing method: edit `String.wz > Npc.img > ID_DEL_NPC > name` with HaRepacker.

Before any edit, make a backup:

```text
String.wz -> String_backup.wz
```

HaRepacker steps:

1. Open `String.wz`.
2. Open `Npc.img`.
3. Find the NPC ID used in the LatinMS lobby map.
4. Edit or create the child property `name`.
5. Set the value to the desired label.
6. Save as the active client `String.wz`.
7. Keep `String_backup.wz` outside the client load path or clearly named as backup.

Example paths:

```text
String.wz > Npc.img > 9020000 > name = Kerning PQ - Lv. 21+
String.wz > Npc.img > 9103001 > name = Ludibrium Maze PQ - Lv. 51+
String.wz > Npc.img > 2133000 > name = Ellin PQ - Lv. 40+
String.wz > Npc.img > 2112018 > name = Romeo & Juliet PQ - Lv. 80+
String.wz > Npc.img > 2094000 > name = Pirate PQ - Lv. 60+
```

Confirm the exact IDs from the custom lobby's `Map.wz` before editing. Changing `String.wz > Npc.img > NPC_ID > name` is global: every map using that same NPC ID will show the new name.

If the same NPC appears elsewhere with its original role, prefer one of these safer options:

1. Use an unused/custom NPC ID in the lobby.
2. Clone the NPC visual into a new ID in `Npc.wz`, add the new ID to `String.wz/Npc.img`, then place that new ID in the lobby `Map.wz`.
3. Use a different existing NPC that is only used in the lobby.

## Finding lobby NPC IDs

Search the custom lobby map XML in `wz/Map.wz/Map/Map*/<mapId>.img.xml` for NPC objects:

```text
<string name="id" value="NPC_ID"/>
```

Then match that `NPC_ID` in:

```text
wz/String.wz/Npc.img.xml
wz/Npc.wz/NPC_ID.img.xml
scripts/npc/NPC_ID.js
```

Known PQ-related examples found in this repo:

| NPC ID | Current string / role evidence |
| --- | --- |
| `9020000` | Kerning PQ coordinator script `scripts/npc/9020000.js`; String entry exists near `wz/String.wz/Npc.img.xml`. |
| `9103001` | Ludi Maze PQ script `scripts/npc/9103001.js`; current name `Rolly`; idle text references Ludibrium Maze. |
| `2133000` | Ellin PQ coordinator script `scripts/npc/2133000.js`; current name `Ellin`. |
| `2112018` | Romeo & Juliet PQ script `scripts/npc/2112018.js`; current name `Romeo & Juliet`. |
| `2094000` | Pirate PQ event entry script `scripts/npc/2094000.js`; current name `Guon`. |
| `9200101` | Present in Orbis PQ map area; confirm before reusing because this ID is also an eye/lens NPC string in `String.wz`. |

## Speech bubbles above NPC heads

There are two relevant sources:

1. `String.wz/Npc.img`: the actual speech text values such as `n0`, `n1`, `d0`, `s0`.
2. `Npc.wz/<npcId>.img`: references telling the client which speech keys can be used, commonly under `info/speak` or under an animation node like `say0/speak`.

Examples found:

```text
wz/Npc.wz/9103001.img.xml
  info/speak -> n0, n1

wz/Npc.wz/9020000.img.xml
  info/speak -> n0, n1
  say0/speak -> n0, n1
  say1/speak -> n0, n1

wz/Npc.wz/2133000.img.xml
  animation-local speak node found

wz/Npc.wz/2094000.img.xml
  animation-local speak node found
```

Do not delete these nodes from binary client WZ without a backup:

```text
Npc.wz -> Npc_backup.wz
```

Possible WZ-side approaches, from safest to riskiest:

1. Prefer NPCs that already have no `speak` nodes and no `n0` / `n1` idle strings.
2. Clone a chosen NPC to a custom unused ID and remove `speak` references only in the clone.
3. Remove or empty `info/speak` and animation-local `speak` nodes on an existing NPC ID. This can affect every map using that NPC ID and may have client stability risk if the client expects those nodes.
4. Empty the `n0`, `n1`, etc. strings in `String.wz`. This is less destructive than deleting visual nodes, but it is still global for that NPC ID.

Recommended first pass for LatinMS lobby: choose NPC IDs with no speech bubbles instead of modifying shared `Npc.wz` animation data.

## Server-side fallback: NPCAnimationHandler

The server handler is:

```text
src/main/java/net/server/channel/handlers/NPCAnimationHandler.java
```

Current behavior:

```java
OutPacket op = OutPacket.create(SendOpcode.NPC_ACTION);
int length = p.available();
if (length == 6) { // NPC Talk
    op.writeInt(p.readInt());
    op.writeByte(p.readByte());
    op.writeByte(p.readByte());
} else if (length > 6) { // NPC Move
    byte[] bytes = p.readBytes(length - 9);
    op.writeBytes(bytes);
}
c.sendPacket(op);
```

Minimal proposed diff, not applied:

```diff
diff --git a/src/main/java/net/server/channel/handlers/NPCAnimationHandler.java b/src/main/java/net/server/channel/handlers/NPCAnimationHandler.java
--- a/src/main/java/net/server/channel/handlers/NPCAnimationHandler.java
+++ b/src/main/java/net/server/channel/handlers/NPCAnimationHandler.java
@@
         OutPacket op = OutPacket.create(SendOpcode.NPC_ACTION);
         int length = p.available();
         if (length == 6) { // NPC Talk
-            op.writeInt(p.readInt());
-            op.writeByte(p.readByte());   // 2 bytes, thanks resinate
-            op.writeByte(p.readByte());
+            return;
         } else if (length > 6) { // NPC Move
             byte[] bytes = p.readBytes(length - 9);
             op.writeBytes(bytes);
         }
```

This would suppress the echoed NPC talk action packets while keeping the `length > 6` NPC movement branch intact. Risk: if the client uses the six-byte `NPC_ACTION` packet for more than visible chat bubbles, this may also suppress some NPC talk animations or visual reactions. It should not block clicking or interacting with NPC scripts, because those use the NPC talk/more-talk handlers, not this animation echo path.

If this fallback is used, test carefully in normal towns and PQ maps. Do not apply it blindly on production.

## Backups needed

Before client WZ edits:

```text
String.wz -> String_backup.wz
Npc.wz -> Npc_backup.wz
Map.wz -> Map_backup.wz
```

Before XML WZ edits in this repo:

```text
wz/String.wz/Npc.img.xml -> wz/String.wz/Npc.img.xml.backup
wz/Npc.wz/<npcId>.img.xml -> wz/Npc.wz/<npcId>.img.xml.backup
wz/Map.wz/Map/Map*/<mapId>.img.xml -> corresponding .backup
```

For source code fallback:

```text
git diff -- src/main/java/net/server/channel/handlers/NPCAnimationHandler.java
```

Only commit/apply after reviewing the diff and testing in game.

## How to test in game

1. Launch the client with the edited `String.wz`.
2. Start the server with the expected WZ path. By default this repo uses `wz/`; a custom path can be supplied with `-Dwz-path=...`.
3. Enter the LatinMS lobby map.
4. Confirm each NPC's name under the sprite:
   - `Henesys PQ - Lv. 10+`
   - `Kerning PQ - Lv. 21+`
   - `Ludibrium Maze PQ - Lv. 51+`
   - `Ellin PQ - Lv. 40+`
   - `Romeo & Juliet PQ - Lv. 80+`
   - `Pirate PQ - Lv. 60+`
   - `Orbis PQ - Lv. 125+`
5. Wait near the NPCs long enough to see if idle speech bubbles appear.
6. Click each NPC and verify the script still opens.
7. Start or attempt each PQ entry flow enough to confirm the NPC is functional.
8. Visit any other map that uses the same NPC IDs and confirm global name changes are acceptable.

## How to revert

Client WZ:

1. Replace edited `String.wz` with `String_backup.wz`.
2. Replace edited `Npc.wz` with `Npc_backup.wz`.
3. Replace edited `Map.wz` with `Map_backup.wz`.

Repo XML WZ:

1. Restore the `.backup` XML file or revert the specific diff.
2. Restart the server if WZ data is loaded at boot.

Server-side fallback:

1. Revert the `NPCAnimationHandler.java` diff.
2. Rebuild and restart the server.
3. Confirm NPC animations and bubbles are back to baseline.

## Recommendation

For the first LatinMS lobby pass, do this in order:

1. Identify the exact NPC IDs placed in the custom lobby map.
2. Edit names in client `String.wz > Npc.img > NPC_ID > name` with HaRepacker.
3. Prefer alternate or cloned NPC IDs that do not have `speak` nodes.
4. Avoid deleting `Npc.wz` nodes on shared NPC IDs.
5. Use the server-side `NPCAnimationHandler` suppression only if WZ-side selection is not enough, and only after reviewing the diff and testing NPC movement/animation.
