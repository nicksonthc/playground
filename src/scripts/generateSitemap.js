const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// Array of all routes in your application
const routes = [
  { url: '/', changefreq: 'monthly', priority: 1.0 },
  { url: '/#/pathfinding', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/game-theory', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/project-calculator', changefreq: 'monthly', priority: 0.8 },
  { url: '/#/algo-ds', changefreq: 'monthly', priority: 0.8 },
];

async function generateSitemap() {
  // Create a stream to write to
  const stream = new SitemapStream({ 
    hostname: 'https://nicksonthc.github.io/playground' 
  });
  
  // Return a promise that resolves with your XML string
  return streamToPromise(Readable.from(routes).pipe(stream)).then((data) =>
    data.toString()
  );
}

// Generate the sitemap and write it to the build directory
generateSitemap().then(sitemap => {
  fs.writeFileSync('./build/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');
}).catch(err => {
  console.error('Error generating sitemap:', err);
});
