/* =========================================================================
   AI Developer Revision Guide — app.js
   Vanilla ES6, no frameworks/libraries. All topic content comes from
   topics-data.js (window.TOPICS_DATA, the same content as topics.json) at
   load time; nothing topic-specific is hardcoded here so a new entry only
   ever requires editing that data file.
   ========================================================================= */

"use strict";

/* ----------------------------- Configuration ----------------------------- */

/** Experience levels shown in the dropdown, in display order.
 *  `id` must match the keys used inside each topic's `summary` / `details`
 *  / `deepDive` objects in topics.json (junior / senior / architect). */
const EXPERIENCE_LEVELS = [
  { id: "junior", years: "0–5 yrs", role: "Engineer", badge: "Engineer" },
  { id: "senior", years: "5–15 yrs", role: "Senior / Staff", badge: "Senior / Staff" },
  { id: "architect", years: "15+ yrs", role: "Architect / Principal", badge: "Architect / Principal" },
];

const DEFAULT_LEVEL = EXPERIENCE_LEVELS[0].id;

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
  level: DEFAULT_LEVEL,
  searchTerm: "",
  expandedDetails: new Set(), // topic ids with the "Additional Details" panel open
  expandedDeepDives: new Set(), // topic ids with the "Deep Dive" panel open
};

/* -------------------------------- DOM refs -------------------------------- */

const dom = {
  loadingMessage: document.getElementById("loading-message"),
  emptyState: document.getElementById("empty-state"),
  topicList: document.getElementById("topic-list"),
  searchInput: document.getElementById("search-input"),
  experienceSelect: document.getElementById("experience-select"),
  showAllDetails: document.getElementById("show-all-details"),
  showAllDeepDives: document.getElementById("show-all-deepdives"),
  printBtn: document.getElementById("print-btn"),
};

/* --------------------------------- Helpers --------------------------------- */

/** Escapes text for safe insertion via innerHTML. */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Returns the level descriptor object for a level id. */
function levelInfo(levelId) {
  return EXPERIENCE_LEVELS.find((level) => level.id === levelId) || EXPERIENCE_LEVELS[0];
}

/** Wraps known section labels (e.g. "Best practices:") in <strong> so the
 *  deep-dive text reads as structured documentation. Input is escaped first,
 *  so this is safe even though it builds HTML. */
function formatDetailParagraph(paragraph) {
  let html = escapeHtml(paragraph);
  DETAIL_SECTION_LABELS.forEach((label) => {
    html = html.split(label).join(`<strong>${label}</strong>`);
  });
  return html;
}

/** Builds the full searchable text blob for a topic: title, keywords, and
 *  every summary/details/deepDive string across all three experience levels. */
function buildSearchIndex(topic) {
  const pieces = [topic.title, ...(topic.keywords || [])];
  EXPERIENCE_LEVELS.forEach((level) => {
    pieces.push(topic.summary && topic.summary[level.id]);
    pieces.push(topic.details && topic.details[level.id]);
    pieces.push(topic.deepDive && topic.deepDive[level.id]);
  });
  return pieces.filter(Boolean).join(" \n ").toLowerCase();
}

/** True if the topic matches the current search term (title, keywords, or
 *  any level's summary/details/deepDive content). */
function topicMatchesSearch(topic, term) {
  if (!term) return true;
  if (!topic.searchIndex) topic.searchIndex = buildSearchIndex(topic);
  return topic.searchIndex.includes(term.trim().toLowerCase());
}

/** Zero-pads a topic's position for the "TOPIC 01" style label. */
function topicNumber(index) {
  return String(index + 1).padStart(2, "0");
}

/* ------------------------------- Data loading ------------------------------- */

/** Topic content is provided by topics-data.js (loaded via a plain <script>
 *  tag in index.html, before this file) rather than fetch("topics.json").
 *  Browsers block fetch()/XHR of local files under the file:// protocol, but
 *  a <script src> include works even when this page is opened by
 *  double-clicking index.html with no web server running. */
function loadTopics() {
  if (!Array.isArray(window.TOPICS_DATA)) {
    throw new Error("TOPICS_DATA was not found -- make sure topics-data.js is loaded before app.js.");
  }
  return window.TOPICS_DATA;
}

/* --------------------------------- Rendering --------------------------------- */

/** Populates the experience-level <select> from EXPERIENCE_LEVELS. */
function renderExperienceOptions() {
  dom.experienceSelect.innerHTML = EXPERIENCE_LEVELS.map(
    (level) => `<option value="${level.id}">${escapeHtml(level.years)} (${escapeHtml(level.role)})</option>`
  ).join("");
  dom.experienceSelect.value = state.level;
}

/** Renders the "Additional Details" panel content for a topic at the
 *  current level: the deep-dive write-up, illustrative images, and
 *  references. */
function renderDetailsPanelContent(topic) {
  const detailsText = (topic.details && topic.details[state.level]) || "";
  const paragraphs = detailsText.split(/\n\n+/).filter(Boolean);
  const bodyHtml = paragraphs.map((p) => `<p>${formatDetailParagraph(p)}</p>`).join("");

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
  const explanation = (topic.deepDive && topic.deepDive[state.level]) || "";
  const code = topic.deepDiveCode;

  const codeHtml = code
    ? `
      <pre class="code-block"><code>${escapeHtml(code.snippet)}</code></pre>
      <p class="code-caption">${escapeHtml(code.caption || "")}</p>
    `
    : "";

  return `
    <p>${escapeHtml(explanation)}</p>
    ${codeHtml}
  `;
}

/** Renders a single topic as a plain documentation-style section: numbered
 *  label, title + level badge, level-specific summary, and two inline
 *  expand links. No cards, no grids. */
function renderTopicEntry(topic, index) {
  const article = document.createElement("article");
  article.className = "topic-entry";
  article.id = `topic-${topic.id}`;

  const level = levelInfo(state.level);
  const summaryText = (topic.summary && topic.summary[state.level]) || "";
  const keywordsText = (topic.keywords || []).join(", ");

  const detailsOpen = state.expandedDetails.has(topic.id);
  const deepDiveOpen = state.expandedDeepDives.has(topic.id);

  article.innerHTML = `
    <p class="topic-number">Topic ${topicNumber(index)}</p>
    <div class="topic-heading-row">
      <h2 class="topic-title">${escapeHtml(topic.title)}</h2>
      <span class="level-badge">${escapeHtml(level.badge)}</span>
    </div>
    <p class="topic-summary">${escapeHtml(summaryText)}</p>
    <span class="topic-keywords no-print">${escapeHtml(keywordsText)}</span>
    <div class="topic-links">
      <button class="link-toggle" type="button" data-action="toggle-details" aria-expanded="${detailsOpen}">
        ${ICONS.details} Additional Details
      </button>
      <button class="link-toggle" type="button" data-action="toggle-deepdive" aria-expanded="${deepDiveOpen}">
        ${ICONS.deepDive} Deep Dive
      </button>
    </div>
    <div class="expand-panel details-panel" ${detailsOpen ? "" : "hidden"}></div>
    <div class="expand-panel deepdive-panel" ${deepDiveOpen ? "" : "hidden"}></div>
  `;

  const detailsPanel = article.querySelector(".details-panel");
  const deepDivePanel = article.querySelector(".deepdive-panel");

  // Only render panel HTML when open -- keeps the DOM light for the common
  // case where most topics are collapsed.
  if (detailsOpen) detailsPanel.innerHTML = renderDetailsPanelContent(topic);
  if (deepDiveOpen) deepDivePanel.innerHTML = renderDeepDivePanelContent(topic);

  article.querySelector('[data-action="toggle-details"]').addEventListener("click", () => {
    toggleSet(state.expandedDetails, topic.id);
    renderTopicList();
  });

  article.querySelector('[data-action="toggle-deepdive"]').addEventListener("click", () => {
    toggleSet(state.expandedDeepDives, topic.id);
    renderTopicList();
  });

  return article;
}

/** Adds the id to the set if absent, removes it if present. */
function toggleSet(set, id) {
  if (set.has(id)) set.delete(id);
  else set.add(id);
}

/** Re-renders the full topic list based on the current search term, level,
 *  and which panels are expanded. */
function renderTopicList() {
  const visibleTopics = state.topics.filter((topic) =>
    topicMatchesSearch(topic, state.searchTerm)
  );

  dom.topicList.innerHTML = "";
  visibleTopics.forEach((topic, index) => {
    dom.topicList.appendChild(renderTopicEntry(topic, index));
  });

  dom.emptyState.hidden = visibleTopics.length !== 0;
}

/* ------------------------------- Event wiring ------------------------------- */

function wireEventListeners() {
  dom.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    renderTopicList();
  });

  dom.experienceSelect.addEventListener("change", (event) => {
    state.level = event.target.value;
    renderTopicList();
  });

  dom.showAllDetails.addEventListener("change", (event) => {
    state.expandedDetails = event.target.checked
      ? new Set(state.topics.map((topic) => topic.id))
      : new Set();
    renderTopicList();
  });

  dom.showAllDeepDives.addEventListener("change", (event) => {
    state.expandedDeepDives = event.target.checked
      ? new Set(state.topics.map((topic) => topic.id))
      : new Set();
    renderTopicList();
  });

  dom.printBtn.addEventListener("click", () => {
    window.print();
  });
}

/* ---------------------------------- Init ---------------------------------- */

async function init() {
  renderExperienceOptions();
  wireEventListeners();

  try {
    state.topics = loadTopics();
    dom.loadingMessage.hidden = true;
    renderTopicList();
  } catch (error) {
    dom.loadingMessage.textContent =
      "Could not load topic data. Make sure topics-data.js is present alongside index.html.";
    console.error(error);
  }
}

init();
