import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const content = defineCollection({
  loader: file('src/content/content.json', {
    parser: (text) =>
      Object.entries(JSON.parse(text)).map(([id, items]) => ({ id, items })),
  }),
  schema: z.object({ items: z.array(z.any()) }),
});

export const collections = { content };

