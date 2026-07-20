const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// Inline Schemas for independent execution
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ["USER", "VENDOR", "ADMIN"], default: "USER" },
  phone: { type: String },
  isVerified: { type: Boolean, default: true },
}, { timestamps: true });

const vendorSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Suspended"], default: "Approved" },
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const storeSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const collectionSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  status: { type: Boolean, default: true },
}, { timestamps: true });

const offerSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  title: { type: String, required: true },
  code: { type: String, required: true },
  discountType: { type: String, enum: ["percentage", "flat"], default: "percentage" },
  discountValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: "/stores" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const cmsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);
const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
const CMS = mongoose.models.CMS || mongoose.model("CMS", cmsSchema);

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Category.deleteMany({});
    await Store.deleteMany({});
    await Collection.deleteMany({});
    await Offer.deleteMany({});
    await Banner.deleteMany({});
    await CMS.deleteMany({});

    console.log("Seeding Users...");
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@nearbuy.com",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+919876543210",
      isVerified: true,
    });

    const vendorUser = await User.create({
      name: "Rohan Sen",
      email: "vendor@urbanthreads.com",
      password: hashedPassword,
      role: "VENDOR",
      phone: "+919812345678",
      isVerified: true,
    });

    const customerUser = await User.create({
      name: "Priya Sharma",
      email: "priya@gmail.com",
      password: hashedPassword,
      role: "USER",
      phone: "+919823456789",
      isVerified: true,
    });

    console.log("Seeding Vendor Profile...");
    const vendorProfile = await Vendor.create({
      ownerId: vendorUser._id,
      businessName: "Urban Threads Apparel Pvt Ltd",
      slug: "urban-threads-apparel",
      phone: "+919812345678",
      email: "vendor@urbanthreads.com",
      status: "Approved",
    });

    console.log("Seeding Categories...");
    const categories = await Category.insertMany([
      {
        name: "Men's Fashion",
        slug: "mens-fashion",
        description: "Designer shirts, trousers, jackets, and ethnic wear for men.",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        name: "Women's Ethnic",
        slug: "womens-ethnic",
        description: "Premium silk sarees, lehengas, and designer salwar suits.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        name: "Streetwear & Western",
        slug: "streetwear-western",
        description: "Trendy hoodies, denim jeans, oversized tees, and jackets.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
    ]);

    console.log("Seeding Store Listings...");
    const store1 = await Store.create({
      vendorId: vendorProfile._id,
      name: "Urban Threads Boutique",
      slug: "urban-threads-boutique-mumbai",
      description: "Premier boutique showcasing contemporary men's streetwear and fusion wear in Bandra West.",
      address: "Shop 14, Linking Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "+919812345678",
      whatsapp: "919812345678",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80",
      ],
      isActive: true,
    });

    console.log("Seeding Collections...");
    await Collection.insertMany([
      {
        vendorId: vendorProfile._id,
        storeId: store1._id,
        categoryId: categories[0]._id,
        title: "Summer Linen 2026",
        slug: "summer-linen-2026",
        description: "Lightweight breathable linen shirts and trousers crafted for hot summer days.",
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
        ],
        status: true,
      },
      {
        vendorId: vendorProfile._id,
        storeId: store1._id,
        categoryId: categories[2]._id,
        title: "Urban Oversized Hoodies",
        slug: "urban-oversized-hoodies",
        description: "Heavyweight 400 GSM fleece oversized hoodies in neutral minimalist tones.",
        images: [
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
        ],
        status: true,
      },
    ]);

    console.log("Seeding Promotional Offers...");
    await Offer.insertMany([
      {
        vendorId: vendorProfile._id,
        storeId: store1._id,
        title: "Monsoon Flat 20% Discount",
        code: "MONSOON20",
        discountType: "percentage",
        discountValue: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
      },
      {
        vendorId: vendorProfile._id,
        storeId: store1._id,
        title: "Flat ₹500 OFF on Orders Above ₹2500",
        code: "SAVE500",
        discountType: "flat",
        discountValue: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);

    console.log("Seeding Banners...");
    await Banner.insertMany([
      {
        title: "Discover Local Boutique Stores Near You",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
        linkUrl: "/stores",
        isActive: true,
      },
    ]);

    console.log("Seeding CMS Pages...");
    await CMS.insertMany([
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "Nearbuy Privacy Policy details data protection and customer privacy rights.",
      },
      {
        title: "Terms & Conditions",
        slug: "terms",
        content: "Terms of service governing merchant store listings and consumer walk-ins.",
      },
    ]);

    console.log("\n✅ MongoDB Database Seeded Successfully!");
    console.log("-----------------------------------------");
    console.log("Admin Login:    admin@nearbuy.com / Password123!");
    console.log("Vendor Login:   vendor@urbanthreads.com / Password123!");
    console.log("Customer Login: priya@gmail.com / Password123!");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
}

seedDatabase();
