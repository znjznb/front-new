import { defineCollection, z } from 'astro:content';

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = {
  news: newsCollection,
};
