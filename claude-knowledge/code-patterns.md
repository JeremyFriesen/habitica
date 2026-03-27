# Code Patterns & Conventions

## Mongoose Schemas

All schemas in `website/server/models/` use `typeKey: '$type'` to avoid conflicts with MongoDB's native `$type` operator.

### Nested Schema constructors must also declare typeKey

`typeKey` is NOT inherited by nested `new Schema({...})` calls. Without it, Mongoose 8 misinterprets `required: true` as a path definition (`path: "required", type: true`) and crashes on startup.

**Always pass `typeKey` in nested schema options:**
```js
// Correct
new Schema({ ... }, { _id: false, typeKey: '$type' })

// Wrong — will crash in Mongoose 8
new Schema({ ... }, { _id: false })
```

### Partial user loads

`authWithHeaders({ userFieldsToInclude: [...] })` loads the user with field projection. `user.save()` on a projected document only `$set`s modified paths — other fields are untouched. Pre-save hooks in `hooks.js` guard their logic with `this.isDirectSelected('fieldName')` to avoid running on missing data.

## Shared Common Code (`website/common/script/`)

This code runs in **both** the browser (Vue/Vite) and Node.js (Express server).

### Never use browser-only APIs here

The following will throw `ReferenceError: X is not defined` on the server:
- `prompt()`, `alert()`, `confirm()`
- `window`, `document`, `localStorage`, `sessionStorage`

**Why it's dangerous**: The frontend runs `scoreTask()` locally (optimistic update) before the API call. If the server-side call fails due to a `ReferenceError`, the UI still shows the updated value — masking the failure. The database never gets updated.

**Pattern to re-enable browser-input features** (e.g. `criticalityChance`, `variableValue`):
- Move the `prompt()` call into the client-side mixin/component
- Resolve the value there, then pass it as a parameter to the shared function
- Guard with `if (typeof window !== 'undefined')` only as a last resort

## Vue Template Comments

HTML comments (`<!-- ... -->`) must be placed **outside** of a tag — never between the opening `<tag` and its closing `>`. Putting a comment inside a tag's attribute list is invalid and will break the template.

```html
<!-- WRONG — inside the tag -->
<div
  class="foo"
  <!-- some comment -->
>

<!-- CORRECT — before the tag -->
<!-- some comment -->
<div
  class="foo"
>
```

## Module System

- Server and common: ES6 modules transpiled by Babel (`@babel/register`)
- Client: Vite with Vue 2 (not Vue 3)
- Lodash: named imports only — `import find from 'lodash/find'`, not `import _ from 'lodash'`

## Linting & Testing

See [`commands.md`](commands.md) for all lint and test commands.
