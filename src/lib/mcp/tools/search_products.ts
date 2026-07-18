import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS, type CategorySlug } from "@/lib/products";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search Eloria Store's catalog. Filter by free-text query (name/description), category, collection, price range, or tag. Returns a list of matching products with prices in KES.",
  inputSchema: {
    query: z.string().optional().describe("Free-text search over product name and description."),
    category: z
      .enum(["curtains", "bedding", "handbags", "shoes"])
      .optional()
      .describe("Category slug to filter by."),
    collection: z.string().optional().describe("Collection name to filter by (e.g. 'Blackout', 'Sheer')."),
    minPrice: z.number().nonnegative().optional().describe("Minimum price in KES."),
    maxPrice: z.number().nonnegative().optional().describe("Maximum price in KES."),
    tag: z.enum(["New", "Bestseller", "Limited", "Sale"]).optional().describe("Filter by product tag."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, collection, minPrice, maxPrice, tag, limit }) => {
    const q = query?.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (category && p.category !== (category as CategorySlug)) return false;
      if (collection && p.collection.toLowerCase() !== collection.toLowerCase()) return false;
      if (minPrice != null && p.price < minPrice) return false;
      if (maxPrice != null && p.price > maxPrice) return false;
      if (tag && p.tag !== tag) return false;
      if (q && !`${p.name} ${p.description} ${p.collection}`.toLowerCase().includes(q)) return false;
      return true;
    })
      .slice(0, limit ?? 20)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        collection: p.collection,
        price: p.price,
        originalPrice: p.originalPrice,
        currency: "KES",
        tag: p.tag,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
      }));

    return {
      content: [
        {
          type: "text",
          text:
            filtered.length === 0
              ? "No products matched those filters."
              : JSON.stringify(filtered, null, 2),
        },
      ],
      structuredContent: { count: filtered.length, products: filtered },
    };
  },
});
