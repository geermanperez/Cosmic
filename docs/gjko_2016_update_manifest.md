# GJKO 2016 Cosmetic Update

Source: `D:\update\GJKO©2016.rar`

Extracted client WZ files:

- `Character.wz`
- `Effect.wz`
- `String.wz`
- `UI.wz`
- `Etc.wz`
- `Item.wz`

Server-side changes applied:

- `scripts/npc/9900000.js` replaced with Gijiko AIO Style NPC, with server-side filtering for missing hair and face IDs.
- `scripts/npc/9900001.js` replaced with Gijiko AIO Cosplay Style NPC, with server-side filtering for missing hair and face IDs.
- `SkinColor` extended with the custom skin IDs used by the cosplay NPC.
- `String.wz/Eqp.img.xml` received name entries for the listed custom cosmetics so the server can recognize them by ID.

Important follow-up:

The running server uses XML-exported WZ data from `wz/`. The `.wz` binaries from the update are useful for the MapleStory client, but they are not read directly by the Java server. To fully equip/render the new custom items server-side, export the update WZ files with HaRepacker-resurrected using `GMS (old)` encryption and `Private server` XML format, then merge only the listed new item/style nodes into the repo XML WZ folders.

Primary custom IDs from the package:

- Accessory: `1012483`, `1012484`, `1012493`, `1012494`, `1012495`, `1012496`, `1012497`, `1012498`, `1012499`, `1012505`, `1012519`, `1022100`, `1032256`, `1032260`
- Cap: `1008572` through `1008589`
- Face: `20086`, `26601`, `26602`, `26603`, `26604`
- Hair: `35290`
- Ring: `1112138`, `1112248`
- Cape: `1103502`
- Medal: `1142490` through `1142495`
