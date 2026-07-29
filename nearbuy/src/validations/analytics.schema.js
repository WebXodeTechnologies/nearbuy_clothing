import { z } from "zod";

export const trackEventSchema = z.object({
  eventType: z.enum(
    [
      "WEBSITE_VISIT",
      "STORE_VIEW",
      "COLLECTION_VIEW",
      "OFFER_VIEW",
      "CATEGORY_VIEW",
      "WHATSAPP_CLICK",
      "PHONE_CLICK",
      "MAP_CLICK",
      "WEBSITE_CLICK",
      "VENDOR_LOGIN",
      "CUSTOMER_LOGIN",
      "CONTACT_FORM_SUBMIT",
    ],
    {
      errorMap: () => ({ message: "Invalid or unsupported eventType" }),
    },
  ),

  vendorId: z.string().optional().nullable(),
  storeId: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  offerId: z.string().optional().nullable(),

  ipAddress: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  device: z
    .enum(["DESKTOP", "MOBILE", "TABLET", "UNKNOWN"])
    .optional()
    .default("UNKNOWN"),
  browser: z.string().optional().default(""),
  os: z.string().optional().default(""),
  referrer: z.string().optional().default(""),

  metadata: z.record(z.any()).optional().default({}),
});
