import Plan from "../src/models/Plan.js";

const plans = [
  {
    name: "FREE",
    slug: "free",
    description:
      "Perfect for small clothing stores getting started on Nearbuy.",

    price: 0,
    billingCycle: "Monthly",

    features: [
      "1 Store",
      "Basic Store Profile",
      "10 Collections",
      "5 Active Offers",
      "WhatsApp Button",
      "Basic Analytics",
    ],

    maxStores: 1,
    maxCollections: 10,
    maxOffers: 5,

    isFeatured: false,
    isActive: true,
    displayOrder: 1,
  },

  {
    name: "PREMIUM",
    slug: "premium",
    description: "Ideal for growing fashion retailers.",

    price: 999,
    billingCycle: "Monthly",

    features: [
      "3 Stores",
      "Unlimited Collections",
      "Unlimited Offers",
      "Featured Store Listing",
      "Premium Analytics",
      "Priority Support",
      "Social Media Links",
    ],

    maxStores: 3,
    maxCollections: -1,
    maxOffers: -1,

    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },

  {
    name: "ENTERPRISE",
    slug: "enterprise",
    description:
      "Best suited for brands with multiple branches and advanced requirements.",

    price: 2999,
    billingCycle: "Monthly",

    features: [
      "Unlimited Stores",
      "Unlimited Collections",
      "Unlimited Offers",
      "Featured Homepage Placement",
      "Advanced Analytics",
      "Dedicated Account Manager",
      "Priority Support",
      "Custom Branding",
      "API Access",
    ],

    maxStores: -1,
    maxCollections: -1,
    maxOffers: -1,

    isFeatured: false,
    isActive: true,
    displayOrder: 3,
  },
];

export default async function seedPlans() {
  try {
    console.log("📦 Seeding Plans...");

    await Plan.insertMany(plans);

    console.log(`✅ ${plans.length} plans inserted.`);
  } catch (error) {
    console.error("❌ Failed to seed plans");
    throw error;
  }
}
