import { useState, useEffect } from "react";
import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  Product,
  CategorySlug,
} from "./products";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  collections: string[];
  description?: string;
  subcategories?: string[];
  bannerImage?: string;
  sortOrder?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  productName?: string;
  avatar?: string;
};

export type PromoBanner = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaCategory: string;
  image: string;
};

export type HomepageSettings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroSliderImages?: string[];
  heroCtaText: string;
  heroCtaCategory: string;
  bannerAnnouncement: string;
  flashSaleTitle: string;
  flashSaleEndTime: string;
  featuredProductIds?: string[];
  bestSellerProductIds?: string[];
  newArrivalProductIds?: string[];
  flashSaleProductIds?: string[];
  promoBanners?: PromoBanner[];
  testimonials?: Testimonial[];
};

export type MediaAsset = {
  id: string;
  url: string;
  title: string;
  folder: string; // e.g., "Curtains", "Bedding", "Handbags", "Shoes", "Banners", "General"
  createdAt?: string;
};

export type BusinessSettings = {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  whatsappNumber: string;
  phoneDisplay: string;
  email: string;
  location: string;
  businessHours?: string;
  footerText?: string;
  contactText?: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
};

export type PaymentSettings = {
  mpesaTill: string;
  mpesaPaybill: string;
  mpesaAccountName: string;
  mpesaConsumerKey?: string;
  mpesaConsumerSecret?: string;
  mpesaPasskey?: string;
  enableMpesa: boolean;
  enableCard: boolean;
  cardGateway?: string;
  cardApiKey?: string;
  enableAirtelMoney: boolean;
  airtelMerchantId?: string;
  enableBankTransfer: boolean;
  bankName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  enableCOD: boolean;
};

export type ShippingSettings = {
  nairobiRate: number;
  countrywideRate: number;
  freeShippingThreshold: number;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  location: string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentMethod: "M-Pesa" | "Card" | "Airtel Money" | "Bank Transfer" | "Pay on Delivery";
  status: OrderStatus;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: "Active" | "Blocked";
};

export type Coupon = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend?: number;
  expiresAt: string;
  usageCount: number;
  active: boolean;
};

// STORAGE KEYS
const KEYS = {
  PRODUCTS: "eloria_store_products_v1",
  CATEGORIES: "eloria_store_categories_v1",
  HOMEPAGE: "eloria_store_homepage_v1",
  BUSINESS: "eloria_store_business_v1",
  PAYMENT: "eloria_store_payment_v1",
  SHIPPING: "eloria_store_shipping_v1",
  NAV: "eloria_store_nav_v1",
  ORDERS: "eloria_store_orders_v1",
  CUSTOMERS: "eloria_store_customers_v1",
  COUPONS: "eloria_store_coupons_v1",
  MEDIA: "eloria_store_media_v1",
};

// DEFAULT INITIAL VALUES
const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroBadge: "New Season 2026",
  heroTitle: "Style Your Home. Elevate Your Wardrobe.",
  heroSubtitle:
    "Premium curtains, luxury bedding, elegant handbags, and fashionable ladies' shoes — quietly luxurious, remarkably affordable.",
  heroImage:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
  heroCtaText: "Shop Handbags",
  heroCtaCategory: "handbags",
  bannerAnnouncement:
    "🎉 Free Delivery in Nairobi for orders above KSh 10,000 | Instant WhatsApp Support +254 742 461 744",
  flashSaleTitle: "Weekly Flash Sales & Special Deals",
  flashSaleEndTime: "2026-12-31T23:59:59",
};

const DEFAULT_BUSINESS: BusinessSettings = {
  storeName: "Eloria Store",
  tagline: "Luxury Curtains, Bedding, Handbags & Shoes in Nairobi",
  logoUrl: "",
  whatsappNumber: "254742461744",
  phoneDisplay: "+254 742 461 744",
  email: "hello@eloriastore.co.ke",
  location: "Kamukunji, Nairobi, Kenya",
  businessHours: "Mon - Sat: 8:00 AM - 6:30 PM | Sun: Closed",
  footerText: "© 2026 Eloria Store. All rights reserved. Quality luxury home & fashion in Nairobi.",
  contactText:
    "Contact our customer support team for queries, bulk orders, and custom curtain sizing.",
  instagramUrl: "https://www.instagram.com/eloriastore1?utm_source=qr&igsh=ZDc0dzZhaXgzNHY4",
  facebookUrl: "https://www.facebook.com/eloriastore1",
  tiktokUrl: "https://www.tiktok.com/@eloriastore",
};

const DEFAULT_PAYMENT: PaymentSettings = {
  mpesaTill: "5920311",
  mpesaPaybill: "247247",
  mpesaAccountName: "ELORIA STORE",
  mpesaConsumerKey: "",
  mpesaConsumerSecret: "",
  mpesaPasskey: "",
  enableMpesa: true,
  enableCard: true,
  cardGateway: "Visa / Mastercard / Flutterwave",
  cardApiKey: "",
  enableAirtelMoney: true,
  airtelMerchantId: "ELORIA_AIRTEL",
  enableBankTransfer: true,
  bankName: "KCB Bank Kenya",
  bankAccountNumber: "1289004821",
  bankBranch: "Nairobi Central",
  enableCOD: true,
};

const DEFAULT_SHIPPING: ShippingSettings = {
  nairobiRate: 300,
  countrywideRate: 500,
  freeShippingThreshold: 10000,
};

const DEFAULT_NAV: NavItem[] = [
  { id: "nav_1", label: "Curtains", href: "/curtains" },
  { id: "nav_2", label: "Bedding", href: "/bedding" },
  { id: "nav_3", label: "Handbags", href: "/handbags" },
  { id: "nav_4", label: "Shoes", href: "/shoes" },
  { id: "nav_5", label: "Home Accessories", href: "/home-accessories" },
  { id: "nav_6", label: "About Us", href: "/about" },
  { id: "nav_7", label: "Contact", href: "/contact" },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ord_101",
    orderNumber: "ELO-84920",
    customerName: "Grace Wambui",
    customerPhone: "+254 712 345 678",
    customerEmail: "grace.wambui@example.com",
    location: "Kilimani, Nairobi",
    date: "2026-08-01",
    items: [
      { id: "royal-blue-grommet-curtain", name: "Royal Blue Grommet Curtain", qty: 2, price: 3800 },
      { id: "sheer-white-panel", name: "Sheer White Panel with Accents", qty: 1, price: 3200 },
    ],
    total: 10800,
    paymentMethod: "M-Pesa",
    status: "Processing",
  },
  {
    id: "ord_102",
    orderNumber: "ELO-84921",
    customerName: "David Ochieng",
    customerPhone: "+254 722 987 654",
    customerEmail: "david.o@example.com",
    location: "Westlands, Nairobi",
    date: "2026-08-01",
    items: [
      { id: "atelier-jacquard-drapes", name: "Atelier Jacquard Drapes", qty: 1, price: 8500 },
    ],
    total: 8500,
    paymentMethod: "Card",
    status: "Shipped",
  },
  {
    id: "ord_103",
    orderNumber: "ELO-84922",
    customerName: "Amina Hussein",
    customerPhone: "+254 733 112 233",
    customerEmail: "amina.h@example.com",
    location: "Mombasa Town",
    date: "2026-07-31",
    items: [
      {
        id: "luxury-duvet-set-navy",
        name: "Luxury Satin Duvet Set - Royal Navy",
        qty: 1,
        price: 6800,
      },
      {
        id: "orthopedic-mattress-topper",
        name: "Orthopedic High-Density Mattress Topper",
        qty: 1,
        price: 8500,
      },
    ],
    total: 15300,
    paymentMethod: "M-Pesa",
    status: "Delivered",
  },
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "cust_1",
    name: "Grace Wambui",
    email: "grace.wambui@example.com",
    phone: "+254 712 345 678",
    location: "Kilimani, Nairobi",
    totalOrders: 4,
    totalSpent: 34500,
    joinedDate: "2026-01-15",
    status: "Active",
  },
  {
    id: "cust_2",
    name: "David Ochieng",
    email: "david.o@example.com",
    phone: "+254 722 987 654",
    location: "Westlands, Nairobi",
    totalOrders: 2,
    totalSpent: 12400,
    joinedDate: "2026-03-22",
    status: "Active",
  },
  {
    id: "cust_3",
    name: "Amina Hussein",
    email: "amina.h@example.com",
    phone: "+254 733 112 233",
    location: "Mombasa Town",
    totalOrders: 5,
    totalSpent: 52000,
    joinedDate: "2025-11-04",
    status: "Active",
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coup_1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minSpend: 2000,
    expiresAt: "2026-12-31",
    usageCount: 42,
    active: true,
  },
  {
    id: "coup_2",
    code: "ELORIA1000",
    discountType: "fixed",
    discountValue: 1000,
    minSpend: 10000,
    expiresAt: "2026-09-30",
    usageCount: 18,
    active: true,
  },
];

// READ HELPERS WITH LOCAL STORAGE PERSISTENCE
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("eloria_store_updated", { detail: { key } }));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// GETTERS
export function getStoreProducts(): Product[] {
  return readStorage<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function getStoreCategories(): Category[] {
  return readStorage<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES as Category[]);
}

export function getHomepageSettings(): HomepageSettings {
  return readStorage<HomepageSettings>(KEYS.HOMEPAGE, DEFAULT_HOMEPAGE);
}

export function getBusinessSettings(): BusinessSettings {
  return readStorage<BusinessSettings>(KEYS.BUSINESS, DEFAULT_BUSINESS);
}

export function getPaymentSettings(): PaymentSettings {
  return readStorage<PaymentSettings>(KEYS.PAYMENT, DEFAULT_PAYMENT);
}

export function getShippingSettings(): ShippingSettings {
  return readStorage<ShippingSettings>(KEYS.SHIPPING, DEFAULT_SHIPPING);
}

export function getNavMenus(): NavItem[] {
  return readStorage<NavItem[]>(KEYS.NAV, DEFAULT_NAV);
}

export function getStoreOrders(): Order[] {
  return readStorage<Order[]>(KEYS.ORDERS, DEFAULT_ORDERS);
}

export function getStoreCustomers(): Customer[] {
  return readStorage<Customer[]>(KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
}

export function getStoreCoupons(): Coupon[] {
  return readStorage<Coupon[]>(KEYS.COUPONS, DEFAULT_COUPONS);
}

export function getStoreMedia(): MediaAsset[] {
  const initialMedia: MediaAsset[] = INITIAL_PRODUCTS.flatMap((p) =>
    (p.gallery || [p.image]).map((imgUrl, i) => ({
      id: `media_${p.id}_${i}`,
      url: imgUrl,
      title: `${p.name} - Image ${i + 1}`,
      folder:
        p.category === "curtains"
          ? "Curtains"
          : p.category === "bedding"
            ? "Bedding"
            : p.category === "handbags"
              ? "Handbags"
              : p.category === "shoes"
                ? "Shoes"
                : "Home Accessories",
      createdAt: "2026-08-01T00:00:00.000Z",
    })),
  );
  return readStorage<MediaAsset[]>(KEYS.MEDIA, initialMedia);
}

// WRITERS & CRUD OPERATIONS

export function saveStoreMedia(asset: MediaAsset): void {
  const current = getStoreMedia();
  const index = current.findIndex((m) => m.id === asset.id);
  let updated: MediaAsset[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = asset;
  } else {
    updated = [asset, ...current];
  }
  writeStorage(KEYS.MEDIA, updated);
}

export function deleteStoreMedia(id: string): void {
  const current = getStoreMedia();
  const updated = current.filter((m) => m.id !== id);
  writeStorage(KEYS.MEDIA, updated);
}

export function saveStoreProduct(product: Product): void {
  const current = getStoreProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  writeStorage(KEYS.PRODUCTS, updated);
}

export function deleteStoreProduct(id: string): void {
  const current = getStoreProducts();
  const updated = current.filter((p) => p.id !== id);
  writeStorage(KEYS.PRODUCTS, updated);
}

export function saveStoreCategory(category: Category): void {
  const current = getStoreCategories();
  const index = current.findIndex((c) => c.slug === category.slug);
  let updated: Category[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }
  writeStorage(KEYS.CATEGORIES, updated);
}

export function deleteStoreCategory(slug: string): void {
  const current = getStoreCategories();
  const updated = current.filter((c) => c.slug !== slug);
  writeStorage(KEYS.CATEGORIES, updated);
}

export function saveHomepageSettings(settings: HomepageSettings): void {
  writeStorage(KEYS.HOMEPAGE, settings);
}

export function saveBusinessSettings(settings: BusinessSettings): void {
  writeStorage(KEYS.BUSINESS, settings);
}

export function savePaymentSettings(settings: PaymentSettings): void {
  writeStorage(KEYS.PAYMENT, settings);
}

export function saveShippingSettings(settings: ShippingSettings): void {
  writeStorage(KEYS.SHIPPING, settings);
}

export function saveNavMenus(nav: NavItem[]): void {
  writeStorage(KEYS.NAV, nav);
}

export function saveStoreOrder(order: Order): void {
  const current = getStoreOrders();
  const index = current.findIndex((o) => o.id === order.id);
  let updated: Order[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = order;
  } else {
    updated = [order, ...current];
  }
  writeStorage(KEYS.ORDERS, updated);
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const current = getStoreOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
  writeStorage(KEYS.ORDERS, updated);
}

export function saveStoreCustomer(customer: Customer): void {
  const current = getStoreCustomers();
  const index = current.findIndex((c) => c.id === customer.id);
  let updated: Customer[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = customer;
  } else {
    updated = [customer, ...current];
  }
  writeStorage(KEYS.CUSTOMERS, updated);
}

export function toggleCustomerStatus(id: string): void {
  const current = getStoreCustomers();
  const updated = current.map((c) =>
    c.id === id
      ? { ...c, status: (c.status === "Active" ? "Blocked" : "Active") as "Active" | "Blocked" }
      : c,
  );
  writeStorage(KEYS.CUSTOMERS, updated);
}

export function saveStoreCoupon(coupon: Coupon): void {
  const current = getStoreCoupons();
  const index = current.findIndex((c) => c.id === coupon.id);
  let updated: Coupon[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = coupon;
  } else {
    updated = [coupon, ...current];
  }
  writeStorage(KEYS.COUPONS, updated);
}

export function deleteStoreCoupon(id: string): void {
  const current = getStoreCoupons();
  const updated = current.filter((c) => c.id !== id);
  writeStorage(KEYS.COUPONS, updated);
}

// REACT HOOKS FOR LIVE REACTIVITY (SSR & HYDRATION SAFE)
export function useStoreProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    setProducts(getStoreProducts());
    const handleUpdate = () => setProducts(getStoreProducts());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return products;
}

export function useStoreCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES as Category[]);

  useEffect(() => {
    setCategories(getStoreCategories());
    const handleUpdate = () => setCategories(getStoreCategories());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return categories;
}

export function useHomepageSettings(): HomepageSettings {
  const [homepage, setHomepage] = useState<HomepageSettings>(DEFAULT_HOMEPAGE);

  useEffect(() => {
    setHomepage(getHomepageSettings());
    const handleUpdate = () => setHomepage(getHomepageSettings());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return homepage;
}

export function useBusinessSettings(): BusinessSettings {
  const [business, setBusiness] = useState<BusinessSettings>(DEFAULT_BUSINESS);

  useEffect(() => {
    setBusiness(getBusinessSettings());
    const handleUpdate = () => setBusiness(getBusinessSettings());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return business;
}

export function usePaymentSettings(): PaymentSettings {
  const [payment, setPayment] = useState<PaymentSettings>(DEFAULT_PAYMENT);

  useEffect(() => {
    setPayment(getPaymentSettings());
    const handleUpdate = () => setPayment(getPaymentSettings());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return payment;
}

export function useShippingSettings(): ShippingSettings {
  const [shipping, setShipping] = useState<ShippingSettings>(DEFAULT_SHIPPING);

  useEffect(() => {
    setShipping(getShippingSettings());
    const handleUpdate = () => setShipping(getShippingSettings());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return shipping;
}

export function useNavMenus(): NavItem[] {
  const [nav, setNav] = useState<NavItem[]>(DEFAULT_NAV);

  useEffect(() => {
    setNav(getNavMenus());
    const handleUpdate = () => setNav(getNavMenus());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return nav;
}

export function useStoreOrders(): Order[] {
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);

  useEffect(() => {
    setOrders(getStoreOrders());
    const handleUpdate = () => setOrders(getStoreOrders());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return orders;
}

export function useStoreCustomers(): Customer[] {
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);

  useEffect(() => {
    setCustomers(getStoreCustomers());
    const handleUpdate = () => setCustomers(getStoreCustomers());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return customers;
}

export function useStoreCoupons(): Coupon[] {
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);

  useEffect(() => {
    setCoupons(getStoreCoupons());
    const handleUpdate = () => setCoupons(getStoreCoupons());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return coupons;
}

export function useStoreMedia(): MediaAsset[] {
  const [media, setMedia] = useState<MediaAsset[]>([]);

  useEffect(() => {
    setMedia(getStoreMedia());
    const handleUpdate = () => setMedia(getStoreMedia());
    window.addEventListener("eloria_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("eloria_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return media;
}
