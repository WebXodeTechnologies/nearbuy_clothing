// validations/offer.schema.js
import { z } from "zod";

export const offerSchema = z.object({
  title: z.string().min(2, "Campaign title must be at least 2 characters"),
  couponCode: z.string().optional().nullable(),
  description: z.string().optional().nullable().default(""),
  discountType: z
    .enum(["Percentage", "Flat", "BOGO"], {
      errorMap: () => ({
        message: "Discount type must be Percentage, Flat, or BOGO",
      }),
    })
    .default("Percentage"),
  discountValue: z.number().optional().default(0),
  minPurchaseAmount: z.number().optional().default(0),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()),
  banner: z.string().optional().nullable().default(""),
  status: z.enum(["Active", "Paused", "Expired"]).default("Active"),
  storeId: z.string().optional().nullable(),
});

export const updateOfferSchema = offerSchema.partial();
