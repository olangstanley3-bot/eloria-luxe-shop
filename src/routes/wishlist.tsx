import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist · Eloria Store" }] }),
  component: WishPage,
});

function WishPage() {
  const { wishlist, productMap } = useCart();
  const items = wishlist.map((id) => productMap[id]).filter(Boolean);
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="font-display text-5xl">Wishlist</h1>
        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border bg-secondary/30 p-16 text-center">
            <p className="text-muted-foreground">Save pieces you love to find them here later.</p>
            <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">Start browsing</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
