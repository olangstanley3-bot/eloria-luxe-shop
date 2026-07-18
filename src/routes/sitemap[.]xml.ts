import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

const BASE_URL = "https://eloria-luxe-shop.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/about", "/contact", "/cart", "/wishlist"];
        const catPaths = CATEGORIES.map((c) => `/${c.slug}`);
        const productPaths = PRODUCTS.map((p) => `/product/${p.id}`);
        const all = [...staticPaths, ...catPaths, ...productPaths];

        const urls = all
          .map(
            (path) =>
              `  <url><loc>${BASE_URL}${path}</loc><changefreq>weekly</changefreq></url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
