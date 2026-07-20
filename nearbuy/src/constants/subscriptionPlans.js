/**
 * Vendor subscription tier definitions
 */
export const SUBSCRIPTION_PLANS = {
  FREE: "FREE",
  SILVER: "SILVER",
  GOLD: "GOLD",
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
};

export const PLAN_DETAILS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    id: "FREE",
    name: "Starter Merchant",
    price: 0,
    currency: "INR",
    billingInterval: "month",
    maxStores: 1,
    maxCollections: 3,
    maxOffers: 2,
    badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
    features: [
      "1 Store Listing",
      "3 Seasonal Lookbooks",
      "2 Active Offers",
      "Basic Traffic Stats",
    ],
  },
  [SUBSCRIPTION_PLANS.SILVER]: {
    id: "SILVER",
    name: "Silver Growth Tier",
    price: 999,
    currency: "INR",
    billingInterval: "month",
    maxStores: 3,
    maxCollections: 15,
    maxOffers: 10,
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    features: [
      "Up to 3 Store Outlets",
      "15 Seasonal Lookbooks",
      "10 Active Offers",
      "WhatsApp & Map Click Leads",
      "Priority Listing Rank",
    ],
  },
  [SUBSCRIPTION_PLANS.GOLD]: {
    id: "GOLD",
    name: "Gold Unlimited Pro",
    price: 2499,
    currency: "INR",
    billingInterval: "month",
    maxStores: 10,
    maxCollections: 100,
    maxOffers: 50,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    features: [
      "Up to 10 Store Outlets",
      "100 Lookbooks & Galleries",
      "50 Active Offers",
      "Advanced Lead Analytics",
      "Featured Homepage Spotlights",
      "24/7 Priority Support",
    ],
  },
};

export default SUBSCRIPTION_PLANS;
