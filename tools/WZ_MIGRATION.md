# Yuna client data audit / Cosmic XML staging

## Current pet compatibility status (2026-09-05)

Reverse engineering of `EverleafMS.exe` established the exact pet creation
layout. `CPet::Init` consumes a 16-bit foothold followed by two one-byte flags;
the server previously omitted both flags. This desynchronized every standalone
`SPAWN_PET` packet and every remote-player record containing a summoned pet.
The encoder now writes the complete layout. The executable also confirms that
pet movement has no extra pet ID and pet removal has no hunger trailer.

The temporary pet allowlist/quarantine has been removed. All 500xxxx pets and
pet ability accessories can be purchased, withdrawn and summoned. Items moved
to account Cash Shop storage by the earlier containment remain recoverable there.
The 140 complete, missing Pet XML trees from the verified audit were imported
without overwriting the 54 existing trees, giving the server metadata for all
194 pets that the recovered keystream could decode safely. Pets without a
decoded server tree use safe hunger and command defaults instead of throwing a
null-pointer exception. The 1,035 unique missing children from the fully decoded client
`String.wz/Pet.img` were also merged without replacing the 54 existing strings.
Incomplete/error exports remain excluded.

### Shop/hair investigation, 2026-09-04

#### Follow-up: disconnect while opening potion vendors

The local `yunams.dll` changes the stock executable's rechargeable checks.
Its hook at RVA `0x283d0` routes category 206 (arrows), in addition to bullets,
from EXE `0x752a53` into `0x752a5a`: shop rows consume an eight-byte double
and a two-byte capacity. The stock executable already routes category 207
there. The server previously wrote two shorts for arrows, leaving each arrow
row six bytes short and desynchronizing the next item. Potion vendors that
also list arrows can therefore disconnect before any purchase request.

The hook at DLL RVA `0x28e80`, installed at EXE `0x4e3fdf`, likewise consumes
eight extra bytes for arrow inventory records. `PacketCreator` now uses the
same 206/207/233 wire classification for both shop rows and item records.
Server stacking/pricing rules still use their existing classification.
This targets the Yuna protocol; an unmodified v83 client has a different
arrow format. Audited DLL SHA-256:
`c5ec61cba8f0006364a28e49c57bbe200618de2781ac44378d4bd1831c2ca984`.

Regression coverage decodes bow arrows, crossbow arrows, stars, bullets and
potions in one shop packet, plus an arrow and a subsequent potion in one
inventory update. Deployment of the rebuilt server and an in-game opening
of a potion vendor are still required to validate the live service.

#### Earlier investigation

Session 7847 closes 98 ms after OPEN_NPC_SHOP (305), 1,310 bytes, NPC 1011100.
There is no purchase request in the supplied fragment. All 48 shop IDs exist in
the client. Its executable reads five 32-bit values per row, then either two
shorts or an eight-byte double and a short (0x7529ad through 0x752a78). This
matches the packet lengths. Recharge unit prices previously retained only the
highest 16 bits of a double; the encoder now writes all 64 bits, with a mixed
potion/recharge regression test. This precision fix is not a proven crash fix.

The local stat decoder reads hair and mesos as 32-bit values and reads the
extra pet byte only for mask 0x180008 (0x4e2fba, 0xa1fbce). Tests lock in that
layout. All 706 hair IDs in the KIN page arrays exist in the audited client.
There is no hairstyle failure sequence or fresh client dump in the supplied
log. StyleDiag records preview IDs and chosen hair; stat/look metadata remains
logged after the initial packet limit. A fresh client dump and matching game
log are needed to identify the unresolved shop/hair fault. No binary patch or
claim of successful in-game shop/hair validation is made.

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

### Historical pet containment and shop diagnostics

The subsequent session 7809 log identifies pets 5002292 (DOGDOG) and 5002293
(Black Ewe). Their client XML exists, but server XML is absent. Missing XML is
not conclusive evidence of the native crash. Both IDs were temporarily
quarantined while the packet contract was unknown. That containment was removed
after the client decoder proved the missing two-byte trailer was the protocol
defect. This paragraph is retained only as incident history; neither ID is
blocked now.

Shop construction omits entries without server XML, keeping the transmitted
list and purchase lookup aligned. A stale slot may
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
6. Deploy the reviewed changes with a rollback manifest and verify the original
   affected characters with one, two and three summoned pets.
