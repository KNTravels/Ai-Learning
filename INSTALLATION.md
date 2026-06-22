# 🚀 Installation & Deployment Guide

## AI Knowledge Hub - Complete Setup Instructions

### Table of Contents
1. [Local Development](#local-development)
2. [Static Hosting Deployment](#static-hosting-deployment)
3. [Domain Configuration](#domain-configuration)
4. [Performance Optimization](#performance-optimization)
5. [Maintenance](#maintenance)

---

## Local Development

### Prerequisites
- Modern web browser
- Optional: Node.js (for page generation)
- Optional: Python (for local server)

### Setup Steps

#### 1. Basic Setup (No Server)
```bash
# Simply open index.html in your browser
# File menu → Open → Select index.html

# Or drag and drop the file into your browser
```

#### 2. With Python HTTP Server
```bash
# Navigate to project directory
cd path/to/ai-knowledge-hub

# For Python 3
python3 -m http.server 8000

# For Python 2
python -m SimpleHTTPServer 8000

# Visit: http://localhost:8000
```

#### 3. With Node.js
```bash
# Install dependencies (none needed)
npm install

# Generate/regenerate topic pages
npm run generate

# Start local server
npm run serve

# Visit: http://localhost:8000
```

#### 4. With Live Server (VS Code)
```bash
# Install Live Server extension in VS Code
# Right-click index.html
# Select "Open with Live Server"
# Browser opens automatically with hot reload
```

---

## Static Hosting Deployment

### Option 1: GitHub Pages (Free, Recommended)

#### Steps:
1. **Create Repository**
   ```bash
   git init
   git remote add origin https://github.com/yourusername/ai-knowledge-hub.git
   git branch -M main
   git add .
   git commit -m "Initial commit: AI Knowledge Hub"
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to Repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Click Save

3. **Access Site**
   - Site URL: `https://yourusername.github.io/ai-knowledge-hub`
   - Takes 1-2 minutes to deploy

#### Benefits:
- ✅ Free hosting
- ✅ Auto HTTPS
- ✅ Git version control
- ✅ No backend needed
- ✅ Fast CDN

---

### Option 2: Netlify

#### Steps:
1. **Connect Repository**
   - Go to netlify.com
   - Sign in with GitHub
   - Click "New site from Git"
   - Select your repository

2. **Configure Build**
   - Build command: (leave empty)
   - Publish directory: `/` (root)
   - Click Deploy

3. **Custom Domain**
   - Domain settings → Add custom domain
   - Point DNS records to Netlify

#### Benefits:
- ✅ Free tier available
- ✅ Automatic deploys
- ✅ Form handling
- ✅ Serverless functions available
- ✅ Easy domain setup

---

### Option 3: Vercel

#### Steps:
1. **Import Project**
   - Go to vercel.com
   - Click "New Project"
   - Import from Git repository

2. **Configure**
   - Framework: (Other)
   - Root Directory: ./
   - Build & Development: (Skip, static site)
   - Deploy

3. **Custom Domain**
   - Domain settings
   - Add custom domain
   - Follow DNS instructions

#### Benefits:
- ✅ Free tier
- ✅ Instant deploys
- ✅ Excellent performance
- ✅ Global CDN
- ✅ Edge functions available

---

### Option 4: Traditional Web Hosting

#### Using FTP/SFTP:
1. **Upload Files**
   ```
   FTP Server: ftp.yourhost.com
   Username: your_username
   Password: your_password
   Upload all files to: public_html/ or www/
   ```

2. **Verify**
   - Visit your domain
   - Check all pages load correctly

#### Apache .htaccess Configuration:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType text/javascript "access plus 30 days"
  ExpiresByType application/javascript "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType text/html "access plus 7 days"
</IfModule>
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/ai-knowledge-hub;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript;

    # Static files caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML caching
    location ~* \.html$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## Domain Configuration

### Custom Domain Setup

#### Step 1: Register Domain
- Use: GoDaddy, Namecheap, Google Domains, etc.
- Cost: $5-15/year typically

#### Step 2: Point DNS to Host
- For GitHub Pages:
  ```
  CNAME: yourusername.github.io
  ```

- For Netlify:
  ```
  CNAME: your-site.netlify.app
  ```

- For Vercel:
  ```
  CNAME: your-site.vercel.app
  ```

#### Step 3: SSL Certificate
- GitHub Pages: Automatic HTTPS
- Netlify: Automatic HTTPS via Let's Encrypt
- Vercel: Automatic HTTPS
- Traditional hosting: Use Let's Encrypt (free) via Certbot

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## Performance Optimization

### 1. Image Optimization
```bash
# Use ImageOptim or TinyPNG to compress images
# Target: 30-50KB per image
# Format: WebP preferred, JPEG/PNG fallback
```

### 2. CSS Minification
```bash
# Before: 45KB
# After minification: 32KB
# Tools: CSSNano, Purgecss
```

### 3. JavaScript Optimization
```bash
# Keep current vanilla JS approach
# No bundling needed
# Already optimized
```

### 4. Caching Strategy
```
Browser Cache:
- HTML: 7 days
- CSS/JS: 30 days
- Images: 30 days
- Sitemap: 7 days
```

### 5. Performance Metrics Target
```
Lighthouse:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

Page Speed:
- Load time: < 2 seconds
- First Contentful Paint: < 1 second
- Largest Contentful Paint: < 1.5 seconds
```

---

## Maintenance

### Regular Updates

#### Monthly Tasks:
1. Update topic content
2. Review analytics
3. Check for broken links
4. Update references

#### Quarterly Tasks:
1. Security audit
2. Performance review
3. Add new topics
4. Update SEO meta tags

#### Yearly Tasks:
1. Major content review
2. Design refresh (if needed)
3. Technology updates
4. Accessibility audit

### Backup Strategy

```bash
# Daily backup to cloud
# Using GitHub (automatic)
# Or rsync to backup server

rsync -avz /var/www/ai-knowledge-hub/ \
  backup@backup.server.com:/backups/ai-knowledge-hub/
```

### Monitoring

#### Set Up Monitoring:
```bash
# Website uptime monitoring
# Use: UptimeRobot, Pingdom, or StatusCake
# Check: 5 minutes interval
# Notification: Email on downtime
```

#### Analytics:
```bash
# Use Google Analytics 4
# Track: Pageviews, user behavior, traffic sources
# Dashboard: Update monthly
```

### Version Control

```bash
# Maintain Git history
git log --oneline

# Create tags for releases
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

# Maintain changelog
# File: CHANGELOG.md
```

---

## Troubleshooting

### Issue: Pages show 404 errors
**Solution:**
- Check file paths are correct
- Verify .htaccess or nginx config
- Ensure all pages are uploaded

### Issue: Images not loading
**Solution:**
- Use absolute paths: `/images/name.jpg`
- Check image files exist
- Verify file permissions (755)

### Issue: Dark mode not working
**Solution:**
- Check browser supports CSS variables
- Verify localStorage is enabled
- Check browser dev tools for errors

### Issue: Search not working
**Solution:**
- Verify topics.json is loaded
- Check browser console for errors
- Ensure JSON is valid (use jsonlint.com)

### Issue: Mobile menu not showing
**Solution:**
- Check viewport meta tag
- Test on real mobile device
- Check CSS media queries

---

## Next Steps

1. **Deploy to your chosen platform**
2. **Set up custom domain**
3. **Configure analytics**
4. **Set up backups**
5. **Share with others!**

---

## Support

For issues or questions:
- Check README.md
- Review browser console (F12)
- Check internet connection
- Clear browser cache (Ctrl+Shift+Delete)

---

**Happy Hosting! 🚀**
