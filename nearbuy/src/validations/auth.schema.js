import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string({ required_error: "Password field is required" })
    .min(6, "Password must be at least 6 characters"),
  role: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          const upper = val.toUpperCase().trim();
          return upper === "CUSTOMER" ? "USER" : upper;
        }
        return val;
      },
      z.enum(["USER", "VENDOR", "ADMIN"]),
    )
    .optional()
    .default("USER"),
  plan: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
