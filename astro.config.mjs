import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://www.ahrensteis.com'),
  output: 'static',
  redirects: { '/start-here': '/contact/', '/the-problem-may-not-be-your-marketing': '/insights/the-problem-may-not-be-your-marketing/', '/trust-is-not-a-claim': '/insights/trust-is-not-a-claim/', '/every-asset-needs-a-job': '/insights/every-asset-needs-a-job/' },
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
