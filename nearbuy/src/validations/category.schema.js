import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = categorySchema.partial();
