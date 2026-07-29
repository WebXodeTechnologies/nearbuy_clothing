import { z } from "zod";

export const gallerySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  folder: z
    .enum(["Store Interior", "Collections", "Offers", "Logo & Banners"])
    .default("Store Interior"),
  url: z.string().min(1, "Photo asset is required"),
  size: z.string().optional().default("1.5 MB"),
  compressed: z.string().optional().default("300 KB"),
});

export const updateGallerySchema = gallerySchema.partial();
