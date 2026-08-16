import mongoose from "mongoose";
import "@/models/Vendor";
import "@/models/Store";
import "@/models/Category";

const CollectionSchema = new mongoose.Schema(
  {
    // ==========================================
    // Relationships
    // ==========================================

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Collection must belong to a Vendor profile"],
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Collection must belong to a Store"],
      index: true,
    },

    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // ==========================================
    // Collection Information
    // ==========================================

    title: {
      type: String,
      required: [true, "Collection title is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // Media
    // ==========================================

    coverImage: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Search & Status
    // ==========================================

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: Boolean,
      default: true, // true = In Stock / Available in Shop
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ==========================================
    // Analytics
    // ==========================================

    totalViews: {
      type: Number,
      default: 0,
    },

    totalWhatsappClicks: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // SEO
    // ==========================================

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Pre-validate hook for auto slug generation
CollectionSchema.pre("validate", function () {
  if (!this.slug || this.slug.trim() === "") {
    const baseName = this.title || "collection";
    this.slug =
      baseName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.floor(Math.random() * 10000);
  }
});

// ==========================================
// Indexes
// ==========================================

CollectionSchema.index({ vendorId: 1 });
CollectionSchema.index({ storeId: 1 });
CollectionSchema.index({ categoryIds: 1 });
CollectionSchema.index({ slug: 1 });
CollectionSchema.index({ isFeatured: 1 });
CollectionSchema.index({ isActive: 1 });

CollectionSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Collection =
  mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);

export default Collection;
