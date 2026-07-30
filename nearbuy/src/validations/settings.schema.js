import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateNotificationsSchema = z.object({
  emailLeads: z.boolean(),
  whatsappAlerts: z.boolean(),
  promoReminders: z.boolean(),
  monthlyReports: z.boolean(),
});
