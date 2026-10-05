// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: replace the placeholder with the real production URL (used for canonical links,
// hreflang alternates, Open Graph URLs, sitemap and robots.txt).
const SITE_URL = 'https://www.example.sa';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Arabic lives at the root, English under /en/.
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar-SA', en: 'en-US' } },
      // Keep thank-you pages out of the sitemap.
      filter: (page) => !/\/thanks\/$/.test(page),
    }),
  ],
});
