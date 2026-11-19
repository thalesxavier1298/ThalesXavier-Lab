// Post-build: writes sitemap.xml and robots.txt into dist/ once SITE_URL is set
// (e.g. SITE_URL=https://thalesxavierwork.com npm run build). Same behavior as before
// the redesign: without a site URL, nothing is generated and public/robots.txt is used.
import fs from 'node:fs'

const siteUrl = process.env.SITE_URL ?? ''
const projectSlugs = ['customer-service-automation', 'assignment-hub', 'social-media-content', 'daily-planner', 'ai-video-clipping']

if (siteUrl) {
  const origin = new URL(siteUrl)
  if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('SITE_URL must use https:// or http://')
  const routes = ['/', '/about', '/projects', ...projectSlugs.map((s) => '/projects/' + s), '/jarvis/']
  const urls = routes.map((r) => `\n<url><loc>${new URL(r, origin).href}</loc></url>`).join('')
  fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>\n`)
  fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`)
  console.log('Generated sitemap for', origin.origin)
} else {
  console.log('Sitemap skipped: set SITE_URL to generate it.')
}
