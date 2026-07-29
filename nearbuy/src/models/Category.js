import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================

    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: 100,
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
      trim: true,
      default: "",
    },

    // ==========================================
    // Media
    // ==========================================

    icon: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
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

    // ==========================================
    // Display
    // ==========================================

    displayOrder: {
      type: Number,
      default: 1,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-validate hook to guarantee category slug
CategorySchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

// ==========================================
// Indexes
// ==========================================

CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });

// ==========================================
// Hide Internal Fields
// ==========================================

CategorySchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
