import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Heart, MessageCircle, ShieldCheck, Truck, Undo2, Share2, Star } from "lucide-react";
import { formatKES, getProduct, getRelated, whatsappUrl } from "@/lib/products";
import { SiteShell } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} · Eloria Store` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Product · Eloria" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <SiteShell><div className="mx-auto max-w-3xl px-6 py-32 text-center"><h1 className="font-display text-4xl">Product not found</h1></div></SiteShell>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id)!;
  const { add, setOpen, toggleWish, wishlist } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(product.id);
  const related = getRelated(product.id);

  const addToCart = () => {
    add({ productId: product.id, qty, color, size });
    setOpen(true);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/$category" params={{ category: product.category }} className="hover:text-foreground capitalize">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/70 truncate">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-secondary">
            <img src={product.gallery[img]} alt={product.name} className="aspect-[4/5] w-full object-cover" width={900} height={1200} />
            {product.tag && (
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-widest">{product.tag}</span>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            {product.gallery.map((g, i) => (
              <button key={i} onClick={() => setImg(i)} className={`overflow-hidden rounded-xl border transition ${img === i ? "border-charcoal" : "border-border"}`}>
                <img src={g} alt="" className="h-20 w-16 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">{product.collection}</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-champagne-deep">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />)}
            </div>
            {product.rating} · {product.reviews} reviews
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="font-display text-3xl">{formatKES(product.price)}</div>
            {product.originalPrice && (
              <>
                <div className="text-muted-foreground line-through">{formatKES(product.originalPrice)}</div>
                <div className="rounded-full bg-blush/40 px-2 py-0.5 text-xs">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          {/* Colors */}
          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Color · <span className="text-foreground">{color}</span></div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-2 text-sm transition ${color === c ? "border-charcoal bg-charcoal text-cream" : "border-border hover:bg-secondary"}`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Size</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${size === s ? "border-charcoal bg-charcoal text-cream" : "border-border hover:bg-secondary"}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-7 w-7 rounded-full hover:bg-secondary">−</button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-7 w-7 rounded-full hover:bg-secondary">+</button>
            </div>
            <button onClick={addToCart} className="flex-1 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition min-w-40">
              Add to Bag · {formatKES(product.price * qty)}
            </button>
            <button onClick={() => toggleWish(product.id)} aria-label="Wishlist" className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${wished ? "border-destructive text-destructive" : "border-border hover:bg-secondary"}`}>
              <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <a
            href={whatsappUrl(`Hi Eloria! I'm interested in this product: ${product.name} (${formatKES(product.price)}).`)}
            target="_blank" rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] px-8 py-3 text-sm font-medium text-[#128C7E] hover:bg-[#25D366]/10 transition"
          >
            <MessageCircle className="h-4 w-4" /> I'm interested — WhatsApp us
          </a>

          {/* Perks */}
          <ul className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[
              { icon: Truck, label: "Free over KSh 10K" },
              { icon: Undo2, label: "14-day returns" },
              { icon: ShieldCheck, label: "Secure checkout" },
            ].map((f) => (
              <li key={f.label} className="rounded-2xl border border-border bg-card p-3 text-center">
                <f.icon className="mx-auto h-4 w-4 text-champagne-deep" />
                <div className="mt-1">{f.label}</div>
              </li>
            ))}
          </ul>

          {/* Details */}
          <details open className="mt-8 border-t border-border pt-6">
            <summary className="cursor-pointer text-sm font-medium">Features & Details</summary>
            <ul className="mt-3 space-y-1 text-sm text-foreground/80 list-disc pl-5">
              {product.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </details>
          <details className="mt-4 border-t border-border pt-6">
            <summary className="cursor-pointer text-sm font-medium">Shipping & Returns</summary>
            <p className="mt-3 text-sm text-foreground/80">Same-day dispatch in Nairobi. Nationwide delivery in 2–3 business days. 14-day easy returns for unworn pieces in original packaging.</p>
          </details>

          <button className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <Share2 className="h-3.5 w-3.5" /> Share this piece
          </button>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="font-display text-3xl">You may also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
