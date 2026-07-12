import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-layout";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag · Eloria Store" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, productMap, setQty, remove, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "ELORIA10") setDiscount(0.1);
    else setDiscount(0);
  };

  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
  const total = Math.round(subtotal * (1 - discount)) + shipping;

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="font-display text-5xl">Your Bag</h1>
        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border bg-secondary/30 p-16 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Continue shopping</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <ul className="divide-y divide-border border-y border-border">
                {items.map((it) => {
                  const p = productMap[it.productId];
                  if (!p) return null;
                  return (
                    <li key={`${it.productId}-${it.color}-${it.size}`} className="flex gap-6 py-6">
                      <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                        <img src={p.image} alt={p.name} className="h-32 w-24 rounded-xl object-cover" />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.collection}</div>
                            <Link to="/product/$id" params={{ id: p.id }} className="mt-1 block font-medium">{p.name}</Link>
                            <div className="mt-1 text-xs text-muted-foreground">{[it.color, it.size].filter(Boolean).join(" · ")}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatKES(p.price * it.qty)}</div>
                            <button onClick={() => remove(it.productId)} className="mt-2 text-xs text-muted-foreground underline underline-offset-2 hover:text-destructive">Remove</button>
                          </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                          <button onClick={() => setQty(it.productId, it.qty - 1)} className="h-6 w-6 rounded-full hover:bg-secondary">−</button>
                          <span className="w-6 text-center text-sm">{it.qty}</span>
                          <button onClick={() => setQty(it.productId, it.qty + 1)} className="h-6 w-6 rounded-full hover:bg-secondary">+</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex justify-between text-sm">
                <button onClick={clear} className="text-muted-foreground underline underline-offset-2">Clear bag</button>
                <Link to="/" className="underline underline-offset-2">Continue shopping</Link>
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-secondary/30 p-6">
              <h2 className="font-display text-2xl">Summary</h2>

              <div className="mt-5">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Coupon</label>
                <div className="mt-2 flex gap-2">
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Try ELORIA10" className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none" />
                  <button onClick={applyCoupon} className="rounded-full bg-charcoal px-4 py-2 text-xs uppercase tracking-widest text-cream">Apply</button>
                </div>
                {discount > 0 && <p className="mt-2 text-xs text-champagne-deep">10% discount applied.</p>}
              </div>

              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatKES(subtotal)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-champagne-deep"><dt>Discount</dt><dd>−{formatKES(Math.round(subtotal * discount))}</dd></div>}
                <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Complimentary" : formatKES(shipping)}</dd></div>
              </dl>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
                <span>Total</span><span>{formatKES(total)}</span>
              </div>

              <button className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90">Secure checkout</button>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="rounded-full border px-2 py-1">M-Pesa</span>
                <span className="rounded-full border px-2 py-1">Visa</span>
                <span className="rounded-full border px-2 py-1">Mastercard</span>
                <span className="rounded-full border px-2 py-1">COD</span>
              </div>
            </aside>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
