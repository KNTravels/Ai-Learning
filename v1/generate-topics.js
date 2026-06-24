// Topic Page Generator
// This script generates HTML pages for all topics from the topics.json file

const fs = require('fs');
const path = require('path');

// Read topics.json
const topicsData = JSON.parse(fs.readFileSync('data/topics.json', 'utf8'));

const topics = topicsData.topics;

function generateTopicPage(topic) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${topic.name} - Comprehensive guide. Learn from beginner to advanced levels.">
  <meta name="keywords" content="${topic.name}, ${topic.tags.join(', ')}, AI, Learning">
  <meta name="robots" content="index, follow">
  
  <title>${topic.name} - AI Knowledge Hub</title>
  <link rel="canonical" href="https://ai-knowledge-hub.com/pages/${topic.id}.html">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-container">
      <a href="/" class="navbar-brand">
        <span class="navbar-brand-icon">🧠</span>
        AI Knowledge Hub
      </a>
      <div class="navbar-controls">
        <button id="theme-toggle" class="theme-toggle" title="Toggle Dark Mode">🌙</button>
        <button id="menu-toggle" class="menu-toggle">☰</button>
      </div>
    </div>
  </nav>

  <!-- Sidebar -->
  <aside id="sidebar" class="sidebar">
    <button id="sidebar-close" class="sidebar-close">✕</button>
    <div class="sidebar-section">
      <div class="sidebar-title">Navigation</div>
      <a href="/" class="sidebar-link">← Back to Home</a>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-title">On This Page</div>
      <a href="#overview" class="sidebar-link">Overview</a>
      <a href="#architecture" class="sidebar-link">Architecture</a>
      <a href="#examples" class="sidebar-link">Examples</a>
      <a href="#use-cases" class="sidebar-link">Use Cases</a>
      <a href="#pros-cons" class="sidebar-link">Pros & Cons</a>
      <a href="#questions" class="sidebar-link">Interview Q&A</a>
      <a href="#future" class="sidebar-link">Future Trends</a>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-container">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/#${topic.category.replace(/\\s+/g, '-').toLowerCase()}">${topic.category}</a>
        <span>/</span>
        <span>${topic.name}</span>
      </div>

      <!-- Topic Header -->
      <section class="topic-header">
        <h1>${topic.name}</h1>
        <div class="topic-header-meta">
          <span class="topic-header-badge">${topic.category}</span>
          <span class="topic-header-badge">🌱 All Levels</span>
        </div>
      </section>

      <!-- Overview Section -->
      <section id="overview" class="content-section">
        <h2>Overview</h2>
        <h3>Beginner Level</h3>
        <p>${topic.summary.beginner}</p>
        
        <h3>Intermediate Level</h3>
        <p>${topic.summary.intermediate}</p>

        <h3>Advanced Level</h3>
        <p>${topic.summary.advanced}</p>
      </section>

      <!-- Architecture Section -->
      <section id="architecture" class="content-section">
        <h2>Architecture & Technical Details</h2>
        <p>This topic covers the core architectural patterns and technical implementation details of ${topic.name}. Understanding these foundations is crucial for building production systems.</p>
        
        <h3>Key Components</h3>
        <ul>
          <li>Primary architectural patterns</li>
          <li>System design principles</li>
          <li>Core algorithms and techniques</li>
          <li>Performance optimization strategies</li>
        </ul>

        <h3>Implementation Considerations</h3>
        <ul>
          <li>Scalability requirements</li>
          <li>Computational complexity</li>
          <li>Memory management</li>
          <li>Distributed processing</li>
        </ul>
      </section>

      <!-- Examples Section -->
      <section id="examples" class="content-section">
        <h2>Real-world Examples & Case Studies</h2>
        <p>Learn how ${topic.name} is applied in real-world scenarios across different industries and applications.</p>
        
        <h3>Industry Applications</h3>
        <ul>
          <li>Enterprise solutions</li>
          <li>Research implementations</li>
          <li>Open-source projects</li>
          <li>Commercial products</li>
        </ul>
      </section>

      <!-- Use Cases -->
      <section id="use-cases" class="content-section">
        <h2>Industry Use Cases</h2>
        
        <h3>Finance & Banking</h3>
        <p>Applications in financial technology, risk management, and regulatory compliance.</p>

        <h3>Healthcare & Medicine</h3>
        <p>Medical applications, drug discovery, and patient care improvements.</p>

        <h3>Technology & Software</h3>
        <p>Software development, system optimization, and infrastructure improvements.</p>

        <h3>Other Industries</h3>
        <p>Applications in education, manufacturing, retail, and more.</p>
      </section>

      <!-- Pros and Cons -->
      <section id="pros-cons" class="content-section">
        <h2>Pros and Cons</h2>

        <h3>Advantages</h3>
        <ul>
          <li>Performance benefits</li>
          <li>Scalability advantages</li>
          <li>Cost efficiency</li>
          <li>Flexibility and adaptability</li>
          <li>Ease of integration</li>
        </ul>

        <h3>Disadvantages</h3>
        <ul>
          <li>Complexity concerns</li>
          <li>Resource requirements</li>
          <li>Learning curve</li>
          <li>Maintenance overhead</li>
          <li>Potential limitations</li>
        </ul>
      </section>

      <!-- Interview Questions -->
      <section id="questions" class="content-section">
        <h2>Interview Questions & Answers</h2>

        <h3>Conceptual Questions</h3>
        <ol>
          <li>
            <strong>What is ${topic.name} and what are its primary purposes?</strong>
            <p><em>Answer:</em> ${topic.summary.intermediate}</p>
          </li>
          <li>
            <strong>How does ${topic.name} compare to alternative approaches?</strong>
            <p><em>Answer:</em> ${topic.name} offers unique advantages in terms of efficiency, scalability, and flexibility compared to traditional methods.</p>
          </li>
          <li>
            <strong>What are the key components of ${topic.name}?</strong>
            <p><em>Answer:</em> The main components include core architectural elements, processing units, and integration layers that work together to provide the intended functionality.</p>
          </li>
        </ol>

        <h3>Technical Questions</h3>
        <ol>
          <li>
            <strong>How would you implement ${topic.name} in a production environment?</strong>
            <p><em>Answer:</em> Implementation requires careful consideration of architectural design, scalability requirements, performance optimization, and operational monitoring.</p>
          </li>
          <li>
            <strong>What are common pitfalls when working with ${topic.name}?</strong>
            <p><em>Answer:</em> Common issues include improper configuration, inadequate resource allocation, lack of monitoring, and insufficient testing.</p>
          </li>
        </ol>
      </section>

      <!-- Future Trends -->
      <section id="future" class="content-section">
        <h2>Future Trends & Research Directions</h2>

        <h3>Emerging Research Areas</h3>
        <ul>
          <li>Advanced optimization techniques</li>
          <li>Integration with emerging technologies</li>
          <li>Improved efficiency and performance</li>
          <li>Enhanced functionality and capabilities</li>
          <li>Better user experience and accessibility</li>
        </ul>

        <h3>Industry Evolution</h3>
        <ul>
          <li>Increased adoption across industries</li>
          <li>Development of specialized tools and platforms</li>
          <li>Growth of supporting ecosystems</li>
          <li>Standardization efforts</li>
          <li>Regulatory developments</li>
        </ul>
      </section>

      <!-- References -->
      <section class="content-section">
        <h2>References & Further Reading</h2>
        <ul>
          ${topic.references.map(ref => `<li>${ref}</li>`).join('')}
          <li>Official documentation and guides</li>
          <li>Research papers and whitepapers</li>
          <li>Industry case studies</li>
          <li>Community resources and tutorials</li>
        </ul>
      </section>

      <!-- Related Topics -->
      <section class="content-section" style="background-color: var(--border-color); margin-top: 3rem;">
        <h2>Related Topics</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          <a href="/" class="btn btn-primary">← Back to Home</a>
          <a href="/" class="btn btn-primary">Browse All Topics →</a>
        </div>
      </section>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>About AI Knowledge Hub</h3>
        <p>Comprehensive resource for learning about AI and ML concepts</p>
      </div>
      <div class="footer-section">
        <h3>Navigation</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/sitemap.xml">Sitemap</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 AI Knowledge Hub. All rights reserved.</p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>`;

  return html;
}

// Generate all topic pages
topics.forEach(topic => {
  const filePath = path.join('pages', `${topic.id}.html`);
  const html = generateTopicPage(topic);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Generated: ${filePath}`);
});

console.log(`✅ Generated ${topics.length} topic pages!`);
