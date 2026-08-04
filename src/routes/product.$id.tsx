import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  MessageCircle,
  ShieldCheck,
  Truck,
  Undo2,
  Share2,
  Star,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatKES } from "@/lib/products";
import { SiteShell } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStoreProducts, useBusinessSettings } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
      </div>
    </SiteShell>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const allProducts = useStoreProducts();
  const business = useBusinessSettings();
  const product = allProducts.find((p) => p.id === id);

  const { add, setOpen, toggleWish, wishlist } = useCart();
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setColor(product.colors[0] || "");
      setSize(product.sizes[0] || "");
    }
  }, [product]);

  if (!product) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-display text-4xl">Product not found</h1>
          <p className="mt-4 text-muted-foreground">
            The requested product could not be located in our catalog.
          </p>
          <Link to="/" className="mt-6 inline-block underline">
            Return to Home
          </Link>
        </div>
      </SiteShell>
    );
  }

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappUrl = (message: string) =>
    `https://wa.me/${business.whatsappNumber || "254742461744"}?text=${encodeURIComponent(message)}`;
  const wished = wishlist.includes(product.id);

  const addToCart = () => {
    add({ productId: product.id, qty, color, size });
    setOpen(true);
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to="/$category"
            params={{ category: product.category }}
            className="hover:text-foreground capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/70 truncate">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div
            className="group relative overflow-hidden rounded-3xl bg-secondary cursor-zoom-in"
            onClick={() => setZoomOpen(true)}
          >
            <img
              src={product.gallery[img]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={900}
              height={1200}
            />
            {product.tag && (
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-widest">
                {product.tag}
              </span>
            )}
            <button
              aria-label="Zoom image"
              onClick={(e) => {
                e.stopPropagation();
                setZoomOpen(true);
              }}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-soft hover:bg-background transition"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {product.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setImg(i)}
                className={`overflow-hidden rounded-xl border transition shrink-0 ${img === i ? "border-charcoal ring-2 ring-charcoal/20" : "border-border hover:border-accent"}`}
              >
                <img src={g} alt="" className="h-20 w-16 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep font-semibold">
              {product.collection}
            </div>
            {product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" /> Only {product.stock} left in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> In Stock &amp; Ready for Dispatch
              </span>
            )}
          </div>

          <h1 className="mt-2 font-display text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-champagne-deep">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            {product.rating} · {product.reviews} reviews
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="font-display text-3xl">{formatKES(product.price)}</div>
            {product.originalPrice && (
              <>
                <div className="text-muted-foreground line-through">
                  {formatKES(product.originalPrice)}
                </div>
                <div className="rounded-full bg-blush/40 px-2.5 py-0.5 text-xs font-medium">
                  Save{" "}
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100,
                  )}
                  %
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          {/* Colors */}
          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Color · <span className="text-foreground font-semibold">{color}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${color === c ? "border-charcoal bg-charcoal text-cream font-medium" : "border-border hover:bg-secondary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Size · <span className="text-foreground font-semibold">{size}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${size === s ? "border-charcoal bg-charcoal text-cream font-medium" : "border-border hover:bg-secondary"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-7 w-7 rounded-full hover:bg-secondary"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-7 w-7 rounded-full hover:bg-secondary"
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
              className="flex-1 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition min-w-40 shadow-soft"
            >
              Add to Bag · {formatKES(product.price * qty)}
            </button>
            <button
              onClick={() => toggleWish(product.id)}
              aria-label="Wishlist"
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${wished ? "border-destructive text-destructive" : "border-border hover:bg-secondary"}`}
            >
              <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <a
            href={whatsappUrl(
              `Hello Eloria Store, I'd like to order: ${product.name} (Color: ${color}, Size: ${size}, Qty: ${qty}) - Total ${formatKES(product.price * qty)}. Please confirm delivery to my address!`,
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-medium text-white hover:bg-[#20bd5a] transition shadow-soft"
          >
            <MessageCircle className="h-4 w-4" /> Quick Buy via WhatsApp
          </a>

          {/* Perks */}
          <ul className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[
              { icon: Truck, label: "Free over KSh 10K" },
              { icon: Undo2, label: "14-day returns" },
              { icon: ShieldCheck, label: "M-Pesa verified" },
            ].map((f) => (
              <li
                key={f.label}
                className="rounded-2xl border border-border bg-card p-3 text-center"
              >
                <f.icon className="mx-auto h-4 w-4 text-champagne-deep" />
                <div className="mt-1 font-medium">{f.label}</div>
              </li>
            ))}
          </ul>

          {/* Details */}
          <details open className="mt-8 border-t border-border pt-6">
            <summary className="cursor-pointer text-sm font-medium">Features &amp; Details</summary>
            <ul className="mt-3 space-y-1 text-sm text-foreground/80 list-disc pl-5">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </details>
          <details className="mt-4 border-t border-border pt-6">
            <summary className="cursor-pointer text-sm font-medium">Shipping &amp; Returns</summary>
            <p className="mt-3 text-sm text-foreground/80">
              Same-day dispatch in Nairobi. Nationwide delivery in 2–3 business days. 14-day easy
              returns for unworn pieces in original packaging.
            </p>
          </details>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href });
              }
            }}
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-3.5 w-3.5" /> Share this piece
          </button>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-charcoal border-none">
          <div className="relative flex items-center justify-center p-4">
            <img
              src={product.gallery[img]}
              alt={product.name}
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="font-display text-3xl">You may also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
