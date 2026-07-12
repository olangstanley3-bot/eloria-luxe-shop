import curtain1 from "@/assets/p-curtain-1.jpg";
import curtain2 from "@/assets/p-curtain-2.jpg";
import bag1 from "@/assets/p-bag-1.jpg";
import bag2 from "@/assets/p-bag-2.jpg";
import shoe1 from "@/assets/p-shoe-1.jpg";
import shoe2 from "@/assets/p-shoe-2.jpg";
import catCurtains from "@/assets/cat-curtains.jpg";
import catHandbags from "@/assets/cat-handbags.jpg";
import catShoes from "@/assets/cat-shoes.jpg";

export type CategorySlug = "curtains" | "handbags" | "shoes";

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
    image: catCurtains,
    collections: [
      "Luxury Curtains",
      "Sheer Curtains",
      "Blackout Curtains",
      "Living Room",
      "Bedroom",
      "Modern",
      "Classic",
      "Minimalist",
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
  p({
    id: "sheer-ivory-drape",
    name: "Ivory Sheer Drape",
    category: "curtains",
    collection: "Sheer Curtains",
    price: 4500, originalPrice: 6000,
    image: curtain1, gallery: [curtain1, curtain2],
    colors: ["Ivory", "Champagne", "Blush"],
    sizes: ["140x240", "200x260", "300x270"],
    description: "Whisper-light sheer panels that filter morning sun into a soft, editorial glow.",
    features: ["100% high-twist polyester voile", "Rod pocket header", "Machine washable"],
    tag: "Bestseller", rating: 4.9, reviews: 214, stock: 42,
  }),
  p({
    id: "velvet-blackout-noir",
    name: "Noir Velvet Blackout",
    category: "curtains",
    collection: "Blackout Curtains",
    price: 8900, originalPrice: 11500,
    image: curtain2, gallery: [curtain2, curtain1],
    colors: ["Charcoal", "Deep Emerald", "Bordeaux"],
    sizes: ["200x260", "300x270"],
    description: "Dense velvet weave that blocks 99% of light — designed for cinematic bedrooms and lounges.",
    features: ["Triple-weave blackout lining", "Thermal insulating", "Grommet top"],
    tag: "New", rating: 4.8, reviews: 138, stock: 18,
  }),
  p({
    id: "linen-cloud-panel",
    name: "Linen Cloud Panel",
    category: "curtains",
    collection: "Living Room",
    price: 6200,
    image: curtain1, gallery: [curtain1, curtain2],
    colors: ["Sand", "Ivory", "Stone"],
    sizes: ["140x240", "200x260"],
    description: "Belgian-style linen with a soft, lived-in fall.",
    features: ["Pure linen blend", "OEKO-TEX certified", "Weighted hem"],
    rating: 4.7, reviews: 92, stock: 26,
  }),
  p({
    id: "champagne-silk-drape",
    name: "Champagne Silk Drape",
    category: "curtains",
    collection: "Luxury Curtains",
    price: 12400, originalPrice: 15800,
    image: curtain2, gallery: [curtain2, curtain1],
    colors: ["Champagne", "Ivory"],
    sizes: ["200x260", "300x270"],
    description: "Silk-blend drapery with a subtle sheen and museum-grade tailoring.",
    features: ["Silk-viscose blend", "Hand-finished hem", "Interlined for weight"],
    tag: "Limited", rating: 5, reviews: 47, stock: 8,
  }),

  p({
    id: "cream-carry-tote",
    name: "Cream Carry Tote",
    category: "handbags",
    collection: "Tote Bags",
    price: 7800, originalPrice: 9600,
    image: bag1, gallery: [bag1, bag2],
    colors: ["Cream", "Beige", "Black"],
    sizes: ["One Size"],
    description: "A structured everyday tote in supple grained leather — quietly gold, endlessly wearable.",
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
    description: "Sleek chain-strap crossbody with an elongated silhouette — for evenings that need presence.",
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
  p({
    id: "atelier-office-tote",
    name: "Atelier Office Tote",
    category: "handbags",
    collection: "Office",
    price: 8900,
    image: bag2, gallery: [bag2, bag1],
    colors: ["Black", "Cream", "Tan"],
    sizes: ["One Size"],
    description: "Fits a 14\" laptop and a very full agenda.",
    features: ["Padded laptop sleeve", "Zip closure", "Reinforced base"],
    rating: 4.9, reviews: 201, stock: 19,
  }),

  p({
    id: "nude-pointed-pump",
    name: "Nude Pointed Pump",
    category: "shoes",
    collection: "Heels",
    price: 5200, originalPrice: 6800,
    image: shoe1, gallery: [shoe1, shoe2],
    colors: ["Nude", "Black", "Blush"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description: "The 85mm pump, refined — with a whisper-thin stiletto and an almond-pointed toe.",
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
    description: "Minimal, quietly cushioned, and unfailingly polished — for weekends and everything after.",
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
    description: "Barely-there straps on a slender 70mm heel — designed to disappear into the moment.",
    features: ["Metallic leather", "Adjustable ankle strap", "Anti-slip sole"],
    rating: 4.7, reviews: 128, stock: 22,
  }),
  p({
    id: "ivory-bridal-heel",
    name: "Ivory Bridal Heel",
    category: "shoes",
    collection: "Wedding",
    price: 7200, originalPrice: 8900,
    image: shoe1, gallery: [shoe1, shoe2],
    colors: ["Ivory", "Blush"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description: "The heel you'll walk down the aisle in — and keep wearing.",
    features: ["Silk satin upper", "Crystal detail", "Extra-padded insole"],
    tag: "Limited", rating: 5, reviews: 63, stock: 11,
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

export const WHATSAPP_NUMBER = "254700000000"; // placeholder — update in one place

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
