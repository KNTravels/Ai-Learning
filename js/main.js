// ========================================
// AI Knowledge Hub - Main JavaScript
// ========================================

class AIKnowledgeHub {
  constructor() {
    this.topics = [];
    this.filteredTopics = [];
    this.currentExperienceLevel = 'all';
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.isDarkMode = false;

    this.init();
  }

  async init() {
    // Load topics from JSON
    await this.loadTopics();

    // Initialize theme
    this.initTheme();

    // Setup event listeners
    this.setupEventListeners();

    // Render initial topics
    this.renderTopics(this.topics);
  }

  async loadTopics() {
    try {
      const response = await fetch('/data/topics.json');
      const data = await response.json();
      this.topics = data.topics;
      this.filteredTopics = [...this.topics];
      console.log(`Loaded ${this.topics.length} topics`);
    } catch (error) {
      console.error('Error loading topics:', error);
      this.showErrorMessage('Failed to load topics. Please refresh the page.');
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }

    this.applyTheme();
  }

  applyTheme() {
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        sidebar?.classList.toggle('active');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        sidebar?.classList.remove('active');
      });
    }

    // Close sidebar when clicking on a link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar?.classList.remove('active');
      });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    // Experience filter buttons
    const experienceButtons = document.querySelectorAll('.experience-filter');
    experienceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        experienceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentExperienceLevel = btn.dataset.level;
        this.applyFilters();
      });
    });

    // Category filter buttons
    const categoryButtons = document.querySelectorAll('.category-filter');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        this.updateCategoryFilter();
        this.applyFilters();
      });
    });

    // Clear all filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();

    // Animate theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.style.transform = 'rotate(20deg)';
      setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
      }, 300);
    }
  }

  updateCategoryFilter() {
    const activeCategories = Array.from(document.querySelectorAll('.category-filter.active'))
      .map(btn => btn.dataset.category);

    if (activeCategories.length === 0) {
      this.currentCategory = 'all';
    } else {
      this.currentCategory = activeCategories;
    }
  }

  applyFilters() {
    this.filteredTopics = this.topics.filter(topic => {
      // Search filter
      const matchesSearch = this.searchQuery === '' ||
        topic.name.toLowerCase().includes(this.searchQuery) ||
        topic.category.toLowerCase().includes(this.searchQuery) ||
        topic.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));

      // Category filter
      const matchesCategory = this.currentCategory === 'all' ||
        (Array.isArray(this.currentCategory) && this.currentCategory.includes(topic.category)) ||
        (typeof this.currentCategory === 'string' && this.currentCategory === topic.category);

      return matchesSearch && matchesCategory;
    });

    this.renderTopics(this.filteredTopics);
    this.updateResultCount();
  }

  updateResultCount() {
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
      const count = this.filteredTopics.length;
      resultCount.textContent = `Showing ${count} topic${count !== 1 ? 's' : ''}`;
    }
  }

  clearFilters() {
    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    this.searchQuery = '';

    // Clear experience filter
    const experienceButtons = document.querySelectorAll('.experience-filter');
    experienceButtons.forEach(btn => btn.classList.remove('active'));
    experienceButtons[0]?.classList.add('active');
    this.currentExperienceLevel = 'all';

    // Clear category filter
    const categoryButtons = document.querySelectorAll('.category-filter');
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    this.currentCategory = 'all';

    // Re-apply filters
    this.applyFilters();
  }

  renderTopics(topics) {
    const grid = document.getElementById('topics-grid');
    if (!grid) return;

    if (topics.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
          <p style="color: var(--text-secondary); font-size: 1.1rem;">
            No topics found. Try adjusting your search or filters.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = topics.map(topic => this.createTopicCard(topic)).join('');

    // Setup lazy loading for images
    this.setupLazyLoading();
  }

  createTopicCard(topic) {
    const experienceLevels = {
      'less_than_5': 'Less than 5 Years',
      '5_to_15': '5-15 Years',
      '15_plus': '15+ Years'
    };

    let summaryText = '';
    if (this.currentExperienceLevel === 'all' || this.currentExperienceLevel === 'less_than_5') {
      summaryText = topic.summary.less_than_5;
    } else if (this.currentExperienceLevel === '5_to_15') {
      summaryText = topic.summary['5_to_15'];
    } else if (this.currentExperienceLevel === '15_plus') {
      summaryText = topic.summary['15_plus'];
    }

    return `
      <div class="topic-card">
        <div class="topic-card-icon">${this.escapeHtml(topic.icon)}</div>
        <div class="topic-card-content">
          <span class="topic-card-category">${this.escapeHtml(topic.category)}</span>
          <h3 class="topic-card-title">${this.escapeHtml(topic.name)}</h3>
          <p class="topic-card-summary">${this.escapeHtml(summaryText)}</p>
          <div class="topic-card-tags">${tagsHtml}</div>
          <div class="topic-card-actions">
            <a href="${this.escapeHtml(topic.deepAnalysisUrl)}" class="btn btn-primary">
              Deep Analysis
            </a>
            <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${this.escapeHtml(topic.name)}')">
              Copy Topic
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img.lazy-load').forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('img.lazy-load').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  showErrorMessage(message) {
    const grid = document.getElementById('topics-grid');
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <p style="color: red; font-size: 1.1rem;">${this.escapeHtml(message)}</p>
        </div>
      `;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get unique categories
  getCategories() {
    const categories = new Set(this.topics.map(topic => topic.category));
    return Array.from(categories).sort();
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.hub = new AIKnowledgeHub();
});
