import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

import dbConnect from "../src/lib/db.js";
import User from "../src/models/User.js";
import Vendor from "../src/models/Vendor.js";
import Store from "../src/models/Store.js";
import Collection from "../src/models/Collection.js";
import Offer from "../src/models/Offer.js";
import Category from "../src/models/Category.js";
import Banner from "../src/models/Banner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, "..", "src", "docs", "nearbuy.xlsx");

const sheetCategoryMap = {
  Mens: "Men's Wear",
  Womens: "Women's Wear",
  Kids: "Kids Wear",
};

const namakkalLocations = [
  "Salem Road, Namakkal",
  "Mohanur Road, Namakkal",
  "Trichengode Road, Namakkal",
  "Paramathi Road, Namakkal",
  "Park Road, Namakkal",
  "R.P Pudur, Namakkal",
  "Bus Stand Area, Namakkal",
];

const bannerImages = [
  "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?q=80&w=1740&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1471286174240-e6458e7b3044?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&h=400&q=80",
];

const logoImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=200&h=200&q=80",
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function seedExcelData() {
  try {
    console.log("🚀 Starting MongoDB Seeding from Excel...");
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    // Drop old deprecated unique indexes to prevent duplication errors
    await mongoose.connection.db
      .collection("vendors")
      .dropIndex("slug_1")
      .catch(() => {});
    await mongoose.connection.db
      .collection("stores")
      .dropIndex("slug_1")
      .catch(() => {});
    await mongoose.connection.db
      .collection("collections")
      .dropIndex("slug_1")
      .catch(() => {});
    await mongoose.connection.db
      .collection("offers")
      .dropIndex("slug_1")
      .catch(() => {});

    // Load active categories from DB
    const dbCategories = await Category.find({ isActive: true });
    const categoryNameToDoc = new Map();
    dbCategories.forEach((cat) => {
      categoryNameToDoc.set(cat.name.toLowerCase(), cat);
    });

    const categoryMap = {
      "men's wear": "men",
      "women's wear": "women",
      "kids' wear": "kids",
      "kids wear": "kids",
      "ethnic wear": "ethnic wear",
      boutique: "women",
      footwear: "footwear",
      accessories: "accessories",
    };

    const resolveCategoryIds = (catNames) => {
      const ids = [];
      catNames.forEach((name) => {
        const standardName = categoryMap[name.toLowerCase()] || name;
        const catDoc = categoryNameToDoc.get(standardName.toLowerCase());
        if (catDoc) {
          ids.push(catDoc._id);
        }
      });
      // Fallback if none found
      if (ids.length === 0) {
        const fallback = categoryNameToDoc.get("women");
        if (fallback) ids.push(fallback._id);
      }
      return ids;
    };

    // 1. Clear transactional records (except Super Admin)
    console.log("🗑 Cleaning existing database transactional data...");
    await Promise.all([
      User.deleteMany({ role: { $ne: "ADMIN" } }),
      Vendor.deleteMany({}),
      Store.deleteMany({}),
      Collection.deleteMany({}),
      Offer.deleteMany({}),
      Banner.deleteMany({}),
    ]);
    console.log("✅ Existing data cleared");

    // 2. Read spreadsheet
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Excel file not found at path: ${excelPath}`);
    }

    const wb = XLSX.readFile(excelPath);
    const storeMap = new Map();

    wb.SheetNames.forEach((sheet) => {
      const defaultCat = sheetCategoryMap[sheet];
      const ws = wb.Sheets[sheet];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

      rows.forEach((r) => {
        if (r && r[0] && typeof r[0] === "string") {
          const storeName = r[0].trim();
          if (!storeName) return;

          if (!storeMap.has(storeName)) {
            storeMap.set(storeName, {
              name: storeName,
              categories: new Set(),
            });
          }

          const storeObj = storeMap.get(storeName);
          if (defaultCat) storeObj.categories.add(defaultCat);

          const nameLower = storeName.toLowerCase();
          if (
            nameLower.includes("boutique") ||
            nameLower.includes("designer") ||
            nameLower.includes("studio")
          ) {
            storeObj.categories.add("Boutique");
          }
          if (
            nameLower.includes("silk") ||
            nameLower.includes("saree") ||
            nameLower.includes("ethnic") ||
            nameLower.includes("bridal") ||
            nameLower.includes("tradition")
          ) {
            storeObj.categories.add("Ethnic Wear");
          }
          if (nameLower.includes("footwear") || nameLower.includes("shoe")) {
            storeObj.categories.add("Footwear");
          }
          if (
            nameLower.includes("accessory") ||
            nameLower.includes("fancy") ||
            nameLower.includes("matching")
          ) {
            storeObj.categories.add("Accessories");
          }

          if (r[1] && typeof r[1] === "string") {
            const extra = r[1].trim().toLowerCase();
            if (extra.includes("accessory") || extra.includes("accessories")) {
              storeObj.categories.add("Accessories");
            }
          }
        }
      });
    });

    const storesList = [];
    let index = 1;

    for (const [name, data] of storeMap.entries()) {
      const cats = Array.from(data.categories);
      if (cats.length === 0) cats.push("Men's Wear");

      let loc = namakkalLocations[(index - 1) % namakkalLocations.length];
      if (
        name.toLowerCase().includes("r.p pudur") ||
        name.toLowerCase().includes("pudur")
      ) {
        loc = "R.P Pudur, Namakkal";
      } else if (name.toLowerCase().includes("salem road")) {
        loc = "Salem Road, Namakkal";
      }

      const isFeatured =
        index <= 12 ||
        name.toLowerCase().includes("unlimited") ||
        name.toLowerCase().includes("trends") ||
        name.toLowerCase().includes("arrs") ||
        name.toLowerCase().includes("louis");

      storesList.push({
        name,
        slug: slugify(name) || `store-${index}`,
        logo: logoImages[(index - 1) % logoImages.length],
        banner: bannerImages[(index - 1) % bannerImages.length],
        location: loc,
        categories: cats,
        isFeatured,
      });

      index++;
    }

    console.log(`📊 Parsed ${storesList.length} stores from Excel.`);

    // 3. Insert each store record into MongoDB
    console.log("🌱 Inserting records into MongoDB...");

    const passwordHash = await bcrypt.hash("Password123!", 12);

    // Seed a couple of default vendors
    // For others, we can do parallel inserts
    for (let i = 0; i < storesList.length; i++) {
      const s = storesList[i];
      const idx = i + 1;

      // Create user
      const email = `vendor.${s.slug}.${idx}@nearbuy.com`;
      const user = await User.create({
        name: `${s.name} Owner`,
        email,
        password: passwordHash,
        role: "VENDOR",
        phone: `+9198${(10000000 + idx * 47) % 100000000}`,
        isActive: true,
        isVerified: true,
      });

      // Create vendor profile
      const vendor = await Vendor.create({
        ownerId: user._id,
        businessName: s.name,
        businessSlug: `${s.slug}-${idx}`,
        phone: user.phone,
        email: user.email,
        logo: s.logo,
        coverImage: s.banner,
        status: "Approved",
        isActive: true,
        profileCompleted: true,
      });

      // Link vendor back to user
      user.vendorId = vendor._id;
      await user.save();

      // Resolve category ids
      const categoryIds = resolveCategoryIds(s.categories);

      // Create store location
      const store = await Store.create({
        vendorId: vendor._id,
        storeName: s.name,
        storeSlug: `${s.slug}-outlet-${idx}`,
        description: `Explore exclusive clothing collections, traditional apparel, and contemporary styles at ${s.name} in ${s.location}. Visit store for walk-in discounts and fitting services.`,
        logo: s.logo,
        coverImage: s.banner,
        gallery: [
          bannerImages[idx % bannerImages.length],
          bannerImages[(idx + 1) % bannerImages.length],
        ],
        address: `${10 + idx}, ${s.location.split(",")[0]}, Namakkal, Tamil Nadu 637001`,
        city: "Namakkal",
        phone: user.phone,
        whatsapp: `91${user.phone.replace("+91", "")}`,
        email: user.email,
        openingTime: "10:00 AM",
        closingTime: "09:30 PM",
        workingDays: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        isFeatured: s.isFeatured,
        isActive: true,
        profileCompleted: true,
        categoryIds,
      });

      // Create collection lookbook
      await Collection.create({
        vendorId: vendor._id,
        storeId: store._id,
        categoryIds,
        title: "New Festive & Seasonal Arrival",
        slug: `${s.slug}-festive-arrival-${idx}`,
        description: `Handpicked clothing range available at ${s.name}.`,
        coverImage: s.banner,
        images: [s.banner],
        isActive: true,
      });

      // Create offer coupons
      await Offer.create({
        vendorId: vendor._id,
        storeId: store._id,
        title: "Walk-in Special Offer",
        slug: `${s.slug}-walk-in-special-${idx}`,
        description: "Show offer badge at billing counter to claim discount.",
        bannerImage: s.banner,
        discountType: "PERCENTAGE",
        discountValue: s.isFeatured ? 20 : 15,
        startDate: new Date(),
        endDate: new Date("2027-12-31"),
        isActive: true,
      });

      // Seed a few homepage featured banners
      if (s.isFeatured && idx <= 5) {
        await Banner.create({
          title: `Discover ${s.name} in Namakkal`,
          subtitle: "Explore premium fashion collections nearby",
          description: `Exclusive walk-in discounts up to ${s.isFeatured ? "20%" : "15%"} off.`,
          image: s.banner,
          buttonText: "Browse Store",
          buttonLink: `/stores/${s.slug}`,
          bannerType: "HOME_HERO",
          isActive: true,
          displayOrder: idx,
        });
      }
    }

    console.log(
      `\n🎉 Successfully Seeded all ${storesList.length} store items and related entities into MongoDB!`,
    );
    console.log("-----------------------------------------");
    console.log("Admin Account:   admin@nearbuy.com / Admin@123456");
    console.log(
      "Vendor Account:  vendor.hunter-mens@nearbuy.com / Password123!",
    );
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("\n❌ Seeding Failed:\n");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected");
  }
}

seedExcelData();
