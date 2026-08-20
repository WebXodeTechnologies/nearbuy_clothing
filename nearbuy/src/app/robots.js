export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/vendor/"],
      },
    ],
    sitemap: "https://streetunics.com/sitemap.xml",
  };
}
