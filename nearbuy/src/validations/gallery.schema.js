import { z } from "zod";

export const GALLERY_FOLDERS = [
  "Men's Collection",
  "Women's Wear",
  "Kids & Teens",
  "Ethnic & Traditional",
  "Western & Streetwear",
  "Storefront & Ambience",
  "Offers & Promotional",
  "Storefront",
  "Display Photos",
  "Promotional",
  "Store Interior",
  "Collections",
  "Offers",
  "Logo & Banners",
];

export const gallerySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  folder: z.enum(GALLERY_FOLDERS).default("Women's Wear"),
  url: z.string().min(1, "Photo asset is required"),
  price: z.number().optional().default(0),
  size: z.string().optional().default("1.5 MB"),
  compressed: z.string().optional().default("300 KB"),
});

export const updateGallerySchema = gallerySchema.partial();
