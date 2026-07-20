import { z } from "zod";

export const subscriptionSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  amount: z.number().nonnegative("Amount must be non-negative"),
  billingCycle: z.enum(["Monthly", "Yearly"]).default("Monthly"),
  paymentStatus: z.enum(["Pending", "Paid", "Failed"]).optional().default("Pending"),
  paymentId: z.string().optional(),
  orderId: z.string().optional(),
});

export const updateSubscriptionSchema = subscriptionSchema.partial();
