import CMS from "../src/models/CMS.js";

const cmsPages = [
  {
    title: "About Us",
    slug: "about-us",
    content: `
      <h1>About Nearbuy</h1>
      <p>Nearbuy is a hyperlocal clothing discovery platform that helps customers discover nearby fashion stores, latest collections, and exclusive offers.</p>
    `,
    metaTitle: "About Nearbuy",
    metaDescription:
      "Learn more about Nearbuy and our mission to connect customers with local fashion stores.",
    isActive: true,
  },

  {
    title: "Contact Us",
    slug: "contact-us",
    content: `
      <h1>Contact Us</h1>
      <p>Need help? Reach out to our support team for any queries regarding Nearbuy.</p>
    `,
    metaTitle: "Contact Nearbuy",
    metaDescription:
      "Contact Nearbuy support for assistance regarding stores, vendors, and platform services.",
    isActive: true,
  },

  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: `
      <h1>Privacy Policy</h1>
      <p>Your privacy is important to us. This page explains how we collect, use, and protect your information.</p>
    `,
    metaTitle: "Privacy Policy",
    metaDescription:
      "Read Nearbuy's privacy policy and understand how your personal information is protected.",
    isActive: true,
  },

  {
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    content: `
      <h1>Terms & Conditions</h1>
      <p>Please read these terms carefully before using the Nearbuy platform.</p>
    `,
    metaTitle: "Terms & Conditions",
    metaDescription:
      "Read the terms and conditions for using the Nearbuy platform.",
    isActive: true,
  },

  {
    title: "Refund Policy",
    slug: "refund-policy",
    content: `
      <h1>Refund Policy</h1>
      <p>Subscription refunds are governed by the refund policy published by Nearbuy.</p>
    `,
    metaTitle: "Refund Policy",
    metaDescription:
      "Read Nearbuy's refund policy for subscription payments and cancellations.",
    isActive: true,
  },

  {
    title: "Frequently Asked Questions",
    slug: "faq",
    content: `
      <h1>Frequently Asked Questions</h1>
      <p>Find answers to common questions about Nearbuy, vendor subscriptions, stores, and offers.</p>
    `,
    metaTitle: "FAQ",
    metaDescription: "Frequently asked questions about Nearbuy.",
    isActive: true,
  },
];

export default async function seedCMS() {
  try {
    console.log("📄 Seeding CMS Pages...");

    await CMS.insertMany(cmsPages);

    console.log(`✅ ${cmsPages.length} CMS pages inserted.`);
  } catch (error) {
    console.error("❌ Failed to seed CMS pages");
    throw error;
  }
}
