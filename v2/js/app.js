(() => {
  "use strict";

  const DATA_URL = "data/topics.json";
  const THEME_KEY = "ai-learning-hub:theme";
  const EXPERIENCE_KEY = "ai-learning-hub:experience";

  const state = {
    topics: [],
    experience: "0-5",
    query: "",
  };

  const els = {
    grid: document.getElementById("topics-grid"),
    emptyState: document.getElementById("empty-state"),
    resultsMeta: document.getElementById("results-meta"),
    experienceSelect: document.getElementById("experience-select"),
    searchInput: document.getElementById("search-input"),
    themeToggle: document.getElementById("theme-toggle"),
    modalOverlay: document.getElementById("modal-overlay"),
    modal: document.getElementById("topic-modal"),
    modalClose: document.getElementById("modal-close"),
    modalIcon: document.getElementById("modal-icon"),
    modalTitle: document.getElementById("modal-title"),
    modalCategory: document.getElementById("modal-category"),
    modalImages: document.getElementById("modal-images"),
    modalExplanation: document.getElementById("modal-explanation"),
    modalTakeaways: document.getElementById("modal-takeaways"),
  };

  let lastFocusedElement = null;

  /* ----------------------------------------------------------------------
   * Data loading
   * -------------------------------------------------------------------- */
  async function loadTopics() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to load topics (status ${response.status})`);
      }
      const data = await response.json();
      state.topics = Array.isArray(data.topics) ? data.topics : [];
      renderTopics();
    } catch (err) {
      els.grid.innerHTML = "";
      els.resultsMeta.textContent = "";
      els.emptyState.hidden = false;
      els.emptyState.textContent =
        "Could not load topics.json. Please make sure the app is served over HTTP and the data file exists.";
      console.error(err);
    }
  }

  /* ----------------------------------------------------------------------
   * Filtering + rendering
   * -------------------------------------------------------------------- */
  function getFilteredTopics() {
    const query = state.query.trim().toLowerCase();
    if (!query) return state.topics;

    return state.topics.filter((topic) => {
      const haystack = [
        topic.name,
        topic.category,
        topic.summary ? topic.summary[state.experience] : "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  function renderTopics() {
    const filtered = getFilteredTopics();

    els.grid.innerHTML = "";

    if (filtered.length === 0) {
      els.emptyState.hidden = false;
      els.emptyState.textContent = "No topics match your search. Try a different keyword.";
    } else {
      els.emptyState.hidden = true;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((topic) => fragment.appendChild(buildCard(topic)));
    els.grid.appendChild(fragment);

    const total = state.topics.length;
    els.resultsMeta.textContent = state.query.trim()
      ? `Showing ${filtered.length} of ${total} topics`
      : `${total} topic${total === 1 ? "" : "s"} available`;
  }

  function buildCard(topic) {
    const card = document.createElement("article");
    card.className = "topic-card";

    const summaryText = (topic.summary && topic.summary[state.experience]) || "";

    card.innerHTML = `
      <div class="topic-card__top">
        <span class="topic-card__icon" aria-hidden="true">${escapeHtml(topic.icon || "📄")}</span>
        <span class="badge">${escapeHtml(topic.category || "")}</span>
      </div>
      <h2 class="topic-card__name">${escapeHtml(topic.name || "Untitled topic")}</h2>
      <p class="topic-card__summary">${escapeHtml(summaryText)}</p>
      <div class="topic-card__footer">
        <button type="button" class="read-more-btn" data-topic-id="${escapeHtml(topic.id)}">
          Read More
        </button>
      </div>
    `;

    const btn = card.querySelector(".read-more-btn");
    btn.addEventListener("click", () => openModal(topic));

    return card;
  }

  /* ----------------------------------------------------------------------
   * Modal
   * -------------------------------------------------------------------- */
  function openModal(topic) {
    lastFocusedElement = document.activeElement;

    els.modalIcon.textContent = topic.icon || "📄";
    els.modalTitle.textContent = topic.name || "Untitled topic";
    els.modalCategory.textContent = topic.category || "";

    const images = Array.isArray(topic.images) ? topic.images.slice(0, 3) : [];
    els.modalImages.innerHTML = images
      .map(
        (src) =>
          `<img src="${escapeHtml(src)}" alt="${escapeHtml(topic.name || "")} illustration" loading="lazy" />`
      )
      .join("");

    const explanationText = (topic.explanation && topic.explanation[state.experience]) || "";
    els.modalExplanation.innerHTML = explanationText
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((para) => `<p>${escapeHtml(para.trim())}</p>`)
      .join("");

    const takeaways = Array.isArray(topic.keyTakeaways) ? topic.keyTakeaways : [];
    els.modalTakeaways.innerHTML = takeaways
      .map((point) => `<li>${escapeHtml(point)}</li>`)
      .join("");

    els.modalOverlay.hidden = false;
    document.body.classList.add("modal-open");
    els.modalClose.focus();

    document.addEventListener("keydown", handleModalKeydown);
  }

  function closeModal() {
    els.modalOverlay.hidden = true;
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleModalKeydown);

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function handleModalKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      trapFocus(event);
    }
  }

  function trapFocus(event) {
    const focusable = els.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ----------------------------------------------------------------------
   * Theme
   * -------------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    els.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    els.themeToggle.querySelector(".theme-toggle__icon").textContent =
      theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  }

  /* ----------------------------------------------------------------------
   * Helpers
   * -------------------------------------------------------------------- */
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        default:
          return "&#39;";
      }
    });
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /* ----------------------------------------------------------------------
   * Init
   * -------------------------------------------------------------------- */
  function init() {
    initTheme();

    const savedExperience = localStorage.getItem(EXPERIENCE_KEY);
    if (savedExperience) {
      state.experience = savedExperience;
      els.experienceSelect.value = savedExperience;
    }

    els.experienceSelect.addEventListener("change", (event) => {
      state.experience = event.target.value;
      localStorage.setItem(EXPERIENCE_KEY, state.experience);
      renderTopics();
    });

    els.searchInput.addEventListener(
      "input",
      debounce((event) => {
        state.query = event.target.value;
        renderTopics();
      }, 150)
    );

    els.themeToggle.addEventListener("click", toggleTheme);
    els.modalClose.addEventListener("click", closeModal);
    els.modalOverlay.addEventListener("click", (event) => {
      if (event.target === els.modalOverlay) closeModal();
    });

    loadTopics();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
