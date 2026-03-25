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
**Green coin icon**: `goldGreenIcon` computed — SVG color replaced `#FFA623`→`#24CC8F`, `#BF7D1A`→`#1CA372`

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

## 8. Yesterdaily Modal Suppression

**File**: `website/client/src/components/notifications.vue`

The upstream yesterdaily modal (prompting the user to review incomplete dailies from yesterday) is suppressed. Cron always runs immediately without the modal step. The modal component is still present but never triggered.
