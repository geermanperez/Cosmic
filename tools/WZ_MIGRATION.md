# Yuna client data audit / Cosmic XML staging

## Current restriction status (2026-09-04)

At the user's explicit request, accessories 1812000 through 1812004 are enabled
again: Meso Magnet, Item Pouch, Auto HP Pouch, Auto MP Pouch and Wing Boots.
They can be purchased/withdrawn and are no longer moved out of character
inventory on login. Existing items in Cash Shop storage can be withdrawn
normally after deployment; deleted items are not recreated by this change.
Only pets 5002292 and 5002293 remain quarantined. Earlier references below to
the five-accessory quarantine describe historical diagnostics, not current policy.
The user reports successful login after clearing Caitlyn's inventory; this
does not establish which individual item or stored field caused the crash.

This tool does not modify the client, the database, or `Cosmic/wz`.
It indexes PKG1 archives and exports selected IMG property trees to a new,
separate staging directory. It preserves XML property types, vectors, UOLs,
canvas dimensions and child properties. PNG/audio payloads remain in the client.
Cosmic's `XMLDomMapleData` uses this XML representation; this is not a client
binary migration and does not fix opcode/layout or native DLL defects.

## Run

From the directory containing Cosmic and EverleafMs:

```powershell
python Cosmic/tools/test_audit_yuna_wz.py
python Cosmic/tools/audit_yuna_wz.py --client EverleafMs --server-wz Cosmic/wz --output .codex-analysis/new-audit --archives Character Item Etc String
```

The output directory must not already exist or be inside the client/server WZ
trees. All archives are inventoried; only `--archives` selections are exported.
Names passed to this option omit `.wz`. `List.wz` is not a PKG1 archive and is
reported as unsupported rather than interpreted as a normal WZ archive.

## Recovering the client keystream

The built-in key contains only the first 17 verified bytes.
The old scratch scripts incorrectly filled the rest with zeroes. This corrupts
long property names, paths and text. Do not import their unverified exports.
The audit now rejects strings needing any unavailable key byte. It records the
reason in `report.json`; it never guesses or substitutes replacement text.

The local recovery now derives 2,752 consensus bytes from 43,863 distinct
matching strings in the client's String/Etc/Quest archives and existing Cosmic
XML. Each recovered byte requires at least three distinct strings and 95%
agreement. This is a bounded recovered prefix, not a claim that every possible
string can be decoded. Strings beyond the recovered prefix still fail closed.
An independent NPC/Mob sample parsed without errors; 62 images exactly matched
existing XML. Those archives were not used to recover the key.

```powershell
python Cosmic/tools/recover_yuna_wz_key.py --client EverleafMs --server-wz Cosmic/wz --output .codex-analysis/new-key
python Cosmic/tools/audit_yuna_wz.py --client EverleafMs --server-wz Cosmic/wz --output .codex-analysis/new-full-audit --archives all --key-stream .codex-analysis/new-key/consensus-keystream.bin --zip-output
```

The supplied file is an XOR keystream, not an AES key or IV. Its known prefix
alone does not validate remaining bytes. Keep the recovery report and validate
independent fixtures before import. `--zip-output` avoids creating thousands of
loose files. Ambiguous duplicate image paths are rejected rather than overwritten.
WZ crypto and format references: [MapleLib](https://github.com/lastbattle/MapleLib)
and [WZ format overview](https://github.com/lastbattle/Harepacker-resurrected/blob/master/docs/wz-format/wz-file-overview.md).

## Report interpretation

- `same`: parsed property tree matches the existing server XML.
- `different`: both exist but differ; review individual properties before merge.
- `missing`: valid staged image with no corresponding server XML file.
- `error`: not exported; conversion is incomplete for this image.
- `indexed_only`: path inventoried, image properties not decoded.

Missing XML is not proof that an item caused a crash. Some image paths contain
groups of items. XML presence does not prove the client supports the IDs or the
server supports their behavior. Out-of-range/custom content needs a separate
protocol, scripts and gameplay review. Do not overwrite a complete server tree
with a partial export; preserve server-specific maps, quests and balancing.

## Caitlyn findings, 2026-09-03

The initial 17-byte fail-closed run produced 7,690 staged XML images: 656 matching existing
server images, 4,270 different, and 2,764 missing. Another 34,318 images in the
selected archives were rejected because their strings require more keystream
bytes. These are partial conversion results, not a deployable full migration.
The directory inventory found 15,955 missing paths in Character.wz
and 960 in Item.wz; most of those could not yet be safely decoded.

The following client images were extracted and structurally compared against
the existing XML, including scalar types and canvas dimensions. All five match:

```
Character.wz/PetEquip/01812000.img
Character.wz/PetEquip/01812001.img
Character.wz/PetEquip/01812002.img
Character.wz/PetEquip/01812003.img
Character.wz/PetEquip/01812004.img
```

The supplied 22:52 server log also confirms removal of these five items from
Caitlyn's character inventory before SET_FIELD (2325 bytes), followed by a reset.
The native crash is therefore not established to be a missing XML problem.
The later attachment named `2114de92...` contains web access logs, not the game
server's current login/inventory data.

The public ranking API identified Caitlyn (character 9) and her equipped IDs.
Eight equipped cosmetics were absent from the server. Their complete metadata
trees were imported from the client, along with their String.wz names:

| ID | Category | Name |
| --- | --- | --- |
| 1001144 | Cap | Night Amelie |
| 1053507 | Longcoat | Ice Cream Lover Outfit (F) |
| 1073324 | Shoes | Frilly Pink Pajama Slippers |
| 1082751 | Glove | [BTS] Holly Mystic |
| 1102868 | Cape | Triple Bat Cape |
| 1112164 | Ring | Sweet Summer Label Ring |
| 1115137 | Ring | Falling Darkness Label Ring |
| 1703160 | Weapon | Teddy Bear Ribbon |

All eight imported trees match the decoded client structurally. All eight were
already listed in Commodity, so their cash packet flag was already true: adding
XML is a missing-data correction, not proof of a packet-layout fix. The JUnit
`ClientEquipMigrationTest` loads all eight through Cosmic's XML provider and
checks metadata and names. No character inventory or database was edited.

With `LATINMS_LOGIN_DIAGNOSTICS=true`, the login handler now logs appearance and
inventory IDs, slots, wire types, cash flags and equipment-data presence before
SET_FIELD. Collect the game service log after deploying and reproducing a login.
No successful in-game login or complete client/server compatibility is claimed.

## Before production import

### Pet containment and shop diagnostics

The subsequent session 7809 log identifies pets 5002292 (DOGDOG) and 5002293
(Black Ewe). Their client XML exists, but server XML is absent. Missing XML is
not conclusive evidence of the native crash. At the user's request, both IDs
are temporarily quarantined: login clears their summoned state and moves their
existing Item objects into account Cash Shop storage before SET_FIELD. Ownership,
pet IDs and other item fields are retained. Purchase, withdrawal and summoning
are blocked for these IDs; other pets are unaffected. The character/storage save
is invoked synchronously, with failures handled by the existing save routine.
This is containment, not full pet compatibility. Re-enable only after a tested
client/server fix and then withdraw the preserved items normally.

Shop construction omits entries without server XML or explicitly quarantined
IDs, keeping the transmitted list and purchase lookup aligned. A stale slot may
resolve another known requested ID, but an unknown ID cannot purchase the old
slot's unrelated item. These guards do not establish the cause of Eren's DC.
With login diagnostics enabled, ShopDiag records the shop/NPC and item IDs;
NPC talk/shop packet metadata remains logged beyond the initial 32 packets.
Test shop opening and buying/selling potions after deployment. If it still
disconnects, retain ShopDiag and the adjacent decoded packet entries.

1. Recover/verify enough client keystream and finish the relevant exports.
2. Reject any image with errors; review missing IDs and changed properties.
3. Back up the database and deployed XML tree.
4. Import only reviewed paths into a test server using the matching client.
5. Test character login, map transitions, cash shop, equip/unequip and reconnect.
6. Deploy the reviewed changes with a rollback manifest. Do not remove the
   temporary server quarantine until the original items work in the client.
