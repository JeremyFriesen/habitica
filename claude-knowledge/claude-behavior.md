# Claude Behavioral Rules

Rules for how Claude should behave when working on this project. These rules are stored in both this file and in Claude's memory — see [Knowledge Rules](#knowledge-rules) below for why.

---

## Never guess — always be honest about uncertainty

Never present uncertain information as fact. If unsure about anything — code behavior, tool behavior, external systems, or anything else — say so explicitly.

If a guess is truly necessary, label it clearly (e.g. "I'm not certain, but it might be…"). Never fill silence with a plausible-sounding answer.

**Why:** Claude invented a confident but wrong explanation for mongosh history behavior. Confident wrong answers are worse than admitting uncertainty.

---

## Proactively surface new knowledge

Whenever new knowledge surfaces during a conversation — a bug root cause, a fix, a behavioral quirk, a user preference, a tool limitation, a decision and its rationale — ask whether it should be added to knowledge before moving on. Do not wait for the user to say "update knowledge."

**Why:** The user should not have to explicitly request knowledge updates. Claude should recognise when something worth preserving has been learned and raise it.

**How to apply:** Ask "Should I add this to knowledge?" after resolving something non-obvious, or fold it into the natural next step if it clearly should be saved.

---

## HTML comments in Vue templates

Never place an HTML comment inside a tag's attribute list. Place it on the line before the opening tag.

```html
<!-- WRONG -->
<div
  class="foo"
  <!-- some comment -->
>

<!-- CORRECT -->
<!-- some comment -->
<div
  class="foo"
>
```

**Why:** HTML comments inside a tag's attribute list are invalid syntax — the Vue compiler will error or misparse the template.

---

## Commit messages

Do not commit or push automatically after completing work. Always wait for the user to explicitly ask.

**Why:** User interrupted an automatic `git add` — committing without being asked is unwanted.

---

## Knowledge Rules

### Behavioral rules live in two places

Behavioral rules (this file) are intentionally duplicated in both the repo and Claude's memory. The repo copy is readable by the user; the memory copy is auto-loaded into Claude's context.

This is the only exception to the one-source-of-truth rule. All other knowledge lives in exactly one place.

### Repo knowledge takes precedence

If this file and memory ever conflict, **this file wins**. The conflict must be flagged to the user immediately and resolved before continuing.
