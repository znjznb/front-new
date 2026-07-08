import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    author: z.string().optional(),
    sourceUrl: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/products' }),
  schema: z.object({
    name: z.string(),
    line: z.string(),
    desc: z.string(),
    image: z.string(),
    order: z.number(),
  }),
});

export const collections = { news, products };
