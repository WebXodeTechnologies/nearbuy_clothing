import Category from "../src/models/Category.js";

const categories = [
  {
    name: "Men",
    slug: "men",
    description: "Men's fashion and apparel",
    icon: "Shirt",
    image: "/images/categories/men.jpg",
    isFeatured: true,
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Women",
    slug: "women",
    description: "Women's fashion and ethnic wear",
    icon: "Sparkles",
    image: "/images/categories/women.jpg",
    isFeatured: true,
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Kids",
    slug: "kids",
    description: "Kids clothing and accessories",
    icon: "Baby",
    image: "/images/categories/kids.jpg",
    isFeatured: true,
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Shoes, sandals and sneakers",
    icon: "Footprints",
    image: "/images/categories/footwear.jpg",
    isFeatured: false,
    displayOrder: 4,
    isActive: true,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Bags, watches, belts and more",
    icon: "ShoppingBag",
    image: "/images/categories/accessories.jpg",
    isFeatured: false,
    displayOrder: 5,
    isActive: true,
  },
  {
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    description: "Traditional and festive wear",
    icon: "Gem",
    image: "/images/categories/ethnic.jpg",
    isFeatured: true,
    displayOrder: 6,
    isActive: true,
  },
  {
    name: "Western Wear",
    slug: "western-wear",
    description: "Modern western outfits",
    icon: "Star",
    image: "/images/categories/western.jpg",
    isFeatured: false,
    displayOrder: 7,
    isActive: true,
  },
  {
    name: "Sportswear",
    slug: "sportswear",
    description: "Sports and active lifestyle clothing",
    icon: "Dumbbell",
    image: "/images/categories/sports.jpg",
    isFeatured: false,
    displayOrder: 8,
    isActive: true,
  },
];

export default async function seedCategories() {
  try {
    console.log("📂 Seeding Categories...");

    await Category.insertMany(categories);

    console.log(`✅ ${categories.length} categories inserted.`);
  } catch (error) {
    console.error("❌ Failed to seed categories");
    throw error;
  }
}
