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

**Field**: `task.criticalityChance`
**Schema**: `website/server/models/task.js`
**Scoring logic**: `website/common/script/ops/scoreTask.js` — **currently commented out**

Dice-based GP bonus on specific tasks. The `prompt()` input cannot run on the server (see [code-patterns.md](code-patterns.md#shared-common-code)). Needs a client-side input solution before it can be re-enabled.

## 3. Variable Value Rewards

**Field**: `task.variableValue`
**File**: `website/common/script/ops/scoreTask.js` — **currently commented out**

Allows custom GP costs for reward tasks via user input. Same `prompt()` blocker as above.

## 4. Admin Mode Banner

Visible only on Steph and Jeremy's Pixel 9s. Controlled by device detection in the client.

## 5. Habit Button Hiding

Habits without a positive or negative direction hide the corresponding +/− button.
