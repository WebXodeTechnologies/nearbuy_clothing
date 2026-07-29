import { z } from "zod";

export const storeSchema = z.object({
  // Basic Store Info
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),

  // Location & Address
  address: z.string().min(5, "Address must be at least 5 characters"),
  area: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  googleMapUrl: z.string().optional().nullable(),

  // Contact Info
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional()
    .nullable(),

  // Operating Hours & Days
  openingTime: z.string().optional().nullable(),
  closingTime: z.string().optional().nullable(),
  workingDays: z.array(z.string()).optional(),

  // Facilities & Clothing Tags (Sarees, AC, Trial Room, etc.)
  facilities: z.array(z.string()).optional(),

  // Social & Web Links
  website: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),

  // Branding & Media (Supports both URLs and Base64 Desktop Uploads)
  logo: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional(),

  // Status & Visibility
  featured: z.boolean().optional(),
  status: z
    .enum(["Active", "Inactive", "Pending"])
    .optional()
    .default("Active"),
});

// Allow partial updates for PUT requests
export const updateStoreSchema = storeSchema.partial();
