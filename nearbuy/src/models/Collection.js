import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    // ==========================================
    // Relationships
    // ==========================================

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
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
    // Search
    // ==========================================

    tags: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Display
    // ==========================================

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

    // ==========================================
    // Analytics
    // ==========================================

    totalViews: {
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

// ==========================================
// Indexes
// ==========================================

CollectionSchema.index({ vendorId: 1 });
CollectionSchema.index({ storeId: 1 });
CollectionSchema.index({ categoryIds: 1 });
CollectionSchema.index({ slug: 1 });
CollectionSchema.index({ isFeatured: 1 });
CollectionSchema.index({ isActive: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

CollectionSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Collection =
  mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);

export default Collection;
