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
import beddingWhiteDamask from "@/assets/uploads/IMG-20260713-WA0116.jpg_1.jpg.asset.json";
import beddingNavyVelvet from "@/assets/uploads/IMG-20260713-WA0122.jpg.jpg.asset.json";
import beddingNavyDreamSoft from "@/assets/uploads/IMG-20260713-WA0124.jpg_2.jpg.asset.json";
import beddingPinkHeartsKids from "@/assets/uploads/IMG-20260713-WA0125.jpg.jpg.asset.json";
import beddingPinkRibbed from "@/assets/uploads/IMG-20260713-WA0127.jpg.jpg.asset.json";
import beddingOrangeLeaves from "@/assets/uploads/IMG-20260713-WA0134.jpg.jpg.asset.json";
import beddingSkyStripe from "@/assets/uploads/IMG-20260713-WA0138.jpg.jpg.asset.json";

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

  // ===== More curtains & bedding (new batch) =====
  p({
    id: "orange-grommet-curtain",
    name: "Sunset Orange Grommet Curtain",
    category: "curtains",
    collection: "Living Room",
    price: 3400, originalPrice: 4200,
    image: curtainOrange.url, gallery: [curtainOrange.url],
    colors: ["Orange", "Terracotta", "Mustard"],
    sizes: ["150x230", "200x260"],
    description: "Warm sunset-orange grommet curtain — instantly lifts a neutral living room.",
    features: ["Silky drape", "Silver grommet header", "Sold per panel"],
    tag: "Sale", rating: 4.7, reviews: 34, stock: 26,
  }),
  p({
    id: "kids-mickey-curtain",
    name: "Kids Mickey & Minnie Curtain",
    category: "curtains",
    collection: "Kids Room",
    price: 3100, originalPrice: 3900,
    image: curtainKidsMickey.url, gallery: [curtainKidsMickey.url],
    colors: ["Sky Blue"],
    sizes: ["150x220", "200x230"],
    description: "Cheerful sky-blue curtain with printed characters and matching sheer — perfect for kids' rooms.",
    features: ["Blackout + sheer combo", "Rod pocket header", "Includes tie-backs"],
    rating: 4.8, reviews: 44, stock: 22,
  }),
  p({
    id: "white-tassel-comforter-set",
    name: "White & Burgundy Tassel Comforter Set",
    category: "bedding",
    collection: "Luxury",
    price: 8900, originalPrice: 11500,
    image: beddingWhiteTassel.url, gallery: [beddingWhiteTassel.url],
    colors: ["White/Burgundy"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Crisp white comforter with embroidered diamond motifs and burgundy tassels — modern boho luxury.",
    features: ["Embroidered detail", "Includes tassel cushion", "6-piece set"],
    tag: "New", rating: 4.9, reviews: 62, stock: 16,
  }),
  p({
    id: "mono-geo-fleece-comforter",
    name: "Monochrome Geo Fleece Comforter",
    category: "bedding",
    collection: "Comforters",
    price: 6200, originalPrice: 7800,
    image: beddingMonoGeo.url, gallery: [beddingMonoGeo.url],
    colors: ["Black/White/Grey"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Bold monochrome geometric print with plush sherpa fleece reverse — warm, modern, statement bedding.",
    features: ["Sherpa fleece reverse", "Reversible", "3-piece set"],
    tag: "Bestseller", rating: 4.8, reviews: 71, stock: 24,
  }),
  p({
    id: "striped-beach-towels",
    name: "Striped Pool & Beach Towel",
    category: "bedding",
    collection: "Towels",
    price: 1600,
    image: towelsStripe.url, gallery: [towelsStripe.url, towelsStack.url],
    colors: ["Multi Stripe"],
    sizes: ["80x160"],
    description: "Oversized striped cotton towel — great for pool, beach or gym. Ultra absorbent.",
    features: ["100% cotton velour", "Oversized", "Fade-resistant"],
    rating: 4.7, reviews: 58, stock: 80,
  }),
  p({
    id: "beige-quilted-mattress-protector",
    name: "Beige Quilted Mattress Protector",
    category: "bedding",
    collection: "Mattress Protectors",
    price: 2800, originalPrice: 3600,
    image: mattressBeige.url, gallery: [mattressBeige.url, mattressGrey.url],
    colors: ["Beige", "Grey", "White"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Soft quilted mattress protector — extends the life of your mattress and adds cushioned comfort.",
    features: ["Deep pocket fit", "Anti-dust mite", "Machine washable"],
    tag: "Sale", rating: 4.7, reviews: 96, stock: 40,
  }),
  p({
    id: "blue-waterproof-mattress-protector",
    name: "Blue Waterproof Mattress Protector",
    category: "bedding",
    collection: "Mattress Protectors",
    price: 3200,
    image: mattressBlueWater.url, gallery: [mattressBlueWater.url],
    colors: ["Sky Blue", "White", "Grey"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "100% waterproof yet breathable quilted mattress protector — a must-have for kids' beds.",
    features: ["Waterproof TPU layer", "Silent — no crinkle", "Fitted skirt"],
    tag: "Bestseller", rating: 4.9, reviews: 143, stock: 55,
  }),
  p({
    id: "grey-quilted-mattress-protector",
    name: "Grey Quilted Mattress Protector",
    category: "bedding",
    collection: "Mattress Protectors",
    price: 2900,
    image: mattressGrey.url, gallery: [mattressGrey.url],
    colors: ["Grey"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Neutral grey diamond-quilted protector — soft microfiber top with elasticated fit.",
    features: ["Diamond quilt", "Hypoallergenic fill", "Elasticated fit"],
    rating: 4.7, reviews: 52, stock: 32,
  }),
  p({
    id: "navy-elegant-mattress-protector",
    name: "Navy Elegant Mattress Protector Set",
    category: "bedding",
    collection: "Mattress Protectors",
    price: 4200, originalPrice: 5200,
    image: mattressNavy.url, gallery: [mattressNavy.url],
    colors: ["Navy", "Burgundy", "Grey"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Rich navy quilted protector with matching pillow protectors — hotel-grade look and feel.",
    features: ["Includes 2 pillow protectors", "Deep pocket", "Fade-resistant dye"],
    tag: "New", rating: 4.8, reviews: 47, stock: 26,
  }),
  p({
    id: "fluffy-cushion-covers-9pack",
    name: "Plush Ribbed Cushion Covers",
    category: "bedding",
    collection: "Cushion Covers",
    price: 1400,
    image: cushionCovers.url, gallery: [cushionCovers.url],
    colors: ["Pink", "Brown", "Green", "Orange", "Cream", "Blue", "White", "Grey", "Beige"],
    sizes: ["45x45", "50x50"],
    description: "Ultra-soft ribbed faux-fur cushion covers — 9 rich tones to mix and match on any sofa.",
    features: ["Faux-fur ribbed weave", "Hidden zip closure", "Cover only — insert sold separately"],
    tag: "Bestseller", rating: 4.9, reviews: 168, stock: 90,
  }),

  p({
    id: "navy-velvet-damask-set",
    name: "Navy Velvet Damask 6pc Comforter Set",
    category: "bedding",
    collection: "Luxury",
    price: 10500, originalPrice: 13800,
    image: beddingNavyVelvet.url, gallery: [beddingNavyVelvet.url, beddingNavyLux.url, beddingNavyDreamSoft.url],
    colors: ["Royal Navy", "Wine", "Emerald"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Deep royal navy velvet-touch comforter with silver damask embossing — the pinnacle of bedroom luxury.",
    features: ["Velvet-touch finish", "Silver damask emboss", "6-piece set with cushions"],
    tag: "New", rating: 4.9, reviews: 58, stock: 14,
  }),
  p({
    id: "white-damask-luxe-set",
    name: "White Damask 5pc Luxe Set",
    category: "bedding",
    collection: "Luxury",
    price: 9500, originalPrice: 12200,
    image: beddingWhiteDamask.url, gallery: [beddingWhiteDamask.url, beddingWhiteRibbed.url],
    colors: ["Ivory White"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Elegant white damask-embossed comforter with soft grey reverse — timeless, hotel-inspired luxury.",
    features: ["Damask emboss", "Reversible grey", "5-piece set"],
    tag: "Bestseller", rating: 4.9, reviews: 84, stock: 18,
  }),
  p({
    id: "navy-dreamsoft-ribbed-set",
    name: "DreamSoft Navy Ribbed Fleece Set",
    category: "bedding",
    collection: "Duvet Sets",
    price: 7800, originalPrice: 9500,
    image: beddingNavyDreamSoft.url, gallery: [beddingNavyDreamSoft.url, beddingWhiteRibbed.url, beddingPinkRibbed.url],
    colors: ["Navy", "White", "Pink"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Ultra-warm ribbed fleece duvet set in deep navy — DreamSoft cosiness for cold nights.",
    features: ["Ribbed fleece", "6-piece set", "Machine washable"],
    tag: "Bestseller", rating: 4.9, reviews: 96, stock: 22,
  }),
  p({
    id: "pink-ribbed-fleece-set",
    name: "Pink Ribbed Fleece Duvet Set",
    category: "bedding",
    collection: "Duvet Sets",
    price: 7800,
    image: beddingPinkRibbed.url, gallery: [beddingPinkRibbed.url, beddingNavyDreamSoft.url],
    colors: ["Pink", "Blush", "Coral"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Playful pink ribbed fleece bedding — irresistibly soft and warm.",
    features: ["Ribbed fleece", "6-piece set", "Reversible design"],
    tag: "New", rating: 4.8, reviews: 47, stock: 20,
  }),
  p({
    id: "pink-hearts-kids-duvet",
    name: "Pink Hearts Kids Duvet",
    category: "bedding",
    collection: "Kids Bedding",
    price: 3400,
    image: beddingPinkHeartsKids.url, gallery: [beddingPinkHeartsKids.url],
    colors: ["Pink/Grey"],
    sizes: ["4x6", "5x6"],
    description: "Sweet pink 'Good Night' hearts duvet with cosy grey fleece reverse — a bedtime favourite.",
    features: ["Reversible fleece", "Kid-safe fabric", "Machine washable"],
    tag: "New", rating: 4.8, reviews: 32, stock: 28,
  }),
  p({
    id: "orange-leaves-cotton-set",
    name: "Autumn Leaves Cotton Bedsheet Set",
    category: "bedding",
    collection: "Cotton Sheets",
    price: 4200, originalPrice: 5400,
    image: beddingOrangeLeaves.url, gallery: [beddingOrangeLeaves.url],
    colors: ["White/Orange"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Crisp cotton bedsheet set with an orange leaves and stripes print — bright, fresh, easy-care.",
    features: ["100% cotton", "4-piece set", "Fade-resistant print"],
    tag: "Sale", rating: 4.7, reviews: 39, stock: 30,
  }),
  p({
    id: "sky-stripe-satin-set",
    name: "Sky Blue Satin Stripe 6pc Set",
    category: "bedding",
    collection: "Cotton Sheets",
    price: 5800,
    image: beddingSkyStripe.url, gallery: [beddingSkyStripe.url],
    colors: ["Sky Blue", "White", "Grey"],
    sizes: ["5x6", "6x6", "6x7"],
    description: "Soft satin-stripe cotton bedding in calming sky blue — includes bedsheet, duvet cover and 4 pillowcases.",
    features: ["Satin-stripe cotton", "1 bedsheet + 1 duvet + 4 pillowcases", "300 thread count"],
    tag: "New", rating: 4.8, reviews: 52, stock: 24,
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
export const INSTAGRAM_URL = "https://www.instagram.com/eloriastore1?utm_source=qr&igsh=ZDc0dzZhaXgzNHY4";
export const FACEBOOK_URL = "https://www.facebook.com/eloriastore1";
export const EMAIL_ADDRESS = "hello@eloriastore.co.ke";
export const BUSINESS_LOCATION = "Kamukunji, Nairobi, Kenya";
export const BUSINESS_ADDRESS = "Kamukunji, Nairobi, Kenya";
export const SITE_URL = "https://eloria-luxe-shop.lovable.app";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
