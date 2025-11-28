import { getAllArticles } from '../data/articles';

export const generateSitemap = (): string => {
  const articles = getAllArticles();
  const baseUrl = 'https://zoneout.space';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    ...articles.map(article => ({
      loc: `${baseUrl}/articles/${article.slug}`,
      lastmod: article.dateModified || article.datePublished,
      changefreq: 'monthly',
      priority: '0.9'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

