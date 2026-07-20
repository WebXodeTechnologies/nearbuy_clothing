import { z } from "zod";

export const cmsSchema = z.object({
  title: z.string().min(2, "Page title must be at least 2 characters"),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCmsSchema = cmsSchema.partial();
