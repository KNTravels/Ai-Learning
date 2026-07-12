/* =========================================================================
   Revision Guide — common/app.js
   Shared by all three guides (/index.html AI, /devops/index.html,
   /release/index.html) via <script src="../common/app.js">. This is the
   ONE place behavior lives -- fix a bug or add a feature here once and every
   page picks it up, instead of hunting down per-page copies. Each page
   folder only carries what's actually page-specific: its own index.html and
   its own topics.json/topics-data.js (window.TOPICS_DATA). Vanilla ES6, no
   frameworks/libraries.
   ========================================================================= */

"use strict";

/* ----------------------------- Configuration ----------------------------- */

/** Experience levels shown as per-topic tabs, in display order. `id` must
 *  match the keys used inside each topic's `summary` / `details` / `deepDive`
 *  objects in topics.json -- these ids are fixed per page's data files.
 *  `tag` is the short label shown on each topic's level tab.
 *
 *  Two ways a page can customize this, set in a <script> block BEFORE
 *  common/app.js loads:
 *  1) Relabel only (keep the default 4 ids junior/senior/architect/leadership):
 *     `window.EXPERIENCE_LEVEL_TAGS = { junior: "...", senior: "...", ... }`
 *     (see genomics/index.html, which relabels these as Research Associate /
 *     Scientist / Principal Scientist / Fellow).
 *  2) Replace the whole level set (different ids and/or a different number
 *     of levels), e.g. a 2-level page:
 *     `window.EXPERIENCE_LEVELS = [{ id: "pm", tag: "PM" },
 *                                   { id: "leadership", tag: "Leadership" }];`
 *     (see pm/index.html). The topic data file's summary/details/deepDive
 *     keys must match these ids (pm/leadership here), not just the tags.
 *  Pages that set neither keep the default Engineer / Staff / Architect /
 *  Leadership 4-level set. */
const DEFAULT_EXPERIENCE_LEVEL_TAGS = {
  junior: "Engineer",
  senior: "Staff",
  architect: "Architect",
  leadership: "Leadership",
};

const EXPERIENCE_LEVEL_TAGS = {
  ...DEFAULT_EXPERIENCE_LEVEL_TAGS,
  ...(window.EXPERIENCE_LEVEL_TAGS || {}),
};

const DEFAULT_EXPERIENCE_LEVELS = [
  { id: "junior", tag: EXPERIENCE_LEVEL_TAGS.junior },
  { id: "senior", tag: EXPERIENCE_LEVEL_TAGS.senior },
  { id: "architect", tag: EXPERIENCE_LEVEL_TAGS.architect },
  { id: "leadership", tag: EXPERIENCE_LEVEL_TAGS.leadership },
];

const EXPERIENCE_LEVELS =
  Array.isArray(window.EXPERIENCE_LEVELS) && window.EXPERIENCE_LEVELS.length
    ? window.EXPERIENCE_LEVELS
    : DEFAULT_EXPERIENCE_LEVELS;

const DEFAULT_LEVEL = EXPERIENCE_LEVELS[0].id;

/** Display labels and preferred display order for known category ids (the
 *  `category` field on each topic in topics.json/topics-data.js). A topic
 *  with a category id not listed here still renders fine -- see
 *  `categoryLabel()` -- so a new category only ever requires a data-file
 *  edit, matching how new topics themselves work.
 *
 *  This one shared app.js file powers all three pages (each loads its own
 *  topics-data.js), so it lists every page's category ids -- a given page's
 *  computeCategoryList() only ever surfaces the categories actually present
 *  in that page's own topics, so entries for other pages are simply unused,
 *  not wrong. */
const CATEGORY_LABELS = {
  // AI Developer Revision Guide (/index.html)
  "llm-fundamentals": "LLM Fundamentals",
  "vector-databases": "Vector Databases",
  "core-concepts": "Core Concepts",
  "agent-frameworks": "Agent Frameworks",
  "prompting-techniques": "Prompting Techniques",
  "orchestration-patterns": "Orchestration Patterns",
  "context-memory": "Context & Memory",
  "tools-integration": "Tools & Integration",
  "governance-control": "Governance & Control",
  "responsible-ai": "Responsible AI",
  // DevOps Revision Guide (/devops/index.html)
  "containers-orchestration": "Containers & Orchestration",
  "cicd": "CI/CD",
  "observability": "Observability",
  // Release Management Revision Guide (/release/index.html)
  "core-release-management": "Core Release Management",
  "versioning": "Versioning",
  "deployment-strategies": "Deployment Strategies",
  "risk-rollback": "Risk & Rollback",
  "monitoring-after-release": "Monitoring After Release",
  "branching-strategies": "Branching Strategies",
  "devops-tools": "DevOps Tools",
  "release-process": "Release Process",
  // Genomics Revision Guide (/genomics/index.html)
  "genome-assembly": "Genome Assembly",
  "transcriptomics": "Transcriptomics",
  "ngs-data-analysis": "NGS Data Analysis",
  // PM Revision Guide (/pm/index.html)
  "agile-at-scale": "Agile at Scale (SAFe)",
  "vendor-sourcing": "Vendor Sourcing (RFP/RFQ)",
  "pricing-models": "Pricing Models",
  "cloud-architecture": "Cloud Architecture (Azure)",
  "devops-delivery": "DevOps & Delivery",
  "project-lifecycle": "Project Lifecycle",
  "leadership-people": "Leadership & People Management",
  "governance": "Governance",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

const UNCATEGORIZED_ID = "uncategorized";

/** Section labels that appear inline inside each `details` write-up.
 *  These are bolded when rendered so the deep-dive reads as structured
 *  documentation rather than a wall of text. */
const DETAIL_SECTION_LABELS = [
  "Architecture overview:",
  "Process flow:",
  "Best practices:",
  "Common mistakes:",
  "Real-world implementation:",
  "Interview questions:",
  // PM Revision Guide (/pm/index.html) -- source material is table/Q&A
  // heavy (Advantages/Disadvantages columns, STAR answers), so these
  // labels are bolded to keep that structure legible as plain paragraphs.
  "Purpose:",
  "Benefits:",
  "Advantages:",
  "Disadvantages:",
  "When to use:",
  "Situation:",
  "Task:",
  "Action:",
  "Result:",
];

/** Small inline SVG icons -- kept as plain strings so the app stays
 *  dependency-free (no icon font / icon library). */
const ICONS = {
  details:
    '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>',
  deepDive:
    '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 11-12h-7l1-8z"/></svg>',
};

/* -------------------------------- App state -------------------------------- */

const state = {
  topics: [],
  categories: [], // [{ id, label }], derived from the loaded topics -- see computeCategoryList()
  categoryFilter: "", // "" = all categories; otherwise a category id to filter the list to
  searchQuery: "", // "" = no filter; otherwise a lowercased substring matched against title/keywords/summary
  baseLevel: DEFAULT_LEVEL, // the page-wide level filter; applied to every topic when changed (see applyBaseLevel())
};

/* -------------------------------- DOM refs -------------------------------- */

const dom = {
  loadingMessage: document.getElementById("loading-message"),
  emptyState: document.getElementById("empty-state"),
  topicList: document.getElementById("topic-list"),
  categorySelect: document.getElementById("category-select"),
  levelSelect: document.getElementById("level-select"),
  searchInput: document.getElementById("search-input"),
  printBtn: document.getElementById("print-btn"),
  appVersion: document.getElementById("app-version"),
  modalOverlay: document.getElementById("modal-overlay"),
  modal: document.getElementById("modal"),
  modalLevelBadge: document.getElementById("modal-level-badge"),
  modalTitleText: document.getElementById("modal-title-text"),
  modalBody: document.getElementById("modal-body"),
  modalCloseBtn: document.getElementById("modal-close"),
};

/* --------------------------------- Helpers --------------------------------- */

/** Escapes text for safe insertion via innerHTML. */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Wraps a curated list of highlight phrases (exact substrings picked out of
 *  that topic's own details/deepDive text) in <mark> so the standout keyword
 *  or sentence gets a highlighter-style treatment in the Additional Details
 *  / Deep Dive modals. `html` is expected to already be escaped (and may
 *  already contain <strong> tags from formatDetailParagraph); each phrase is
 *  escaped the same way before matching so it lines up with the escaped
 *  text. An empty/missing highlights list is a no-op. */
function applyHighlights(html, highlights) {
  if (!Array.isArray(highlights) || highlights.length === 0) return html;
  let result = html;
  highlights.forEach((phrase) => {
    const escapedPhrase = escapeHtml(phrase);
    if (!escapedPhrase) return;
    result = result.split(escapedPhrase).join(`<mark>${escapedPhrase}</mark>`);
  });
  return result;
}

/** Returns the curated highlight phrases for one experience level of a
 *  topic. `topic.highlights` is an object keyed by level id (e.g.
 *  `{ junior: [...], senior: [...], architect: [...], leadership: [...] }`,
 *  or `{ pm: [...], leadership: [...] }` for the PM guide) rather than one
 *  flat list, so switching level tabs shows that level's own highlighted
 *  phrases instead of always the same ones. Topics/guides that don't define
 *  `highlights`, or don't have an entry for this specific level, get an
 *  empty array -- applyHighlights() treats that as a no-op, which is why
 *  guides that haven't been curated yet render unchanged. */
function levelHighlights(topic, levelId) {
  return (topic.highlights && topic.highlights[levelId]) || [];
}

/** Wraps known section labels (e.g. "Best practices:") in <strong> so the
 *  deep-dive text reads as structured documentation, then applies the
 *  topic's `highlights` (see applyHighlights()). Input is escaped first, so
 *  this is safe even though it builds HTML. */
function formatDetailParagraph(paragraph, highlights) {
  let html = escapeHtml(paragraph);
  DETAIL_SECTION_LABELS.forEach((label) => {
    html = html.split(label).join(`<strong>${label}</strong>`);
  });
  html = applyHighlights(html, highlights);
  return html;
}

/** Zero-pads a topic's position for the "TOPIC 01" style label. */
function topicNumber(index) {
  return String(index + 1).padStart(2, "0");
}

/** Uppercased tab label (e.g. "STAFF", "LEADERSHIP") for an experience level
 *  id, shown as a badge in the modal so it's clear which level's content is
 *  being read. Falls back to the id itself if it's ever unrecognized. */
function levelTag(levelId) {
  const level = EXPERIENCE_LEVELS.find((l) => l.id === levelId);
  return (level ? level.tag : levelId).toUpperCase();
}

const MAX_IMPORTANCE = 5;

/** Raw "★★★★☆" string for a 0-MAX_IMPORTANCE rating, clamped and rounded.
 *  Color comes from CSS on a wrapping element -- see .topic-importance. */
function starString(rating) {
  const filled = Math.max(0, Math.min(MAX_IMPORTANCE, Math.round(rating || 0)));
  return "★".repeat(filled) + "☆".repeat(MAX_IMPORTANCE - filled);
}

/** Renders a topic's `importance` (1-5) as filled/empty star characters,
 *  with a title tooltip and an aria-label for screen readers. Falls back to
 *  0 filled stars for topics with no importance field set. */
function renderImportanceStars(importance) {
  const filled = Math.max(0, Math.min(MAX_IMPORTANCE, importance || 0));
  return `
    <span class="topic-importance" title="Importance: ${filled}/${MAX_IMPORTANCE}" aria-label="Importance: ${filled} out of ${MAX_IMPORTANCE} stars">
      ${starString(importance)}
    </span>
  `;
}

/** DOM anchor id for a category's section heading in the topic list. */
function categoryAnchorId(categoryId) {
  return `category-${categoryId}`;
}

/** Display label for a category id -- known ids use CATEGORY_LABELS; any
 *  other id (e.g. a newly added one not yet listed there) falls back to a
 *  title-cased version of the slug so it still renders sensibly. */
function categoryLabel(categoryId) {
  if (CATEGORY_LABELS[categoryId]) return CATEGORY_LABELS[categoryId];
  return categoryId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Distinct category ids actually present in the loaded topics, in
 *  CATEGORY_ORDER first, then any unrecognized ids in first-seen order. */
function computeCategoryList(topics) {
  const seen = new Set();
  const orderedIds = [];

  CATEGORY_ORDER.forEach((id) => {
    if (topics.some((topic) => topic.category === id)) {
      orderedIds.push(id);
      seen.add(id);
    }
  });

  topics.forEach((topic) => {
    const id = topic.category || UNCATEGORIZED_ID;
    if (!seen.has(id)) {
      orderedIds.push(id);
      seen.add(id);
    }
  });

  return orderedIds.map((id) => ({ id, label: categoryLabel(id) }));
}

/** Whether a topic matches a lowercased search query: checked against the
 *  title, keywords, and every experience level's summary text. Returns true
 *  for an empty query so "no search" shows everything. */
function topicMatchesSearch(topic, query) {
  if (!query) return true;
  const haystacks = [
    topic.title || "",
    ...(topic.keywords || []),
    ...EXPERIENCE_LEVELS.map((level) => (topic.summary && topic.summary[level.id]) || ""),
  ];
  return haystacks.some((text) => text.toLowerCase().includes(query));
}

/* ------------------------------- Data loading ------------------------------- */

/** Topic content is provided by this page's own *-topics-data.js file
 *  (loaded via a plain <script> tag before this file) rather than
 *  fetch("topics.json"). Browsers block fetch()/XHR of local files under
 *  the file:// protocol, but a <script src> include works even when the
 *  page is opened by double-clicking it with no web server running. */
function loadTopics() {
  if (!Array.isArray(window.TOPICS_DATA)) {
    throw new Error("TOPICS_DATA was not found -- make sure this page's topics-data script is loaded before app.js.");
  }
  return window.TOPICS_DATA;
}

/* --------------------------------- Rendering --------------------------------- */

/** Populates the category filter <select> from state.categories, with an
 *  "All Categories" option first and the rest sorted alphabetically (A-Z) by
 *  label for quick scanning -- a separate sort on a copy, so it doesn't
 *  disturb state.categories' curated order, which still governs the section
 *  order of the topic list itself. */
function renderCategorySelect() {
  const sortedCategories = [...state.categories].sort((a, b) => a.label.localeCompare(b.label));

  const allOption = `<option value="">All Categories</option>`;
  const categoryOptions = sortedCategories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.label)}</option>`)
    .join("");

  dom.categorySelect.innerHTML = allOption + categoryOptions;
  dom.categorySelect.value = state.categoryFilter;
}

/** Populates the page-wide level filter <select> from EXPERIENCE_LEVELS
 *  (Engineer/Staff/Architect/Leadership). Unlike the category filter, this
 *  has no "All" option -- it's a base level every topic starts at, not an
 *  optional narrowing filter. */
function renderLevelSelect() {
  dom.levelSelect.innerHTML = EXPERIENCE_LEVELS
    .map((level) => `<option value="${level.id}">${escapeHtml(level.tag)}</option>`)
    .join("");
  dom.levelSelect.value = state.baseLevel;
}

/** Applies the page-wide base level to every loaded topic, overriding any
 *  per-topic level tab selection each topic previously had. Topics still
 *  remain individually switchable afterward via their own level tabs -- this
 *  only resets the starting point for all of them at once. */
function applyBaseLevel(levelId) {
  state.baseLevel = levelId;
  state.topics.forEach((topic) => {
    topic.selectedLevel = levelId;
  });
  renderTopicList();
}

/** Renders the "Additional Details" panel content for a topic at the
 *  current level: the deep-dive write-up, illustrative images, and
 *  references. */
function renderDetailsPanelContent(topic) {
  const level = topic.selectedLevel || DEFAULT_LEVEL;
  const detailsText = (topic.details && topic.details[level]) || "";
  const paragraphs = detailsText.split(/\n\n+/).filter(Boolean);
  const bodyHtml = paragraphs.map((p) => `<p>${formatDetailParagraph(p, levelHighlights(topic, level))}</p>`).join("");

  const imagesHtml = (topic.images || [])
    .map(
      (image) => `
        <figure>
          <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.caption || "")}" loading="lazy" />
          <figcaption>${escapeHtml(image.caption || "")}</figcaption>
        </figure>
      `
    )
    .join("");

  const referencesHtml = (topic.references || [])
    .map(
      (ref) => `
        <li><a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ref.title)}</a></li>
      `
    )
    .join("");

  return `
    ${bodyHtml}
    <div class="panel-section panel-images">${imagesHtml}</div>
    <div class="panel-section">
      <h3>References</h3>
      <ul class="panel-references">${referencesHtml}</ul>
    </div>
  `;
}

/** Renders the "Deep Dive" panel content for a topic at the current level:
 *  a short, code-context-focused explanation plus one illustrative snippet. */
function renderDeepDivePanelContent(topic) {
  const level = topic.selectedLevel || DEFAULT_LEVEL;
  const explanation = (topic.deepDive && topic.deepDive[level]) || "";
  const code = topic.deepDiveCode;

  const codeHtml = code
    ? `
      <pre class="code-block"><code>${escapeHtml(code.snippet)}</code></pre>
      <p class="code-caption">${escapeHtml(code.caption || "")}</p>
    `
    : "";

  return `
    <p>${applyHighlights(escapeHtml(explanation), levelHighlights(topic, level))}</p>
    ${codeHtml}
  `;
}

/** Number of distinct pill colors defined for .modal-level-badge--0..3 in
 *  styles.css. Levels beyond this count wrap back to color 0 rather than
 *  needing a new CSS rule for every possible EXPERIENCE_LEVELS length. */
const LEVEL_BADGE_COLOR_COUNT = 4;

/** Opens the shared modal dialog with a title, the level it was opened at
 *  (so switching tabs then reopening never leaves stale content looking like
 *  it belongs to the wrong level), and pre-rendered body HTML. `variant`
 *  ("details" | "deepdive") tints the modal's top accent border to match the
 *  same color coding used elsewhere in the app. `levelId` drives both the
 *  badge text (via levelTag()) and its pill color, keyed off the level's
 *  position in EXPERIENCE_LEVELS -- this badge is the only place the
 *  stamp-style pill look is used; the main page's level tabs are untouched. */
function openModal(title, levelId, bodyHtml, variant) {
  dom.modal.className = `modal modal--${variant}`;
  const levelIndex = EXPERIENCE_LEVELS.findIndex((l) => l.id === levelId);
  const colorIndex = levelIndex >= 0 ? levelIndex % LEVEL_BADGE_COLOR_COUNT : 0;
  dom.modalLevelBadge.className = `modal-level-badge modal-level-badge--${colorIndex}`;
  dom.modalLevelBadge.textContent = levelTag(levelId);
  dom.modalTitleText.textContent = title;
  dom.modalBody.innerHTML = bodyHtml;
  dom.modalOverlay.hidden = false;
  document.body.classList.add("modal-open");
  dom.modalCloseBtn.focus();
}

/** Closes the shared modal and clears its content so images/code blocks
 *  don't stay alive in the DOM while hidden. */
function closeModal() {
  dom.modalOverlay.hidden = true;
  dom.modalBody.innerHTML = "";
  document.body.classList.remove("modal-open");
}

/** Renders a single topic as a plain documentation-style section: numbered
 *  label, title, per-topic ENGINEER/STAFF/ARCHITECT level tabs, the
 *  level-specific summary, and two inline expand links. No cards, no grids. */
function renderTopicEntry(topic, index) {
  // Each topic remembers its own selected level across re-renders, so
  // switching one topic's level tab never affects any other topic.
  topic.selectedLevel = topic.selectedLevel || DEFAULT_LEVEL;

  const article = document.createElement("article");
  article.className = "topic-entry";
  article.id = `topic-${topic.id}`;

  const summaryText = (topic.summary && topic.summary[topic.selectedLevel]) || "";
  const keywordsHtml = (topic.keywords || [])
    .map((keyword) => `<span class="keyword-tag">${escapeHtml(keyword)}</span>`)
    .join("");

  const levelTabsHtml = EXPERIENCE_LEVELS.map((level) => `
    <button type="button" class="level-tab ${level.id === topic.selectedLevel ? "is-active" : ""}"
            data-level="${level.id}" aria-pressed="${level.id === topic.selectedLevel}">
      ${escapeHtml(level.tag)}
    </button>
  `).join("");

  article.innerHTML = `
    <p class="topic-number">Topic ${topicNumber(index)}</p>
    <div class="topic-heading-row">
      <h2 class="topic-title">${escapeHtml(topic.title)}</h2>
      <span class="topic-category-tag">${escapeHtml(categoryLabel(topic.category || UNCATEGORIZED_ID))}</span>
    </div>
    <div class="level-tabs-row">
      <div class="level-tabs" role="tablist" aria-label="Experience level">${levelTabsHtml}</div>
      ${renderImportanceStars(topic.importance)}
    </div>
    <p class="topic-summary">${escapeHtml(summaryText)}</p>
    <div class="topic-keywords no-print">${keywordsHtml}</div>
    <div class="topic-links">
      <button class="link-toggle" type="button" data-action="open-details" aria-haspopup="dialog">
        ${ICONS.details} Additional Details
      </button>
      <button class="link-toggle" type="button" data-action="open-deepdive" aria-haspopup="dialog">
        ${ICONS.deepDive} Deep Dive
      </button>
    </div>
  `;

  article.querySelectorAll(".level-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      topic.selectedLevel = btn.dataset.level;
      renderTopicList();
    });
  });

  article.querySelector('[data-action="open-details"]').addEventListener("click", () => {
    openModal(`Additional Details — ${topic.title}`, topic.selectedLevel, renderDetailsPanelContent(topic), "details");
  });

  article.querySelector('[data-action="open-deepdive"]').addEventListener("click", () => {
    openModal(`Deep Dive — ${topic.title}`, topic.selectedLevel, renderDeepDivePanelContent(topic), "deepdive");
  });

  return article;
}

/** Re-renders the full topic list based on the current category filter and
 *  search query. Topics are grouped into <section> blocks per category (in
 *  state.categories order), each with a heading; a category with no
 *  currently-visible topics is skipped entirely. */
function renderTopicList() {
  const visibleTopics = state.topics.filter(
    (topic) =>
      (!state.categoryFilter || (topic.category || UNCATEGORIZED_ID) === state.categoryFilter) &&
      topicMatchesSearch(topic, state.searchQuery)
  );

  dom.topicList.innerHTML = "";

  let renderedCount = 0;
  state.categories.forEach((category) => {
    const topicsInCategory = visibleTopics.filter(
      (topic) => (topic.category || UNCATEGORIZED_ID) === category.id
    );
    if (topicsInCategory.length === 0) return;

    const section = document.createElement("section");
    section.className = "category-section";
    section.id = categoryAnchorId(category.id);

    const heading = document.createElement("h2");
    heading.className = "category-heading";
    heading.textContent = category.label;
    section.appendChild(heading);

    topicsInCategory.forEach((topic) => {
      section.appendChild(renderTopicEntry(topic, renderedCount));
      renderedCount += 1;
    });

    dom.topicList.appendChild(section);
  });

  dom.emptyState.hidden = renderedCount !== 0;
}

/* ------------------------------- Event wiring ------------------------------- */

function wireEventListeners() {
  dom.categorySelect.addEventListener("change", (event) => {
    state.categoryFilter = event.target.value;
    renderTopicList();
  });

  dom.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim().toLowerCase();
    renderTopicList();
  });

  dom.levelSelect.addEventListener("change", (event) => {
    applyBaseLevel(event.target.value);
  });

  dom.printBtn.addEventListener("click", () => {
    window.print();
  });

  dom.modalCloseBtn.addEventListener("click", closeModal);

  // Clicking the dimmed backdrop (not the modal card itself) closes it.
  dom.modalOverlay.addEventListener("click", (event) => {
    if (event.target === dom.modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.modalOverlay.hidden) closeModal();
  });
}

/* -------------------------------- Version -------------------------------- */

/** window.APP_VERSION is set by version-data.js, which the CI/CD pipeline
 *  regenerates on every deploy (commit SHA + build date). Locally it stays
 *  the committed placeholder, same "no fetch" pattern as topics-data.js so
 *  double-clicking index.html still works offline. */
function renderVersion() {
  if (!dom.appVersion) return;
  const v = window.APP_VERSION;
  dom.appVersion.textContent = v
    ? `${v.version} (${v.commit}) — ${v.buildDate}`
    : "dev";
}

/* ---------------------------------- Init ---------------------------------- */

async function init() {
  wireEventListeners();
  renderVersion();

  try {
    state.topics = loadTopics();
    state.categories = computeCategoryList(state.topics);
    renderCategorySelect();
    renderLevelSelect();
    dom.loadingMessage.hidden = true;
    renderTopicList();
  } catch (error) {
    dom.loadingMessage.textContent =
      "Could not load topic data. Make sure this page's topics-data script is present alongside it.";
    console.error(error);
  }
}

init();
