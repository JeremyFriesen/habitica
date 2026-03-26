# Custom Modifications

All divergences from upstream Habitica in this fork.

## 1. GP Scoring Override

**File**: `website/common/script/ops/scoreTask.js` → `_addPoints`

Fixed GP amounts replace the default delta-based formula:

| Priority | Value | GP |
|---|---|---|
| Trivial | 0.1 | 100 |
| Easy | 1 | 200 |
| Medium | 1.5 | 300 |
| Hard | 2 | 400 |

Direction is applied explicitly — unchecking negates the amount:
```js
stats.gp += direction === 'down' ? -gpMod : gpMod;
```

EXP still uses the original delta-based formula (unchanged).

## 2. Criticality Chance

**Field**: `task.criticalityChance`, `task.critRoll`
**Schema**: `website/server/models/task.js`
**Scoring logic**: `website/common/script/ops/scoreTask.js`
**UI**: `website/client/src/components/tasks/critRollModal.vue`
**Mixin**: `website/client/src/mixins/scoreTask.js` → `getCritRoll()`

Dice-based GP bonus on specific tasks. When a task has `criticalityChance` set, the client rolls the dice before scoring, shows a modal with the result, and passes the roll value to the server via the API. The server applies a GP modifier based on the roll falling within configured ranges. `task.critRoll` stores the last roll for GP reversal on uncheck.

Set per-task via MongoDB migration (see `migrations/tasks/`).

## 3. Variable Value Rewards (Savings)

**Field**: `task.variableValue`
**File**: `website/common/script/ops/scoreTask.js`
**Modal**: `website/client/src/components/tasks/savingsAmountModal.vue`
**Mixin**: `website/client/src/mixins/scoreTask.js` → `getSavingsAmount()`
**Store action**: `website/client/src/store/actions/tasks.js` → `score` (accepts `amount` param)

Allows reward tasks to prompt for a custom GP cost at scoring time. When `task.variableValue` is true, the client shows a modal asking how much to deposit. The entered amount is passed as `req.body.amount` to `scoreTask` on the server.

Each deposit pushes `{ date: Number(new Date()), amount }` to `task.history` for auditing. Weekly totals are calculated client-side by filtering history entries since the most recent Sunday midnight.

## 4. Deposit History & Weekly Savings Display

**History**: `task.history` on reward tasks (`RewardSchema` includes `history: Array`)
**Header display**: `website/client/src/components/header/menu.vue` → `weeklySavings` computed
**Icon**: 💎 emoji with `.savings-ruby` CSS class — colored via `filter: hue-rotate(150deg) saturate(7) brightness(0.8)`

Weekly savings total (GP deposited since last Sunday) is shown inline to the right of GP in the top nav bar, with a green coin icon.

## 5. Admin Mode Banner

**Getter**: `website/client/src/store/getters/user.js` → `isUserAdmin`
**Banner**: `website/client/src/app.vue`

A full-width red banner appears at the top of the app when running in admin mode. Admin detection is device/browser-based (not user-specific). The banner shows the logged-in user's display name.

## 6. Habit Button Hiding

Habits without a positive or negative direction hide the corresponding +/− button.

## 7. Priority Difficulty Stars

**File**: `website/client/src/components/tasks/task.vue`
**Icon**: `difficulty-trivial.svg` (repeated 1–4 times)

Each task card shows 1–4 stars in the footer (left-aligned, vertically aligned with streak icons) indicating difficulty. Reward tasks are excluded. Color: `#DD9C3B`.

| Priority | Stars |
|---|---|
| Trivial (0.1) | 1 |
| Easy (1) | 2 |
| Medium (1.5) | 3 |
| Hard (2) | 4 |

## 8. Sale Value on Rewards

**Field**: `task.saleValue` (Number, nullable, defaults to undefined)
**Schema**: `website/server/models/task.js`, `website/common/script/libs/taskDefaults.js`
**Scoring logic**: `website/common/script/ops/scoreTask.js`
**UI**: `website/client/src/components/tasks/task.vue`

When `task.saleValue` is set on a reward, it overrides `task.value` as the GP cost for both the afford check and the deduction. If absent, cost is calculated as normal. `variableValue` takes precedence over `saleValue` if both are set.

UI indicators on sale cards:
- Original price shown with strikethrough in small gray text above the sale price
- Sale price shown in green (`#24CC8F`) with a pulsing glow animation
- A `✦` spark (yellow, `#FFD700`, dark outline) positioned in the top-right corner of the card — position, animation duration, and start offset are all seeded from `task._id` so multiple sale items animate out of phase
- Card background tinted light cyan (`#F0FEFE`) via `.task.on-sale .task-content`

Set per-task via MongoDB or the task edit form.

## 9. Copper Points (CP) — Parallel Currency

**Branch**: `copper-points-addition`
**Schema**: `website/server/models/user/schema.js` → `stats.cp: { $type: Number, default: 0, min: 0 }`
**Scoring**: `website/common/script/ops/scoreTask.js` → `_addPoints` — CP increments by the same fixed amount as GP on every non-reward task score
**updateStats**: `website/common/script/fns/updateStats.js` — applies `stats.cp` back to `user.stats.cp`
**Icon**: `website/client/src/assets/svg/copper.svg` — same structure as `gold.svg` recolored to bronze/copper (`#CD7F32` fill, `#7A3F10` accent), with the center letter changed from H to C

### Currency split

| What | Currency |
|---|---|
| Custom reward tasks (`type: 'reward'`) | GP only (unchanged) |
| Market gear, Armoire, health potion, gold-value quests | CP (was GP) |
| Gems, hourglasses, gem-bought items | Unchanged |

### Buy op changes

All four ops that previously extended `AbstractGoldItemOperation` now extend `AbstractCopperItemOperation`:
- `buyMarketGear.js`, `buyArmoire.js`, `buyHealthPotion.js`, `buyQuestGold.js`

`AbstractCopperItemOperation` is defined in `abstractBuyOperation.js` alongside the existing Gold/Gem/Hourglass classes. It checks and deducts `user.stats.cp`, throws `messageNotEnoughCopper` on insufficient balance.

### Content/shop currency

`website/common/script/libs/getItemInfo.js` — cases `marketGear`, `potion`, `armoire`, and quests with `goldValue` now return `currency: 'copper'`.
`website/common/script/libs/shops.js` — repurchaseable gear also uses `currency: 'copper'`.

### Frontend

- **Header** (`menu.vue`): Gems → GP → CP → Savings. CP shown with copper icon.
- **Stats page** (`userMenu/stats.vue`): CP listed below GP.
- **Shop modals** (`buyModal.vue`, `buyQuestModal.vue`, `balanceInfo.vue`, `itemCost.vue`): copper icon + `copper` CSS class added; `_currencyMixin.js` handles `enoughCurrency('copper', amount)` via `user.stats.cp`.
- **Floating notifications** (`notifications.vue` + `snackbars/notification.vue`): GP and CP changes are buffered with `$nextTick` and combined into a single `gp_cp` notification showing both icons side-by-side. Separate `cp`-only notifications also supported.

### i18n strings added

- `messages.json`: `messageNotEnoughCopper`
- `character.json`: `gainedCopper`, `lostCopper`, `notEnoughCopper`
- `tasks.json`: `copper`

## 10. Yesterdaily Modal Suppression

**File**: `website/client/src/components/notifications.vue`

The upstream yesterdaily modal (prompting the user to review incomplete dailies from yesterday) is suppressed. Cron always runs immediately without the modal step. The modal component is still present but never triggered.
