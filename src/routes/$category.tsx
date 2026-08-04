import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, SlidersHorizontal } from "lucide-react";
import { type CategorySlug } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-layout";
import { useStoreProducts, useStoreCategories } from "@/lib/store";

export const Route = createFileRoute("/$category")({
  validateSearch: (search: Record<string, unknown>): { collection?: string } => {
    return {
      collection: typeof search.collection === "string" ? search.collection : undefined,
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Collection not found</h1>
      </div>
    </SiteShell>
  ),
});

const SORTS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newness & New Arrivals", value: "newness" },
] as const;

type SortOption = (typeof SORTS)[number]["value"];

function CategoryPage() {
  const { category } = Route.useParams();
  const search = Route.useSearch();
  const categories = useStoreCategories();
  const allProducts = useStoreProducts();

  const cat = categories.find((c) => c.slug === category) || {
    slug: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    tagline: `Shop ${category} products in Nairobi`,
    image: "",
    collections: [],
  };

  const products = allProducts.filter((p) => p.category === category);

  const [collection, setCollection] = useState<string | null>(search.collection || null);

  useEffect(() => {
    setCollection(search.collection || null);
  }, [search.collection, category]);

  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (collection) {
      const targetCol = collection.toLowerCase();
      list = list.filter(
        (p) =>
          p.collection.toLowerCase() === targetCol ||
          p.collection.toLowerCase().includes(targetCol) ||
          targetCol.includes(p.collection.toLowerCase()) ||
          p.name.toLowerCase().includes(targetCol),
      );
    }
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newness")
      list = [...list].sort((a, b) => {
        if (a.tag === "New" && b.tag !== "New") return -1;
        if (b.tag === "New" && a.tag !== "New") return 1;
        return 0;
      });
    return list;
  }, [products, collection, maxPrice, sort]);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[340px] w-full overflow-hidden">
        <img
          src={cat.image}
          alt={cat.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-charcoal/20" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <div className="text-cream animate-fade-up">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70">
              <Link to="/" className="hover:text-cream">
                Home
              </Link>
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider hover:bg-secondary transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>

          <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:inline-block">
              Sort by:
            </span>
            <div className="relative inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 shadow-soft transition hover:border-accent">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-champagne-deep shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-transparent text-xs font-medium text-foreground outline-none cursor-pointer pr-1"
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-background text-foreground">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 grid gap-6 rounded-2xl border border-border bg-secondary/30 p-6 md:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Max Price
              </div>
              <input
                type="range"
                min={2000}
                max={20000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-champagne-deep"
              />
              <div className="mt-1 text-sm">up to KSh {maxPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Color</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Ivory", "Champagne", "Black", "Blush", "Charcoal"].map((c) => (
                  <span key={c} className="rounded-full border border-border px-3 py-1 text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Style</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.collections.slice(0, 5).map((c) => (
                  <span key={c} className="rounded-full border border-border px-3 py-1 text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No pieces match those filters yet.
          </p>
        )}
      </section>
    </SiteShell>
  );
}
