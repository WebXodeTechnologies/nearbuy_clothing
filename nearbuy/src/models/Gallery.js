import mongoose from "mongoose";
import "@/models/Vendor";
import "@/models/User";

export const GALLERY_FOLDERS = [
  "Men's Collection",
  "Women's Wear",
  "Kids & Teens",
  "Ethnic & Traditional",
  "Western & Streetwear",
  "Storefront & Ambience",
  "Offers & Promotional",
  // Legacy / fallback folders
  "Storefront",
  "Display Photos",
  "Promotional",
  "Store Interior",
  "Collections",
  "Offers",
  "Logo & Banners",
];

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      default: "Shopper",
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

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
      enum: {
        values: GALLERY_FOLDERS,
        message: "{VALUE} is not a valid gallery folder",
      },
      default: "Women's Wear",
      index: true,
    },
    url: {
      type: String,
      required: [true, "Image URL/Data is required"],
    },
    price: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "1.5 MB",
    },
    compressed: {
      type: String,
      default: "300 KB",
    },

    // ❤️ Likes system (Array of User ObjectIds)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Comments system
    comments: [CommentSchema],
  },
  { timestamps: true },
);

GallerySchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

// 🔄 Force reload the model in Next.js development hot-reloading
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Gallery;
}

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default Gallery;
