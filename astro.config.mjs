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
      // 为每个 URL 加 lastmod（构建时间）—— 新鲜度 / 重抓信号
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
});
