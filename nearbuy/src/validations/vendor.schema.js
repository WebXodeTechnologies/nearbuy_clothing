import { z } from "zod";

export const vendorRegisterSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  gstNumber: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
});

export const updateVendorProfileSchema = vendorRegisterSchema.partial();

export const updateVendorStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected", "Suspended"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});
