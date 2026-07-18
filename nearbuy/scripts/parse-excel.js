const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(__dirname, '..', 'nearbuy.xlsx');
const wb = XLSX.readFile(excelPath);

const storeMap = new Map();

const sheetCategoryMap = {
  'Mens': "Men's Wear",
  'Womens': "Women's Wear",
  'Kids': "Kids Wear"
};

const namakkalLocations = [
  "Salem Road, Namakkal",
  "Mohanur Road, Namakkal",
  "Trichengode Road, Namakkal",
  "Paramathi Road, Namakkal",
  "Park Road, Namakkal",
  "R.P Pudur, Namakkal",
  "Bus Stand Area, Namakkal"
];

const bannerImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1471286174240-e6458e7b3044?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=400&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&h=400&q=80"
];

const logoImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=200&h=200&q=80"
];

wb.SheetNames.forEach(sheet => {
  const defaultCat = sheetCategoryMap[sheet];
  const ws = wb.Sheets[sheet];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
  rows.forEach(r => {
    if (r && r[0] && typeof r[0] === 'string') {
      const storeName = r[0].trim();
      if (!storeName) return;

      if (!storeMap.has(storeName)) {
        storeMap.set(storeName, {
          name: storeName,
          categories: new Set()
        });
      }

      const storeObj = storeMap.get(storeName);
      if (defaultCat) storeObj.categories.add(defaultCat);

      // Check for ethnic / boutique / silk keywords in store name
      const nameLower = storeName.toLowerCase();
      if (nameLower.includes('boutique') || nameLower.includes('designer') || nameLower.includes('studio')) {
        storeObj.categories.add('Boutique');
      }
      if (nameLower.includes('silk') || nameLower.includes('saree') || nameLower.includes('ethnic') || nameLower.includes('bridal') || nameLower.includes('tradition')) {
        storeObj.categories.add('Ethnic Wear');
      }
      if (nameLower.includes('footwear') || nameLower.includes('shoe')) {
        storeObj.categories.add('Footwear');
      }
      if (nameLower.includes('accessory') || nameLower.includes('fancy') || nameLower.includes('matching')) {
        storeObj.categories.add('Accessories');
      }

      if (r[1] && typeof r[1] === 'string') {
        const extra = r[1].trim().toLowerCase();
        if (extra.includes('accessory') || extra.includes('accessories')) {
          storeObj.categories.add('Accessories');
        }
      }
    }
  });
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.435749114321!2d78.16335121480436!3d11.218942292022436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babce0415a770a9%3A0xc6fb0e02eb7f59a3!2sNamakkal%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1625480000000!5m2!1sen!2sin";

let index = 1;
const storesList = [];

for (const [name, data] of storeMap.entries()) {
  const cats = Array.from(data.categories);
  if (cats.length === 0) cats.push("Men's Wear");

  let loc = namakkalLocations[(index - 1) % namakkalLocations.length];
  if (name.toLowerCase().includes('r.p pudur') || name.toLowerCase().includes('pudur')) {
    loc = "R.P Pudur, Namakkal";
  } else if (name.toLowerCase().includes('salem road')) {
    loc = "Salem Road, Namakkal";
  }

  const rating = parseFloat((4.3 + (index * 0.17) % 0.65).toFixed(1));
  const reviewsCount = 35 + ((index * 23) % 240);
  const isFeatured = index <= 12 || name.toLowerCase().includes('unlimited') || name.toLowerCase().includes('trends') || name.toLowerCase().includes('arrs') || name.toLowerCase().includes('louis');

  storesList.push({
    id: `store-${index}`,
    name: name,
    slug: slugify(name) || `store-${index}`,
    logo: logoImages[(index - 1) % logoImages.length],
    banner: bannerImages[(index - 1) % bannerImages.length],
    description: `Explore exclusive clothing collections, traditional apparel, and contemporary styles at ${name} in ${loc}. Visit store for walk-in discounts and fitting services.`,
    rating: rating,
    reviewsCount: reviewsCount,
    categories: cats,
    location: loc,
    address: `${10 + index}, ${loc.split(',')[0]}, Namakkal, Tamil Nadu 637001`,
    phone: `+91 ${9800000000 + (index * 123456) % 90000000}`,
    whatsapp: `91${9800000000 + (index * 123456) % 90000000}`,
    hours: "10:00 AM - 09:30 PM",
    isFeatured: isFeatured,
    mapEmbedUrl: mapEmbedUrl,
    gallery: [
      bannerImages[(index) % bannerImages.length],
      bannerImages[(index + 1) % bannerImages.length]
    ],
    collections: [
      {
        id: `coll-${index}-1`,
        name: "New Festive & Seasonal Arrival",
        description: `Handpicked clothing range available at ${name}.`,
        image: bannerImages[(index) % bannerImages.length],
        status: "Active"
      }
    ],
    offers: [
      {
        id: `off-${index}-1`,
        name: "Walk-in Special Offer",
        discount: isFeatured ? "Flat 20% Off" : "Up to 15% Off",
        validUntil: "2026-08-31",
        status: "Active",
        terms: "Show offer badge at billing counter to claim discount."
      }
    ]
  });

  index++;
}

console.log(`Generated ${storesList.length} store items from nearbuy.xlsx`);

// Output JS code file to update dummy-data.js
const dummyDataJs = `// High-fidelity mock data for Nearby Clothing hyperlocal listing platform localized for Namakkal

export const categories = [
  {
    id: "cat-1",
    name: "Men's Wear",
    slug: "mens-wear",
    image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=600&q=80",
    icon: "MensWearIcon",
    count: ${storesList.filter(s => s.categories.includes("Men's Wear")).length},
    description: "Classic suits, casual shirts, denim, and activewear for men."
  },
  {
    id: "cat-2",
    name: "Women's Wear",
    slug: "womens-wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: "WomensWearIcon",
    count: ${storesList.filter(s => s.categories.includes("Women's Wear")).length},
    description: "Dresses, tops, workwear, and trendsetting styles for women."
  },
  {
    id: "cat-3",
    name: "Kids Wear",
    slug: "kids-wear",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80",
    icon: "KidsWearIcon",
    count: ${storesList.filter(s => s.categories.includes("Kids Wear")).length},
    description: "Comfortable and playful apparel for toddlers and teens."
  },
  {
    id: "cat-4",
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    icon: "EthnicWearIcon",
    count: ${storesList.filter(s => s.categories.includes("Ethnic Wear")).length},
    description: "Traditional sherwanis, silk sarees, lehengas, and festive outfits."
  },
  {
    id: "cat-5",
    name: "Boutique",
    slug: "boutique",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    icon: "BoutiqueIcon",
    count: ${storesList.filter(s => s.categories.includes("Boutique")).length},
    description: "Designer labels, custom-tailored apparel, and unique collections."
  },
  {
    id: "cat-6",
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    icon: "FootwearIcon",
    count: ${storesList.filter(s => s.categories.includes("Footwear")).length},
    description: "Sneakers, formal shoes, sandals, and luxury heels."
  },
  {
    id: "cat-7",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    icon: "AccessoriesIcon",
    count: ${storesList.filter(s => s.categories.includes("Accessories")).length},
    description: "Bags, belts, sunglasses, and curated jewelry to complete the look."
  }
];

export const stores = ${JSON.stringify(storesList, null, 2)};

export const testimonials = [
  {
    id: 1,
    name: "Rohan Malhotra",
    role: "Regular Shopper",
    text: "Nearby Clothing has changed how I shop in Namakkal. Instead of ordering online and waiting for returns because of size issues, I discovered boutiques like Hunter Mens & Bivol on Salem Road. I can walk in, try them on, and support local shops directly!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Fashion Blogger",
    text: "The directory layouts and offer listings are incredibly accurate. Found some amazing handloom sarees during a festive sale at ARRS SILKS & PSR Silk Sarees in Namakkal, thanks to current offers listed here.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    name: "Vikram R.",
    role: "Store Owner, Unlimited Fashion Store",
    text: "As a vendor in Namakkal R.P Pudur, our footfall has increased by 35% since listing on Nearby Clothing. Customers frequently show us our offers on their phones that they discovered through the platform. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export const faqs = [
  {
    question: "Is Nearby Clothing an e-commerce website?",
    answer: "No, Nearby Clothing is a hyperlocal business directory. You cannot buy clothing directly on our website. Instead, you can discover local stores in your neighborhood, browse their latest collections, view current discounts, and visit their physical stores to purchase."
  },
  {
    question: "How do I contact a vendor?",
    answer: "Each store detail page features contact numbers, complete address, operational hours, an interactive Google map locator, and a direct 'WhatsApp Inquiry' link that lets you chat directly with the store owner."
  },
  {
    question: "How do vendors post their offers?",
    answer: "Store owners register as vendors and gain access to a dedicated Vendor Dashboard. Through the dashboard, they can upload store profile banners, publish latest collections, run custom offers, and track visitor views."
  },
  {
    question: "Is listing my store free?",
    answer: "We offer a Free Trial tier for new stores. Advanced features like Featured Listings, running multiple active offers, custom banners, and priority support require one of our budget-friendly subscription plans (Starter, Growth, or Pro)."
  }
];

export const plans = [
  {
    name: "Starter",
    price: "₹499",
    period: "month",
    description: "Ideal for new and micro local boutiques digitizing their storefront in Namakkal.",
    features: [
      "1 Store Listing",
      "Up to 5 Catalog Products",
      "Basic Profile & Map Location",
      "Standard Directory Search",
      "WhatsApp & Direct Phone Contact"
    ],
    cta: "Start Starter Plan",
    popular: false
  },
  {
    name: "Growth",
    price: "₹999",
    period: "month",
    description: "Designed for active local brands seeking high local visibility and sales.",
    features: [
      "1 Store Listing",
      "Up to 20 Catalog Products",
      "Active Promotions & Offer Campaigns",
      "Gallery Showcase (up to 10 photos)",
      "Featured Badge in Category Search",
      "Basic Engagement Analytics",
      "Priority Email Support"
    ],
    cta: "Choose Growth Plan",
    popular: true
  },
  {
    name: "Pro",
    price: "₹1,999",
    period: "month",
    description: "Unlimited power and marketing tools for established clothing retail brands.",
    features: [
      "Up to 3 Store Outlets",
      "Unlimited Catalog Products & Collections",
      "Unlimited Active In-Store Offers",
      "Featured Badge on Homepage & Search",
      "Advanced Traffic Analytics (views & clicks)",
      "Priority Listing & Custom Banners",
      "1-on-1 Dedicated Account Manager"
    ],
    cta: "Choose Pro Plan",
    popular: false
  }
];

export const locations = [
  "All Locations",
  "Salem Road, Namakkal",
  "Mohanur Road, Namakkal",
  "Trichengode Road, Namakkal",
  "Paramathi Road, Namakkal",
  "Park Road, Namakkal",
  "R.P Pudur, Namakkal",
  "Bus Stand Area, Namakkal"
];

export const initialVendorStore = ${JSON.stringify(storesList[0], null, 2)};

export const adminStats = {
  totalVendors: ${storesList.length},
  pendingApprovals: 6,
  totalStores: ${storesList.length},
  activeSubscriptions: Math.floor(${storesList.length} * 0.7),
  monthlyRevenue: "₹68,500",
  recentVendors: [
    { id: "v-1", name: "Mukesh Patel", email: "mukesh@ethnicworld.com", storeName: "${storesList[0]?.name}", date: "2026-07-03", status: "Pending", plan: "Silver" },
    { id: "v-2", name: "Sanjana Roy", email: "sanjana@voguish.in", storeName: "${storesList[1]?.name}", date: "2026-07-02", status: "Approved", plan: "Gold" },
    { id: "v-3", name: "David Miller", email: "david@dapperfoot.com", storeName: "${storesList[2]?.name}", date: "2026-07-02", status: "Approved", plan: "Free" }
  ],
  recentStores: ${JSON.stringify(storesList.slice(0, 4).map(s => ({
    id: s.id,
    name: s.name,
    owner: "Store Owner",
    location: s.location,
    isFeatured: s.isFeatured,
    status: "Published"
  })), null, 2)},
  contactEnquiries: [
    { id: "e-1", name: "Amit Kumar", email: "amit.k@gmail.com", subject: "Listing fees query", message: "Hi, I have three branches of my footwear store in Namakkal. Is there a custom plan available for multiple store listings?", date: "2026-07-03", status: "Unread" }
  ]
};
`;

fs.writeFileSync(path.join(__dirname, '..', 'app', 'data', 'dummy-data.js'), dummyDataJs);
console.log('Successfully updated app/data/dummy-data.js with nearbuy.xlsx stores!');
