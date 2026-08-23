import { db } from "@/lib/db";
import { PRODUCTS, CATEGORIES, COLLECTIONS, JOURNAL_ARTICLES } from "@/data/catalog";
import { BRAND } from "@/data/catalog";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://zariya.com";

  const staticUrls = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/store", priority: "0.9", changefreq: "daily" },
    { url: "/story", priority: "0.8", changefreq: "monthly" },
    { url: "/journal", priority: "0.8", changefreq: "weekly" },
    { url: "/track", priority: "0.6", changefreq: "monthly" },
    { url: "/gift-card", priority: "0.6", changefreq: "monthly" },
    { url: "/admin/login", priority: "0.3", changefreq: "monthly" },
  ];

  const categoryUrls = CATEGORIES.map((c) => ({
    url: `/store?category=${c.slug}`,
    priority: "0.7",
    changefreq: "weekly",
  }));

  const productUrls = PRODUCTS.map((p) => ({
    url: `/store?q=${p.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const journalUrls = JOURNAL_ARTICLES.map((a) => ({
    url: `/journal/${a.slug}`,
    priority: "0.6",
    changefreq: "monthly",
  }));

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls, ...journalUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
