import { defineTool } from "@lovable.dev/mcp-js";
import { CATEGORIES } from "@/lib/products";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description: "List all product categories available at Eloria Store (curtains, bedding & home textiles, handbags, shoes).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      collections: c.collections,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { categories: items },
    };
  },
});
