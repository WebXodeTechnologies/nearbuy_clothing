import { z } from "zod";

export const collectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional().nullable(),
  price: z.number().optional().nullable().default(0),
  coverImage: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
  categoryId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  storeId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const updateCollectionSchema = collectionSchema.partial();
