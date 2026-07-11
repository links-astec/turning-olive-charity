import type { MetadataRoute } from "next";

const siteUrl = "https://turningolive.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/programs",
    "/team",
    "/blog",
    "/gallery",
    "/sponsors",
    "/get-involved",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
