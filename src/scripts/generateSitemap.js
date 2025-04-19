const fs = require('fs');
const path = require('path');

// Base URL for your site
const baseUrl = 'https://nicksonthc.github.io/playground';

// Routes in your application
const routes = [
  { url: '/', changefreq: 'monthly', priority: 1.0 },
  { url: '/#/pathfinding', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/game-theory', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/project-calculator', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/algo-ds', changefreq: 'monthly', priority: 0.8 },
];

// Get current date in YYYY-MM-DD format for lastmod
const today = new Date().toISOString().split('T')[0];

// Generate sitemap XML content
function generateSitemapXml() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

// Build directory path
const buildDir = path.resolve('./build');
const staticSitemapPath = path.join(buildDir, 'sitemap.xml');

// Write sitemap to file
try {
  // Make sure the build directory exists
  if (!fs.existsSync(buildDir)) {
    console.error('Build directory does not exist.');
    process.exit(1);
  }

  // Check if a static sitemap already exists from public folder
  if (fs.existsSync(staticSitemapPath)) {
    // If you want to use the dynamic one, uncomment the next line
    // fs.unlinkSync(staticSitemapPath); // Remove the static one
    
    // Skip generation since we want to keep the static one
    console.log('Static sitemap found. Using that instead of generating a new one.');
    process.exit(0);
  }

  // Generate and write the sitemap.xml
  const sitemap = generateSitemapXml();
  fs.writeFileSync(staticSitemapPath, sitemap);
  console.log('Sitemap generated successfully at build/sitemap.xml');
} catch (error) {
  console.error('Error generating sitemap:', error);
}
