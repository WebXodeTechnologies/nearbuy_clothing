export default async function sitemap() {
  const baseUrl = "https://streetunics.com";

  const staticRoutes = [
    "",
    "/about",
    "/stores",
    "/categories",
    "/become-vendor",
    "/pricing",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" || route === "/stores" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/stores" ? 0.9 : 0.8,
  }));

  return [...staticRoutes];
}
