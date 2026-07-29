import mongoose from "mongoose";
import "@/models/Vendor";

const GallerySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Media asset must belong to a vendor"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      maxlength: 120,
    },
    folder: {
      type: String,
      enum: ["Store Interior", "Collections", "Offers", "Logo & Banners"],
      default: "Store Interior",
      index: true,
    },
    url: {
      type: String,
      required: [true, "Image URL/Data is required"],
    },
    size: {
      type: String,
      default: "1.5 MB",
    },
    compressed: {
      type: String,
      default: "300 KB",
    },
  },
  { timestamps: true },
);

GallerySchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
export default Gallery;
