import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, getByCategory, type CategorySlug } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-layout";

export const Route = createFileRoute("/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cat.name} · Eloria Store` },
          { name: "description", content: loaderData.cat.tagline },
        ]
      : [{ title: "Category · Eloria" }],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <SiteShell><div className="mx-auto max-w-3xl px-6 py-32 text-center"><h1 className="font-display text-4xl">Collection not found</h1></div></SiteShell>
  ),
});

const SORTS = ["Featured", "Price: Low to High", "Price: High to Low", "New Arrivals"] as const;

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.slug === category)!;
  const slug = cat.slug as CategorySlug;
  const products = getByCategory(slug);

  const [collection, setCollection] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (collection) list = list.filter((p) => p.collection === collection);
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "New Arrivals") list = [...list].sort((a, b) => (a.tag === "New" ? -1 : 1));
    return list;
  }, [products, collection, maxPrice, sort]);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[340px] w-full overflow-hidden">
        <img src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-charcoal/20" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <div className="text-cream animate-fade-up">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70">
              <Link to="/" className="hover:text-cream">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span>{cat.name}</span>
            </nav>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">{cat.name}</h1>
            <p className="mt-2 max-w-md text-cream/85">{cat.tagline}</p>
          </div>
        </div>
      </section>

      {/* Collection chips */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCollection(null)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${!collection ? "border-charcoal bg-charcoal text-cream" : "border-border hover:bg-secondary"}`}
          >
            All
          </button>
          {cat.collections.map((c) => (
            <button
              key={c}
              onClick={() => setCollection(c === collection ? null : c)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${collection === c ? "border-charcoal bg-charcoal text-cream" : "border-border hover:bg-secondary"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Toolbar */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between gap-4 border-y border-border py-4">
          <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 text-sm">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{filtered.length} items</div>
          <select value={sort} onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])} className="bg-transparent text-sm outline-none">
            {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {showFilters && (
          <div className="mt-6 grid gap-6 rounded-2xl border border-border bg-secondary/30 p-6 md:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Max Price</div>
              <input type="range" min={2000} max={20000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-3 w-full accent-champagne-deep" />
              <div className="mt-1 text-sm">up to KSh {maxPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Color</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Ivory", "Champagne", "Black", "Blush", "Charcoal"].map((c) => (
                  <span key={c} className="rounded-full border border-border px-3 py-1 text-xs">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Style</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.collections.slice(0, 5).map((c) => (
                  <span key={c} className="rounded-full border border-border px-3 py-1 text-xs">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">No pieces match those filters yet.</p>
        )}
      </section>
    </SiteShell>
  );
}
