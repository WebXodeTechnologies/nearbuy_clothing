import { z } from "zod";

export const supportTicketSchema = z.object({
  category: z.enum([
    "Store Listing & Location",
    "Promotions & Coupon Claims",
    "Subscription & Billing",
    "Other Technical Query",
  ]),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  attachments: z
    .array(z.string().url("Invalid image URL"))
    .optional()
    .default([]),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional()
    .default("MEDIUM"),
});
