import bag1 from "@/assets/p-bag-1.jpg";
import bag2 from "@/assets/p-bag-2.jpg";
import shoe1 from "@/assets/p-shoe-1.jpg";
import shoe2 from "@/assets/p-shoe-2.jpg";
import catHandbags from "@/assets/cat-handbags.jpg";
import catShoes from "@/assets/cat-shoes.jpg";

// Real product photos (uploaded)
import curtainBlue from "@/assets/uploads/IMG-20260713-WA0103.jpg.asset.json";
import curtainMixed from "@/assets/uploads/IMG-20260713-WA0105.jpg.asset.json";
import curtainGreySheer from "@/assets/uploads/IMG-20260713-WA0107.jpg.asset.json";
import curtainKids from "@/assets/uploads/IMG-20260713-WA0119.jpg.asset.json";
import beddingRedWhite from "@/assets/uploads/IMG-20260713-WA0108.jpg.asset.json";
import beddingNavyStars from "@/assets/uploads/IMG-20260713-WA0110.jpg.asset.json";
import beddingNavyLux from "@/assets/uploads/IMG-20260713-WA0115.jpg.asset.json";
import beddingPurple from "@/assets/uploads/IMG-20260713-WA0120.jpg.asset.json";
import beddingCream from "@/assets/uploads/IMG-20260713-WA0121.jpg.asset.json";
import beddingTealThrow from "@/assets/uploads/IMG-20260713-WA0123.jpg.asset.json";
import beddingBrownCheck from "@/assets/uploads/IMG-20260713-WA0136.jpg.asset.json";
import towelsStack from "@/assets/uploads/IMG-20260713-WA0092.jpg.asset.json";
import fluffyThrows from "@/assets/uploads/IMG-20260713-WA0099.jpg.asset.json";
import beddingPinkGeo from "@/assets/uploads/IMG-20260713-WA0137.jpg.asset.json";
import curtainPinkCanopy from "@/assets/uploads/IMG-20260713-WA0098.jpg.asset.json";
import curtainNavySolid from "@/assets/uploads/IMG-20260713-WA0102.jpg.asset.json";
import curtainPleatedRange from "@/assets/uploads/IMG-20260713-WA0104.jpg.asset.json";
import curtainNavyYellow from "@/assets/uploads/IMG-20260713-WA0106.jpg.asset.json";
import beddingWhiteRibbed from "@/assets/uploads/IMG-20260713-WA0109.jpg_2.jpg.asset.json";
import beddingWhiteStripe from "@/assets/uploads/IMG-20260713-WA0111.jpg.asset.json";
import towelsStripe from "@/assets/uploads/IMG-20260713-WA0093.jpg.asset.json";
import mattressBeige from "@/assets/uploads/IMG-20260713-WA0094.jpg.asset.json";
import mattressBlueWater from "@/assets/uploads/IMG-20260713-WA0095.jpg.asset.json";
import mattressGrey from "@/assets/uploads/IMG-20260713-WA0096.jpg.asset.json";
import mattressNavy from "@/assets/uploads/IMG-20260713-WA0097.jpg.asset.json";
import cushionCovers from "@/assets/uploads/IMG-20260713-WA0100.jpg.asset.json";
import curtainOrange from "@/assets/uploads/IMG-20260713-WA0101.jpg.asset.json";
import beddingWhiteTassel from "@/assets/uploads/IMG-20260713-WA0112.jpg.asset.json";
import curtainKidsMickey from "@/assets/uploads/IMG-20260713-WA0117.jpg.asset.json";
import beddingMonoGeo from "@/assets/uploads/IMG-20260713-WA0126.jpg.asset.json";

export type CategorySlug = "curtains" | "bedding" | "handbags" | "shoes";

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  collection: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  colors: string[];
  sizes: string[];
  description: string;
  features: string[];
  tag?: "New" | "Bestseller" | "Limited" | "Sale";
  rating: number;
  reviews: number;
  stock: number;
};

export const CATEGORIES: {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
  collections: string[];
}[] = [
  {
    slug: "curtains",
    name: "Curtains",
    tagline: "Draperies that transform every room",
    image: curtainMixed.url,
    collections: [
      "Luxury Curtains",
      "Sheer Curtains",
      "Blackout Curtains",
      "Living Room",
      "Bedroom",
      "Kids Room",
      "Modern",
      "Classic",
    ],
  },
  {
    slug: "bedding",
    name: "Bedding & Home Textiles",
    tagline: "Duvets, throws & bedding sets for restful nights",
    image: beddingNavyLux.url,
    collections: [
      "Duvet Sets",
      "Comforters",
      "Throws & Blankets",
      "Bed Runners",
      "Kids Bedding",
      "Luxury",
      "Towels",
      "Cotton Sheets",
      "Mattress Protectors",
      "Cushion Covers",
    ],
  },
  {
    slug: "handbags",
    name: "Handbags",
    tagline: "Effortless elegance in every carry",
    image: catHandbags,
    collections: [
      "Tote Bags",
      "Crossbody",
      "Shoulder Bags",
      "Office",
      "Evening",
      "Premium Leather",
      "Travel",
      "New Season",
    ],
  },
  {
    slug: "shoes",
    name: "Ladies Shoes",
    tagline: "Step into everyday luxury",
    image: catShoes,
    collections: [
      "Heels",
      "Flats",
      "Sneakers",
      "Sandals",
      "Boots",
      "Loafers",
      "Wedding",
      "Office",
    ],
  },
];

const p = (o: Product): Product => o;

export const PRODUCTS: Product[] = [
  // ===== CURTAINS =====
  p({
    id: "royal-blue-grommet-curtain",
    name: "Royal Blue Grommet Curtain",
    category: "curtains",
    collection: "Blackout Curtains",
    price: 3800, originalPrice: 5200,
    image: curtainBlue.url, gallery: [curtainBlue.url, curtainMixed.url],
    colors: ["Royal Blue", "Navy", "Teal"],
    sizes: ["150x230", "200x260", "300x270"],
    description: "Rich royal blue grommet-top curtains — heavy weave that filters harsh light and adds warmth to any room.",
    features: ["Heavy blackout weave", "Silver grommet header", "Machine washable"],
    tag: "Bestseller", rating: 4.8, reviews: 142, stock: 36,
  }),
  p({
    id: "atelier-jacquard-drapes",
    name: "Atelier Jacquard Drapes",
    category: "curtains",
    collection: "Luxury Curtains",
    price: 8500, originalPrice: 10800,
    image: curtainMixed.url, gallery: [curtainMixed.url, curtainBlue.url],
    colors: ["Silver", "Teal", "Cream", "Yellow", "Grey"],
    sizes: ["200x260", "300x270"],
    description: "Jacquard patterned drapes styled with tasseled tie-backs — the centerpiece of any living room.",
    features: ["Jacquard weave", "Includes tie-backs", "Pinch-pleat header"],
    tag: "New", rating: 4.9, reviews: 88, stock: 22,
  }),
  p({
    id: "sheer-white-panel",
    name: "Sheer White Panel with Accents",
    category: "curtains",
    collection: "Sheer Curtains",
    price: 3200,
    image: curtainGreySheer.url, gallery: [curtainGreySheer.url, curtainMixed.url],
    colors: ["Grey", "Mustard", "White", "Blush"],
    sizes: ["140x240", "200x260"],
    description: "Layered sheer + solid combo — soft light, quiet elegance. Perfect for bedrooms and dining rooms.",
    features: ["Voile sheer overlay", "Rod pocket header", "Sold as 4-panel set"],
    rating: 4.7, reviews: 64, stock: 41,
  }),
  p({
    id: "kids-cars-curtain",
    name: "Kids Racing Cars Curtain",
    category: "curtains",
    collection: "Kids Room",
    price: 2900, originalPrice: 3800,
    image: curtainKids.url, gallery: [curtainKids.url],
    colors: ["Blue Multi"],
    sizes: ["150x220", "200x230"],
    description: "Bright printed curtain for kids' bedrooms — playful racing cars motif on a fresh blue base.",
    features: ["Kid-safe fabric", "Rod pocket header", "Includes tie-backs"],
    tag: "Sale", rating: 4.8, reviews: 51, stock: 30,
  }),

  // ===== BEDDING =====
  p({
    id: "navy-luxe-comforter-set",
    name: "Navy Luxe 6pc Comforter Set",
    category: "bedding",
    collection: "Luxury",
    price: 9800, originalPrice: 12500,
    image: beddingNavyLux.url, gallery: [beddingNavyLux.url, beddingPurple.url],
    colors: ["Navy", "Purple", "Cream"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Damask-embossed velvet-touch comforter with matching shams and cushions — hotel-grade luxury.",
    features: ["6-piece set", "Velvet-touch finish", "Reversible grey underside"],
    tag: "Bestseller", rating: 4.9, reviews: 176, stock: 18,
  }),
  p({
    id: "royal-purple-comforter-set",
    name: "Royal Purple 6pc Comforter Set",
    category: "bedding",
    collection: "Luxury",
    price: 9800, originalPrice: 12500,
    image: beddingPurple.url, gallery: [beddingPurple.url, beddingNavyLux.url],
    colors: ["Purple", "Navy", "Cream"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Rich royal purple damask comforter set — a bold, romantic statement for master bedrooms.",
    features: ["6-piece set", "Velvet-touch finish", "Reversible grey underside"],
    tag: "New", rating: 4.9, reviews: 92, stock: 15,
  }),
  p({
    id: "cream-damask-comforter-set",
    name: "Cream Damask 6pc Set",
    category: "bedding",
    collection: "Luxury",
    price: 9800,
    image: beddingCream.url, gallery: [beddingCream.url, beddingNavyLux.url],
    colors: ["Cream", "Ivory"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Soft cream damask comforter with grey reverse — timeless and warm.",
    features: ["6-piece set", "Velvet-touch finish", "Machine washable cold"],
    rating: 4.8, reviews: 74, stock: 20,
  }),
  p({
    id: "red-white-bed-runner",
    name: "Red & White Bed Runner Set",
    category: "bedding",
    collection: "Bed Runners",
    price: 4200,
    image: beddingRedWhite.url, gallery: [beddingRedWhite.url],
    colors: ["Red/White"],
    sizes: ["5x6", "6x6"],
    description: "Crisp white sateen bedding paired with a red runner and matching cushion covers.",
    features: ["Sateen finish", "Runner + 2 cushion covers", "Stripe-embossed duvet"],
    tag: "Sale", rating: 4.7, reviews: 58, stock: 25,
  }),
  p({
    id: "navy-stars-duvet",
    name: "Navy Stars Fleece Duvet",
    category: "bedding",
    collection: "Kids Bedding",
    price: 3600,
    image: beddingNavyStars.url, gallery: [beddingNavyStars.url],
    colors: ["Navy Stars"],
    sizes: ["4x6", "5x6", "6x6"],
    description: "Warm printed fleece duvet — cosy for cold nights and playful for kids' rooms.",
    features: ["Warm fleece", "Reversible design", "Machine washable"],
    rating: 4.7, reviews: 41, stock: 34,
  }),
  p({
    id: "teal-ribbed-throw",
    name: "Teal Ribbed Fleece Throw",
    category: "bedding",
    collection: "Throws & Blankets",
    price: 2400, originalPrice: 3200,
    image: beddingTealThrow.url, gallery: [beddingTealThrow.url],
    colors: ["Teal", "Grey", "Wine"],
    sizes: ["Single", "Double"],
    description: "Chunky ribbed fleece throw — the softest way to end a long day.",
    features: ["Ultra-soft fleece", "Reversible sherpa lining", "Anti-pill"],
    tag: "New", rating: 4.9, reviews: 112, stock: 44,
  }),

  // ===== More curtains =====
  p({
    id: "navy-solid-blackout",
    name: "Navy Solid Blackout Curtain",
    category: "curtains",
    collection: "Blackout Curtains",
    price: 3500,
    image: curtainNavySolid.url, gallery: [curtainNavySolid.url, curtainBlue.url],
    colors: ["Navy", "Black", "Grey", "Wine"],
    sizes: ["150x230", "200x260", "300x270"],
    description: "Deep navy blackout curtain with silver grommets — clean, modern, and light-blocking.",
    features: ["Blackout weave", "Silver grommet header", "Sold per panel"],
    tag: "Bestseller", rating: 4.9, reviews: 210, stock: 48,
  }),
  p({
    id: "satin-pleated-drapes",
    name: "Satin Pleated Drapes",
    category: "curtains",
    collection: "Luxury Curtains",
    price: 7200, originalPrice: 9000,
    image: curtainPleatedRange.url, gallery: [curtainPleatedRange.url, curtainMixed.url],
    colors: ["Champagne", "Navy", "Charcoal", "Gold", "Silver"],
    sizes: ["200x260", "300x270"],
    description: "Silky satin pleated drapes with tasseled tie-backs — available in 8 elegant shades.",
    features: ["Satin sheen", "Pinch pleat header", "Includes tasseled tie-backs"],
    tag: "New", rating: 4.9, reviews: 96, stock: 26,
  }),
  p({
    id: "navy-yellow-statement",
    name: "Navy & Yellow Statement Curtain",
    category: "curtains",
    collection: "Living Room",
    price: 4200,
    image: curtainNavyYellow.url, gallery: [curtainNavyYellow.url],
    colors: ["Navy/Yellow"],
    sizes: ["200x260"],
    description: "Two-tone navy and mustard curtain — bold contrast to elevate any living space.",
    features: ["Heavy fabric", "Includes accent cushions", "Grommet header"],
    rating: 4.7, reviews: 38, stock: 18,
  }),
  p({
    id: "pink-canopy-bed-curtain",
    name: "Pink Canopy Bed Curtain Set",
    category: "curtains",
    collection: "Bedroom",
    price: 6800, originalPrice: 8500,
    image: curtainPinkCanopy.url, gallery: [curtainPinkCanopy.url],
    colors: ["Peach Pink", "White", "Lilac"],
    sizes: ["5x6", "6x6"],
    description: "Romantic canopy bed curtain with lace trim and mosquito net — dreamy princess bedroom look.",
    features: ["Includes 4 posts fabric", "Lace trim", "Doubles as mosquito net"],
    tag: "New", rating: 4.8, reviews: 47, stock: 12,
  }),

  // ===== More bedding =====
  p({
    id: "brown-check-cotton-set",
    name: "Brown Check 6pc Cotton Set",
    category: "bedding",
    collection: "Cotton Sheets",
    price: 4800, originalPrice: 6200,
    image: beddingBrownCheck.url, gallery: [beddingBrownCheck.url],
    colors: ["Brown/Cream"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Crisp cotton bedding in a warm brown & cream check — includes flat sheet, fitted sheet, duvet cover and pillowcases.",
    features: ["100% cotton", "6-piece set", "Machine washable"],
    tag: "Sale", rating: 4.8, reviews: 63, stock: 28,
  }),
  p({
    id: "pink-geo-cotton-set",
    name: "Blush Geometric Cotton Set",
    category: "bedding",
    collection: "Cotton Sheets",
    price: 4800,
    image: beddingPinkGeo.url, gallery: [beddingPinkGeo.url],
    colors: ["Blush/Cream"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Soft cotton bedding with playful pink and tan geometric print — light and modern.",
    features: ["100% cotton", "6-piece set", "Fade-resistant print"],
    rating: 4.7, reviews: 42, stock: 24,
  }),
  p({
    id: "white-ribbed-fleece-set",
    name: "White Ribbed Fleece Duvet Set",
    category: "bedding",
    collection: "Duvet Sets",
    price: 8200, originalPrice: 10500,
    image: beddingWhiteRibbed.url, gallery: [beddingWhiteRibbed.url],
    colors: ["White", "Grey", "Beige"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Plush ribbed fleece duvet cover set — hotel-soft, exceptionally warm.",
    features: ["Ribbed fleece", "6-piece set", "Reversible"],
    tag: "Bestseller", rating: 4.9, reviews: 128, stock: 22,
  }),
  p({
    id: "hotel-white-stripe-set",
    name: "Hotel White Stripe 6pc Set",
    category: "bedding",
    collection: "Luxury",
    price: 7500,
    image: beddingWhiteStripe.url, gallery: [beddingWhiteStripe.url],
    colors: ["White"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Classic hotel-grade white satin-stripe cotton bedding — timeless and effortlessly luxurious.",
    features: ["Sateen stripe cotton", "300 thread count", "6-piece set"],
    tag: "New", rating: 4.9, reviews: 154, stock: 30,
  }),
  p({
    id: "ribbed-fleece-throw-multi",
    name: "Ribbed Fleece Throw",
    category: "bedding",
    collection: "Throws & Blankets",
    price: 2200, originalPrice: 2900,
    image: fluffyThrows.url, gallery: [fluffyThrows.url, beddingTealThrow.url],
    colors: ["Yellow", "Red", "Navy", "Sky Blue", "Grey", "Brown", "Pink", "Wine", "Beige"],
    sizes: ["Single", "Double"],
    description: "Ultra-soft ribbed fleece throw — available in 9 colors. Great gift.",
    features: ["Chunky ribbed fleece", "Anti-pill", "Reversible"],
    tag: "Bestseller", rating: 4.9, reviews: 231, stock: 60,
  }),
  p({
    id: "cotton-bath-towels",
    name: "Egyptian Cotton Bath Towel",
    category: "bedding",
    collection: "Towels",
    price: 1200,
    image: towelsStack.url, gallery: [towelsStack.url],
    colors: ["Teal", "Mint", "Red", "Purple", "Blue", "Grey", "Green", "Pink", "Brown"],
    sizes: ["70x140"],
    description: "Absorbent Egyptian cotton bath towel — thick, plush, quick-drying. 9 colors.",
    features: ["100% Egyptian cotton", "550 GSM", "Fade-resistant dye"],
    rating: 4.8, reviews: 189, stock: 120,
  }),

  // ===== HANDBAGS ===== (placeholders until real photos arrive)
  p({
    id: "cream-carry-tote",
    name: "Cream Carry Tote",
    category: "handbags",
    collection: "Tote Bags",
    price: 7800, originalPrice: 9600,
    image: bag1, gallery: [bag1, bag2],
    colors: ["Cream", "Beige", "Black"],
    sizes: ["One Size"],
    description: "A structured everyday tote in supple grained leather.",
    features: ["Full-grain leather", "Suede-lined interior", "Gold-tone hardware"],
    tag: "Bestseller", rating: 4.9, reviews: 312, stock: 21,
  }),
  p({
    id: "noir-chain-crossbody",
    name: "Noir Chain Crossbody",
    category: "handbags",
    collection: "Crossbody",
    price: 6400,
    image: bag2, gallery: [bag2, bag1],
    colors: ["Black", "Chocolate"],
    sizes: ["One Size"],
    description: "Sleek chain-strap crossbody with an elongated silhouette.",
    features: ["Smooth calfskin", "Chain + leather strap", "Magnetic closure"],
    tag: "New", rating: 4.8, reviews: 176, stock: 14,
  }),
  p({
    id: "champagne-clutch",
    name: "Champagne Evening Clutch",
    category: "handbags",
    collection: "Evening",
    price: 4900, originalPrice: 6400,
    image: bag1, gallery: [bag1, bag2],
    colors: ["Champagne", "Ivory", "Blush"],
    sizes: ["One Size"],
    description: "A jewel-toned satin clutch with a subtle metallic clasp.",
    features: ["Satin exterior", "Removable chain", "Interior card slot"],
    tag: "Sale", rating: 4.7, reviews: 84, stock: 33,
  }),

  // ===== SHOES ===== (placeholders until real photos arrive)
  p({
    id: "nude-pointed-pump",
    name: "Nude Pointed Pump",
    category: "shoes",
    collection: "Heels",
    price: 5200, originalPrice: 6800,
    image: shoe1, gallery: [shoe1, shoe2],
    colors: ["Nude", "Black", "Blush"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description: "The 85mm pump, refined.",
    features: ["Napa leather upper", "Leather-wrapped heel", "Cushioned insole"],
    tag: "Bestseller", rating: 4.8, reviews: 289, stock: 27,
  }),
  p({
    id: "cloud-white-sneaker",
    name: "Cloud White Sneaker",
    category: "shoes",
    collection: "Sneakers",
    price: 4800,
    image: shoe2, gallery: [shoe2, shoe1],
    colors: ["White", "Cream"],
    sizes: ["36", "37", "38", "39", "40"],
    description: "Minimal, quietly cushioned, and unfailingly polished.",
    features: ["Full-grain leather", "Memory-foam insole", "Rubber cup sole"],
    tag: "New", rating: 4.9, reviews: 356, stock: 41,
  }),
  p({
    id: "champagne-strap-sandal",
    name: "Champagne Strap Sandal",
    category: "shoes",
    collection: "Sandals",
    price: 4400,
    image: shoe1, gallery: [shoe1, shoe2],
    colors: ["Champagne", "Nude", "Silver"],
    sizes: ["36", "37", "38", "39", "40"],
    description: "Barely-there straps on a slender 70mm heel.",
    features: ["Metallic leather", "Adjustable ankle strap", "Anti-slip sole"],
    rating: 4.7, reviews: 128, stock: 22,
  }),
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getByCategory(slug: CategorySlug) {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getRelated(id: string, count = 4) {
  const prod = getProduct(id);
  if (!prod) return [];
  return PRODUCTS.filter((p) => p.category === prod.category && p.id !== id).slice(0, count);
}

export function formatKES(n: number) {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

export const WHATSAPP_NUMBER = "254742461744";
export const PHONE_NUMBER = "+254742461744";
export const PHONE_DISPLAY = "+254 742 461 744";
export const INSTAGRAM_URL = "https://www.instagram.com/eloriastore1";
export const FACEBOOK_URL = "https://www.facebook.com/eloriastore1";
export const EMAIL_ADDRESS = "hello@eloriastore.co.ke";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
