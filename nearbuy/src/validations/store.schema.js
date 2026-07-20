import { z } from "zod";

export const storeSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  googleMapUrl: z.string().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  workingDays: z.array(z.string()).optional(),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  description: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
});

export const updateStoreSchema = storeSchema.partial();
