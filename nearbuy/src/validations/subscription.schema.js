import { z } from "zod";

export const subscriptionSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  planName: z.string().min(1, "Plan name is required"),
  amount: z.number().nonnegative("Amount must be non-negative"),
  billingCycle: z.enum(["Monthly", "Yearly"]).default("Monthly"),
  paymentStatus: z
    .enum(["Pending", "Paid", "Failed"])
    .optional()
    .default("Pending"),
  razorpayOrderId: z.string().optional().default(""),
  razorpayPaymentId: z.string().optional().default(""),
  razorpaySignature: z.string().optional().default(""),
});

export const updateSubscriptionSchema = subscriptionSchema.partial();
