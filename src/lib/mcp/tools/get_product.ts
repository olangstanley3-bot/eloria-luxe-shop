import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/lib/products";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Fetch full details for a single Eloria Store product by its id, including description, features, colors, sizes, price, stock and rating.",
  inputSchema: {
    id: z.string().min(1).describe("Product id (e.g. 'curtain-navy-solid')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) {
      return {
        content: [{ type: "text", text: `No product found with id "${id}".` }],
        isError: true,
      };
    }
    const detail = {
      id: p.id,
      name: p.name,
      category: p.category,
      collection: p.collection,
      price: p.price,
      originalPrice: p.originalPrice,
      currency: "KES",
      description: p.description,
      features: p.features,
      colors: p.colors,
      sizes: p.sizes,
      tag: p.tag,
      rating: p.rating,
      reviews: p.reviews,
      stock: p.stock,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(detail, null, 2) }],
      structuredContent: { product: detail },
    };
  },
});
