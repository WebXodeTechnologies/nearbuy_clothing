import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    notifications: {
      emailLeads: { type: Boolean, default: true },
      whatsappAlerts: { type: Boolean, default: true },
      promoReminders: { type: Boolean, default: true },
      monthlyReports: { type: Boolean, default: false },
    },
    storePreferences: {
      autoAcceptLeads: { type: Boolean, default: true },
      displayOpeningHours: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

UserSettingsSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const UserSettings =
  mongoose.models.UserSettings ||
  mongoose.model("UserSettings", UserSettingsSchema);

export default UserSettings;
