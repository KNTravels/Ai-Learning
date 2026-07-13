# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, offline-first revision-guide site ("AI Developer Revision Guide" and siblings) with five tabs/guides, each a self-contained topic list with per-experience-level content (Engineer/Staff/Architect/Leadership by default):

- `/index.html` — AI (root guide)
- `/devops/index.html` — DevOps
- `/genomics/index.html` — Genomics (relabels levels to Research Associate/Scientist/Principal Scientist/Fellow)
- `/pm/index.html` — PM (only two levels: PM/Leadership)
- `/release/index.html` — Release Management

There is no build step, no bundler, no package.json, and no test suite. It's vanilla HTML/CSS/ES6, deployed as-is.

## Running / developing locally

Just open any `index.html` directly in a browser (double-click works — no server needed). This is a deliberate constraint: topic data ships as `topics-data.js` (a `<script src>`-loaded `window.TOPICS_DATA = [...]` assignment) instead of being `fetch()`-ed from `topics.json`, because browsers block `fetch()` of local files under `file://`. If you want a server anyway (e.g. to test something server-relative), any static file server pointed at the repo root works — there's no dev-server command defined in this repo.

There are no lint/build/test commands — none are configured.

## Deployment

GitHub Pages via `.github/workflows/deploy-pages.yml`, triggered on push to `main`. The workflow just copies `index.html topics-data.js topics.json common devops genomics images pm release` into `_site/` and deploys — no compilation, no regeneration of any file. Custom domain is set via `CNAME` (`ai.onevedai.com`).

**Gotcha:** `common/version-data.js`'s header comment claims it's "regenerated on every CI/CD deploy" with real commit SHA/build date — but no such regeneration step actually exists in `deploy-pages.yml` (it references a nonexistent `ai-learning-deploy.yml`). In practice the committed placeholder (`version: "dev"`, `commit: "local"`, `buildDate: "unknown"`) is what ships to production too, so the "Build ..." line in each page's footer always shows placeholder values live.

## Architecture

### One shared app, N data files

`common/app.js` and `common/styles.css` are loaded by every tab's `index.html` and contain 100% of the behavior/styling — there are no per-tab copies of logic. Each tab folder only carries what's actually page-specific: its own `index.html`, `topics.json`, and `topics-data.js`. **Fix a bug or add a feature in `common/app.js`/`common/styles.css` once and every tab picks it up.**

`topics.json` and `topics-data.js` hold identical content — `topics-data.js` just wraps the same array as `window.TOPICS_DATA = [...]` with a header comment, for the `file://` reason above. **When editing topic data, keep both files byte-identical (as parsed JSON)** — treat `topics.json` as the source of truth and mirror it into `topics-data.js`'s wrapper, preserving that file's existing header comment block.

### Per-page experience-level customization

`common/app.js` reads `window.EXPERIENCE_LEVELS` / `window.EXPERIENCE_LEVEL_TAGS`, which a page's `index.html` can set in an inline `<script>` **before** `common/app.js` loads:
- Default (no override): 4 levels, ids `junior`/`senior`/`architect`/`leadership`, tagged Engineer/Staff/Architect/Leadership.
- Relabel only (genomics): set `window.EXPERIENCE_LEVEL_TAGS` to rename the tags while keeping the same 4 ids.
- Replace entirely (pm): set `window.EXPERIENCE_LEVELS` to a different id/tag list (pm uses just `pm`/`leadership`).

Whatever ids are in play, a topic's `summary`/`details`/`deepDive`/`highlights` objects in that page's `topics.json` **must be keyed by those same ids** — the ids are fixed per data file, not universal across tabs.

### Topic object schema (topics.json)

Each topic: `id`, `title`, `category`, `importance` (1-5, star rating), `keywords[]`, `summary{level}`, `details{level}`, `deepDive{level}`, `deepDiveCode` ({language, caption, snippet}, one per topic, not per level), `images[]` ({url, caption}, optional), `references[]` ({title, url}), `highlights{level}` (array of exact-substring strings, optional).

- `summary[level]` — short text shown inline in the topic list.
- `details[level]` + `deepDive[level]` — longer write-ups; `details` opens in the "Additional Details" modal (deep-dive prose, images, references) and `deepDive` opens in a separate "Deep Dive" modal (code-context explanation + one code snippet). Paragraphs are split on blank lines (`\n\n`); some guides (PM) use single `\n` within a paragraph for list-like layout via `white-space: pre-line`.
- `highlights[level]` — curated phrases that must be **exact, verbatim substrings** of that same level's `details`/`deepDive` text (checked via plain string matching in `applyHighlights()`, not fuzzy). A phrase that doesn't match verbatim silently renders as if it wasn't added — always verify highlight phrases actually appear in the source text after editing either. Target density (established convention across tabs): roughly 8-12% of the combined `details`+`deepDive` text per level, with every topic having at least one highlight per level.
- `category` — free-form id; a category not listed in `CATEGORY_LABELS` in `app.js` still works fine (falls back to a title-cased version of the id), so adding a new category never requires an app.js change, only data.

### Additional Details also renders for print

Each topic entry renders its "Additional Details" content twice: once lazily inside the shared modal (opened via the "Additional Details" button, for on-screen reading), and once inline in a `.topic-print-details` block that's `display:none` on screen but shown by `@media print` — so printing/saving-as-PDF includes full details by default rather than just the summary. Both copies come from the same `renderDetailsPanelContent()` call. Because `.topic-print-details` exists in the DOM for every topic from page load (not just the one a user opens), its `<img>` tags intentionally do **not** use `loading="lazy"` (unlike a lazy image would never fetch while `display:none`, breaking print).

Highlight `<mark>` backgrounds need `print-color-adjust: exact` (`-webkit-print-color-adjust: exact`) to survive printing — browsers drop background colors during print by default unless told otherwise.

### Rendering model

No client-side router, no framework. `renderTopicList()` re-renders the full list on every filter/search/level change, grouped into `<section>` blocks per category (order driven by `computeCategoryList()`, which prioritizes the shared `CATEGORY_ORDER` list in `app.js` then appends any others in first-seen order). Each topic (`renderTopicEntry()`) keeps its own `selectedLevel` across re-renders, independent of other topics; a page-wide level `<select>` (`applyBaseLevel()`) resets every topic's level at once but individual per-topic level tabs still work afterward.

Search (`topicMatchesSearch()`) matches title, keywords, and every level's summary text — case-insensitive substring match, not fuzzy.
