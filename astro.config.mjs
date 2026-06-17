// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.martempo.com.cn',
  server: { port: 4321 },
  integrations: [
    sitemap({
      // 排除 CMS 后台，不让它进搜索引擎
      filter: (page) => !page.includes('/admin'),
    }),
  ],
});
