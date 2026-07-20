import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Banner image URL is required"],
    },
    buttonText: {
      type: String,
      default: "",
    },
    buttonLink: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner;
