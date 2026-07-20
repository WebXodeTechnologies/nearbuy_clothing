import { z } from "zod";

export const collectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  status: z.boolean().optional().default(true),
});

export const updateCollectionSchema = collectionSchema.partial();
