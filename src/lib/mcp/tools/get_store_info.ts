import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_store_info",
  title: "Get store info",
  description:
    "Return Eloria Store's contact details, social links, and how customers can place orders (WhatsApp, phone, Instagram).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Eloria Store",
      tagline: "Premium curtains, bedding, handbags & shoes.",
      whatsapp: "+254742461744",
      whatsappLink: "https://wa.me/254742461744",
      phone: "+254742461744",
      instagram: "https://www.instagram.com/eloriastore1",
      instagramHandle: "@eloriastore1",
      currency: "KES",
      ordering:
        "Customers browse the site and place orders via WhatsApp or phone at +254 742 461 744. A coupon code ELORIA10 gives 10% off first order.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
