import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
  designation: z.string().optional(),
  bio: z.string().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "VENDOR", "ADMIN"], {
    errorMap: () => ({ message: "Role must be USER, VENDOR, or ADMIN" }),
  }),
});
