import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { formatKES, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(product.id);
  const hoverImg = product.gallery && product.gallery.length > 1 ? product.gallery[1] : null;

  return (
    <Link to="/product/$id" params={{ id: product.id }} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={1200}
          className={`h-full w-full object-cover transition-all duration-700 ${hoverImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"}`}
        />
        {hoverImg && (
          <img
            src={hoverImg}
            alt={`${product.name} alternate view`}
            loading="lazy"
            width={900}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
          />
        )}
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground">
            {product.tag}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product.id);
          }}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur transition ${wished ? "text-destructive" : "text-foreground"}`}
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {product.collection}
          </div>
          <div className="mt-1 truncate text-sm font-medium">{product.name}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-current text-champagne-deep" />
            {product.rating} · {product.reviews}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold">{formatKES(product.price)}</div>
          {product.originalPrice && (
            <div className="text-xs text-muted-foreground line-through">
              {formatKES(product.originalPrice)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
