import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { formatKES } from "@/lib/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStoreProducts, useStoreCategories } from "@/lib/store";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const products = useStoreProducts();
  const categories = useStoreCategories();

  const results = useMemo(() => {
    let list = products;
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (!query.trim()) {
      return list.slice(0, 6);
    }
    const q = query.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colors.some((c) => c.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q)),
    );
  }, [products, query, selectedCategory]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 sm:rounded-3xl border-border bg-background shadow-luxe">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            placeholder="Search curtains, luxury handbags, heels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories chips */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-6 py-3 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All Pieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
            <span>{query.trim() ? `Search Results (${results.length})` : "Popular Picks"}</span>
            {!query.trim() && (
              <span className="flex items-center gap-1 text-champagne-deep font-medium">
                <Sparkles className="h-3 w-3" /> Trending
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No pieces found matching "{query}"</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for "curtains", "tote", or "blackout"
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to="/product/$id"
                  params={{ id: product.id }}
                  onClick={() => onOpenChange(false)}
                  className="group flex gap-4 rounded-2xl border border-border/60 p-3 transition hover:border-accent hover:bg-secondary/40"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {product.collection}
                      </div>
                      <div className="font-medium text-sm truncate group-hover:text-champagne-deep transition">
                        {product.name}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold">{formatKES(product.price)}</span>
                      <span className="text-[11px] text-muted-foreground group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        View <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
