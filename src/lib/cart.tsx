import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

export type CartItem = {
  productId: string;
  qty: number;
  color?: string;
  size?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  productMap: Record<string, Product>;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_KEY = "eloria.cart.v1";
const WISH_KEY = "eloria.wish.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setItems(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const productMap = useMemo(() => {
    const m: Record<string, Product> = {};
    for (const p of PRODUCTS) m[p.id] = p;
    return m;
  }, []);

  const value: CartCtx = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + (productMap[i.productId]?.price ?? 0) * i.qty, 0);
    return {
      items, wishlist, open, setOpen, productMap, count, subtotal,
      add: (item) => setItems((prev) => {
        const idx = prev.findIndex(
          (x) => x.productId === item.productId && x.color === item.color && x.size === item.size
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
          return next;
        }
        return [...prev, item];
      }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.productId !== id)),
      setQty: (id, qty) => setItems((prev) => prev.map((i) => i.productId === id ? { ...i, qty: Math.max(1, qty) } : i)),
      clear: () => setItems([]),
      toggleWish: (id) => setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
    };
  }, [items, wishlist, open, productMap]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
