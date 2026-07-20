import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  image: z.string().min(1, "Image URL is required"),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateBannerSchema = bannerSchema.partial();
