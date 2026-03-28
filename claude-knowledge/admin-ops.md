# Admin Operations

Common administrative tasks performed directly via MongoDB or the API, since the app's admin panel is oriented toward community management (banning, support) and does not support item grants or inventory edits.

---

## Granting Items via MongoDB

### Eggs

Eggs are stored as integer counts on the user document: `items.eggs.<EggKey>`.

```js
// Grant one Fox egg
db.users.updateOne(
  {'auth.local.username': 'Dax'},
  {$inc: {'items.eggs.Fox': 1}}
)
```

Use `$inc` rather than `$set` — it adds to an existing count instead of overwriting it. No other fields need updating; the count alone is the complete state. When the user hatches the egg through the UI, the game handles decrementing the count and creating the pet.

**Drop eggs** (standard pool, obtainable via drops/login incentives):
`BearCub`, `Cactus`, `Dragon`, `FlyingPig`, `Fox`, `LionCub`, `PandaCub`, `TigerCub`, `Wolf`

**Quest eggs** (obtained from completing quests): everything else — check `website/common/script/content/eggs.js` → `const quests`.

### Other inventory paths

| Item type | MongoDB path |
|---|---|
| Eggs | `items.eggs.<Key>` |
| Hatching potions | `items.hatchingPotions.<Key>` |
| Food | `items.food.<Key>` |
| Pets (owned) | `items.pets.<EggKey>-<PotionKey>` (e.g. `Fox-Base`) |
| Mounts (owned) | `items.mounts.<EggKey>-<PotionKey>` |
| Gear (owned) | `items.gear.owned.<gearKey>: true` |

All of these are simple `$set` or `$inc` operations with no dependent fields to update.

