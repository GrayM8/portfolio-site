import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tui`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...getAllProjectSlugs().map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
