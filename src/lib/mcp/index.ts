import { defineMcp } from "@lovable.dev/mcp-js";
import listCategories from "./tools/list_categories";
import searchProducts from "./tools/search_products";
import getProduct from "./tools/get_product";
import getStoreInfo from "./tools/get_store_info";

export default defineMcp({
  name: "eloria-store-mcp",
  title: "Eloria Store",
  version: "0.1.0",
  instructions:
    "Tools for browsing the Eloria Store catalog (curtains, bedding & home textiles, handbags, shoes) and getting store contact info. Use `list_categories` to see what's available, `search_products` to filter by category/price/tag, `get_product` for full product details by id, and `get_store_info` for WhatsApp/phone/Instagram ordering info. All prices are in KES.",
  tools: [listCategories, searchProducts, getProduct, getStoreInfo],
});
