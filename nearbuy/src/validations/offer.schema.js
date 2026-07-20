import { z } from "zod";

export const offerSchema = z.object({
  title: z.string().min(2, "Offer title must be at least 2 characters"),
  description: z.string().optional(),
  banner: z.string().optional(),
  discountType: z.enum(["Percentage", "Flat"], {
    errorMap: () => ({ message: "Discount type must be Percentage or Flat" }),
  }),
  discountValue: z.number().positive("Discount value must be a positive number"),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()),
  status: z.enum(["Active", "Expired"]).optional().default("Active"),
});

export const updateOfferSchema = offerSchema.partial();
