import { defineCollection, z } from 'astro:content';

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // 正文配图上传区：仅用于把图片传进仓库，正文里用 ![](路径) 引用，本身不参与渲染
    body_images: z.array(z.string()).optional(),
  }),
});

export const collections = {
  news: newsCollection,
};
