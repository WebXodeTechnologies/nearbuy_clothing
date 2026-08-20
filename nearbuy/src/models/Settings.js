import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    platformName: { type: String, default: "Streetunics Boutiques" },
    supportEmail: { type: String, default: "support@streetunics.com" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    platformCurrency: { type: String, default: "INR (₹)" },
    maintenanceMode: { type: Boolean, default: false },
    newVendorRegistration: { type: Boolean, default: true },
    razorpayKeyId: { type: String, default: "" },
    razorpayKeySecret: { type: String, default: "" },
    commissionRate: { type: String, default: "5%" },
    smtpHost: { type: String, default: "smtp.sendgrid.net" },
    senderEmail: { type: String, default: "noreply@streetunics.com" },
  },
  { timestamps: true },
);

SettingSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
export default Setting;
