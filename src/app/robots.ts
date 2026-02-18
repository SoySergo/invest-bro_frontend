import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://investbro.eu";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/chat/", "/profile/", "/dashboard/", "/listing/create", "/investor/create", "/job/create"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
