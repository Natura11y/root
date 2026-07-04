import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: ({ image }) => z.object({
    category: z.string(),
    type: z.string().optional(),
    title: z.string(),
    slug: z.string(),
    bannerCreditName: z.string().optional(),
    bannerCreditUrl: z.string().url().optional(),
    bannerImage: image().optional(),
    bannerAlt: z.string().optional(),
    description: z.string().optional(),
    relatedPages: z.array(z.string()).optional(),
  }),
});

export const collections = { docs };
