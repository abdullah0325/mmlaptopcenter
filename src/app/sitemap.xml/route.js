import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://mmlaptopcenter.com'; 

function isValidPage(fileName) {
  return ['page.js', 'page.jsx', 'page.ts', 'page.tsx'].includes(fileName);
}

function getRoutes(dirPath, routePrefix = '') {
  let routes = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const name = entry.name;

    // ❌ Skip API, dynamic, error, or special folders
    if (
      name === 'api' ||
      name === '404' ||
      name.startsWith('[') ||
      name.startsWith('(')
    ) {
      continue;
    }

    const fullPath = path.join(dirPath, name);
    const routePath = `${routePrefix}/${name}`.replace(/\/page$/, '');

    if (entry.isDirectory()) {
      const children = fs.readdirSync(fullPath);
      const pageFile = children.find(isValidPage);

      if (pageFile) {
        const pagePath = path.join(fullPath, pageFile);
        const stats = fs.statSync(pagePath);
        const lastmod = stats.mtime.toISOString();

        routes.push({
          url: `${BASE_URL}${routePath}`,
          lastmod,
        });
      }

      // Recursive search
      routes = routes.concat(getRoutes(fullPath, routePath));
    }
  }

  return routes;
}

export async function GET() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const routes = getRoutes(appDir);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}