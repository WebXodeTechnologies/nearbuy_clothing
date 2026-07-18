// High-fidelity mock data for Nearby Clothing hyperlocal listing platform

export const categories = [
  {
    id: "cat-1",
    name: "Men's Wear",
    slug: "mens-wear",
    image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=600&q=80",
    icon: "MensWearIcon",
    count: 14,
    description: "Classic suits, casual shirts, denim, and activewear for men."
  },
  {
    id: "cat-2",
    name: "Women's Wear",
    slug: "womens-wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    icon: "WomensWearIcon",
    count: 28,
    description: "Dresses, tops, workwear, and trendsetting styles for women."
  },
  {
    id: "cat-3",
    name: "Kids Wear",
    slug: "kids-wear",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80",
    icon: "KidsWearIcon",
    count: 8,
    description: "Comfortable and playful apparel for toddlers and teens."
  },
  {
    id: "cat-4",
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    icon: "EthnicWearIcon",
    count: 12,
    description: "Traditional sherwanis, sarees, lehengas, and festive outfits."
  },
  {
    id: "cat-5",
    name: "Boutique",
    slug: "boutique",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    icon: "BoutiqueIcon",
    count: 6,
    description: "Designer labels, custom-tailored apparel, and unique collections."
  },
  {
    id: "cat-6",
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    icon: "FootwearIcon",
    count: 9,
    description: "Sneakers, formal shoes, sandals, and luxury heels."
  },
  {
    id: "cat-7",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    icon: "AccessoriesIcon",
    count: 11,
    description: "Bags, belts, sunglasses, and curated jewelry to complete the look."
  }
];

export const stores = [
  {
    id: "store-1",
    name: "Urban Threads Boutique",
    slug: "urban-threads-boutique",
    logo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&h=200&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80",
    description: "Your go-to spot for modern street fashion and premium casuals in Indiranagar. We offer custom fittings and curated designer drops weekly.",
    rating: 4.8,
    reviewsCount: 142,
    categories: ["Men's Wear", "Women's Wear", "Boutique"],
    location: "Indiranagar, Bangalore",
    address: "742, 100 Feet Road, Indiranagar, Bangalore, Karnataka 560038",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    hours: "10:30 AM - 09:30 PM",
    isFeatured: true,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973412708453!2d77.63851571482204!3d12.971891590855848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a629633e89%3A0xb697fa297593c6f2!2sIndiranagar!5e0!3m2!1sen!2sin!4v1625480000000!5m2!1sen!2sin",
    gallery: [
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80"
    ],
    collections: [
      {
        id: "coll-1-1",
        name: "Summer Linen Collection",
        description: "Lightweight, breathable linen shirts and trousers in pastel shades.",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      },
      {
        id: "coll-1-2",
        name: "Urban Streetwear v3",
        description: "Oversized graphic tees, cargo pants, and distressed denim garments.",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      }
    ],
    offers: [
      {
        id: "off-1-1",
        name: "End of Season Sale",
        discount: "Flat 20% Off",
        validUntil: "2026-07-31",
        status: "Active",
        terms: "Applicable on a minimum purchase value of ₹2,999."
      },
      {
        id: "off-1-2",
        name: "Monsoon Treat",
        discount: "Buy 2 Get 1 Free",
        validUntil: "2026-07-15",
        status: "Active",
        terms: "Applicable on Selected T-shirts and Shirts."
      }
    ]
  },
  {
    id: "store-2",
    name: "Ethnic Elegance",
    slug: "ethnic-elegance",
    logo: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&h=200&q=80",
    banner: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&h=400&q=80",
    description: "Premium ethnic and wedding wear collections. Explore silk sarees, designer lehengas, and hand-embroidered sherwanis crafted by master artisans.",
    rating: 4.9,
    reviewsCount: 312,
    categories: ["Ethnic Wear", "Boutique"],
    location: "Commercial Street, Bangalore",
    address: "89, Commercial Street, Tasker Town, Shivaji Nagar, Bangalore, Karnataka 560001",
    phone: "+91 98765 43211",
    whatsapp: "919876543211",
    hours: "11:00 AM - 09:00 PM",
    isFeatured: true,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.892019488349!2d77.60742131482207!3d12.978809590851371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae166299b9cf99%3A0xc3f6bc9015c7e153!2sCommercial%20St!5e0!3m2!1sen!2sin!4v1625480100000!5m2!1sen!2sin",
    gallery: [
      "https://images.unsplash.com/photo-1610030470298-4c60a9254cc9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    ],
    collections: [
      {
        id: "coll-2-1",
        name: "Royal Bridal Wardrobe",
        description: "Exquisite hand-woven Banarasi and Kanjeevaram silk sarees.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      }
    ],
    offers: [
      {
        id: "off-2-1",
        name: "Bridal Booking Offer",
        discount: "Flat 10% Off on Lehengas",
        validUntil: "2026-08-15",
        status: "Active",
        terms: "Valid on orders above ₹15,000. Book appointment on WhatsApp."
      }
    ]
  },
  {
    id: "store-3",
    name: "Apex Footwear & Co.",
    slug: "apex-footwear-co",
    logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&h=200&q=80",
    banner: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&h=400&q=80",
    description: "Step into style with the most complete footwear catalog in town. From athletic running shoes to elegant leather formals and accessories.",
    rating: 4.5,
    reviewsCount: 84,
    categories: ["Footwear", "Accessories"],
    location: "Koramangala, Bangalore",
    address: "24, 80 Feet Road, 4th Block, Koramangala, Bangalore, Karnataka 560034",
    phone: "+91 98765 43212",
    whatsapp: "919876543212",
    hours: "10:00 AM - 10:00 PM",
    isFeatured: false,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.312151608467!2d77.62252191482181!3d12.934891590880302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae144e3e3b333b%3A0xc3b86062f6b864d!2sKoramangala!5e0!3m2!1sen!2sin!4v1625480200000!5m2!1sen!2sin",
    gallery: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
    ],
    collections: [
      {
        id: "coll-3-1",
        name: "Active Comfort Sneakers",
        description: "High-performance walking and running shoes with orthopedic sole cushions.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      }
    ],
    offers: [
      {
        id: "off-3-1",
        name: "Exchange Bonanza",
        discount: "Get Up to ₹1,000 Off",
        validUntil: "2026-07-25",
        status: "Active",
        terms: "Bring any old pair of shoes in wearable condition to claim discount."
      }
    ]
  },
  {
    id: "store-4",
    name: "Tiny Tots & Teens",
    slug: "tiny-tots-teens",
    logo: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=200&h=200&q=80",
    banner: "https://images.unsplash.com/photo-1471286174240-e6458e7b3044?auto=format&fit=crop&w=1200&h=400&q=80",
    description: "Cute, soft, and durable clothing items for your little ones. We stock organic cotton wear and school uniforms alongside fashionable party dresses.",
    rating: 4.6,
    reviewsCount: 56,
    categories: ["Kids Wear"],
    location: "Jayanagar, Bangalore",
    address: "321, 11th Main Rd, 3rd Block, Jayanagar, Bangalore, Karnataka 560011",
    phone: "+91 98765 43213",
    whatsapp: "919876543213",
    hours: "10:00 AM - 08:30 PM",
    isFeatured: false,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.583120152504!2d77.58000000000001!3d12.918000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae150821d3f9e9%3A0xc3f6bc9015c7e153!2sJayanagar!5e0!3m2!1sen!2sin!4v1625480300000!5m2!1sen!2sin",
    gallery: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"
    ],
    collections: [
      {
        id: "coll-4-1",
        name: "Playground Activewear",
        description: "Durable cotton dungarees, sweatpants, and tees for outdoor games.",
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      }
    ],
    offers: [
      {
        id: "off-4-1",
        name: "Back to School Special",
        discount: "Flat 15% Off on Combos",
        validUntil: "2026-07-20",
        status: "Active",
        terms: "Buy 3 school essentials to activate discount."
      }
    ]
  },
  {
    id: "store-5",
    name: "Vogue Studio",
    slug: "vogue-studio",
    logo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&h=200&q=80",
    banner: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80",
    description: "Step up your style with curated items from designers globally. From workwear trousers to glamourous evening gowns, Vogue Studio is the ultimate women's fashion store.",
    rating: 4.7,
    reviewsCount: 198,
    categories: ["Women's Wear", "Boutique", "Accessories"],
    location: "Indiranagar, Bangalore",
    address: "24, Indiranagar Double Rd, Eshwara Layout, Indiranagar, Bangalore, Karnataka 560038",
    phone: "+91 98765 43214",
    whatsapp: "919876543214",
    hours: "11:00 AM - 09:30 PM",
    isFeatured: true,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973412708453!2d77.63851571482204!3d12.971891590855848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a629633e89%3A0xb697fa297593c6f2!2sIndiranagar!5e0!3m2!1sen!2sin!4v1625480000000!5m2!1sen!2sin",
    gallery: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80"
    ],
    collections: [
      {
        id: "coll-5-1",
        name: "Classic Corporate Wear",
        description: "Structured blazers, sharp pencil skirts, and comfortable formal blouses.",
        image: "https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      }
    ],
    offers: [
      {
        id: "off-5-1",
        name: "Corporate Exclusive",
        discount: "Flat 15% Off",
        validUntil: "2026-08-30",
        status: "Active",
        terms: "Show your company ID card at the billing counter to claim."
      }
    ]
  },
  {
    id: "store-6",
    name: "Classic Gentleman",
    slug: "classic-gentleman",
    logo: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=200&h=200&q=80",
    banner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=400&q=80",
    description: "Finely tailored bespoke suits, custom tuxedos, cufflinks, and accessories. Experience absolute luxury in traditional gentleman wear.",
    rating: 4.9,
    reviewsCount: 78,
    categories: ["Men's Wear", "Boutique"],
    location: "Commercial Street, Bangalore",
    address: "41, Commercial St, Shivaji Nagar, Bengaluru, Karnataka 560001",
    phone: "+91 98765 43215",
    whatsapp: "919876543215",
    hours: "10:30 AM - 08:30 PM",
    isFeatured: false,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.892019488349!2d77.60742131482207!3d12.978809590851371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae166299b9cf99%3A0xc3f6bc9015c7e153!2sCommercial%20St!5e0!3m2!1sen!2sin!4v1625480100000!5m2!1sen!2sin",
    gallery: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80"
    ],
    collections: [
      {
        id: "coll-6-1",
        name: "Savile Row Tailoring",
        description: "Three-piece woolen suits crafted with customized fabric imports.",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80",
        status: "Active"
      }
    ],
    offers: [
      {
        id: "off-6-1",
        name: "Complementary Monogramming",
        discount: "Free Monogram on Custom Shirt",
        validUntil: "2026-12-31",
        status: "Active",
        terms: "Applicable on tailoring bookings over ₹5,000."
      }
    ]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rohan Malhotra",
    role: "Regular Shopper",
    text: "Nearby Clothing has changed how I shop. Instead of ordering online and waiting for returns because of size issues, I discovered two local boutiques in Indiranagar. I can walk in, try them on, and support local shops directly!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Fashion Blogger",
    text: "The directory layouts and offer listings are incredibly accurate. Found some amazing handloom sarees during a monsoon sale in Shivaji Nagar, thanks to Ethnic Elegance's current offers listing here.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    id: 3,
    name: "Vikram R.",
    role: "Store Owner, Urban Threads",
    text: "As a vendor, my footfall has increased by 35% since list-making on Nearby Clothing. Customers frequently show us our offers on their phones that they discovered through the platform. Extremely recommended!",
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
    answer: "We offer a Free Trial tier for new stores. Advanced features like Featured Listings, running multiple active offers, custom banners, and priority support require one of our budget-friendly subscription plans (Silver, Gold, or Platinum)."
  }
];

export const plans = [
  {
    name: "Starter",
    price: "₹499",
    period: "month",
    description: "Ideal for new and micro local boutiques digitizing their storefront.",
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

export const locations = ["All Locations", "Indiranagar, Bangalore", "Commercial Street, Bangalore", "Koramangala, Bangalore", "Jayanagar, Bangalore"];

// Helper function to simulate vendor database state
export const initialVendorStore = {
  name: "Urban Threads Boutique",
  logo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&h=200&q=80",
  banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80",
  description: "Your go-to spot for modern street fashion and premium casuals in Indiranagar.",
  location: "Indiranagar, Bangalore",
  address: "742, 100 Feet Road, Indiranagar, Bangalore, Karnataka 560038",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  hours: "10:30 AM - 09:30 PM",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973412708453!2d77.63851571482204!3d12.971891590855848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a629633e89%3A0xb697fa297593c6f2!2sIndiranagar!5e0!3m2!1sen!2sin!4v1625480000000!5m2!1sen!2sin",
  categories: ["Men's Wear", "Women's Wear"]
};

export const adminStats = {
  totalVendors: 48,
  pendingApprovals: 6,
  totalStores: 52,
  activeSubscriptions: 34,
  monthlyRevenue: "₹68,500",
  recentVendors: [
    { id: "v-1", name: "Mukesh Patel", email: "mukesh@ethnicworld.com", storeName: "Ethnic World", date: "2026-07-03", status: "Pending", plan: "Silver" },
    { id: "v-2", name: "Sanjana Roy", email: "sanjana@voguish.in", storeName: "Voguish Club", date: "2026-07-02", status: "Approved", plan: "Gold" },
    { id: "v-3", name: "David Miller", email: "david@dapperfoot.com", storeName: "Dapper Footwear", date: "2026-07-02", status: "Approved", plan: "Free" },
    { id: "v-4", name: "Kunal Sen", email: "kunal@kidszone.com", storeName: "Kids Zone Boutique", date: "2026-06-30", status: "Pending", plan: "Silver" },
    { id: "v-5", name: "Priya Nair", email: "priya@chicwardrobe.com", storeName: "Chic Wardrobe", date: "2026-06-28", status: "Suspended", plan: "Free" }
  ],
  recentStores: [
    { id: "s-1", name: "Ethnic World", owner: "Mukesh Patel", location: "Jayanagar, Bangalore", isFeatured: false, status: "Draft" },
    { id: "s-2", name: "Voguish Club", owner: "Sanjana Roy", location: "Koramangala, Bangalore", isFeatured: true, status: "Published" },
    { id: "s-3", name: "Dapper Footwear", owner: "David Miller", location: "MG Road, Bangalore", isFeatured: false, status: "Published" },
    { id: "s-4", name: "Kids Zone Boutique", owner: "Kunal Sen", location: "Indiranagar, Bangalore", isFeatured: false, status: "Draft" }
  ],
  contactEnquiries: [
    { id: "e-1", name: "Amit Kumar", email: "amit.k@gmail.com", subject: "Listing fees query", message: "Hi, I have three branches of my footwear store in Bangalore. Is there a custom plan available for multiple store listings?", date: "2026-07-03", status: "Unread" },
    { id: "e-2", name: "Preeti Desai", email: "preeti@glowboutique.com", subject: "Featured badge inquiry", message: "Hello, we upgraded to the Gold plan yesterday but our store is not showing on the homepage featured section yet. Please assist.", date: "2026-07-02", status: "Replied" },
    { id: "e-3", name: "Rajesh Hegde", email: "rajesh@hegdeapparel.com", subject: "Partnership opportunity", message: "Hello, I am interested in exploring brand partnerships. Let me know whom to contact.", date: "2026-06-29", status: "Unread" }
  ]
};
