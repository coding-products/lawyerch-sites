import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Raster images live in `public/images/` and are referenced by their
 * site-absolute path, e.g. `/images/project-console.webp`.
 */
const imageRef = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const collections = {};
