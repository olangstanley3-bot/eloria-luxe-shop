import { Link } from "@tanstack/react-router";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  MessageCircle,
  ArrowUp,
  Instagram,
  Facebook,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { SearchDialog } from "@/components/search-dialog";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { useBusinessSettings, useHomepageSettings, useStoreCategories } from "@/lib/store";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const business = useBusinessSettings();
  const homepage = useHomepageSettings();
  const categories = useStoreCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    "Hi Eloria! I'd like to place an order.",
  )}`;

  return (
    <>
      <div className="bg-charcoal text-cream text-[11px] tracking-[0.2em] uppercase py-2.5 text-center px-4">
        <span className="hidden sm:inline">{homepage.bannerAnnouncement} · </span>
        <a href={`tel:${business.whatsappNumber}`} className="hover:underline">
          Call {business.phoneDisplay}
        </a>
        <span className="mx-2 opacity-40">|</span>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:underline">
          WhatsApp us
        </a>
      </div>
      <header
        className={`sticky top-0 z-40 transition-all ${
          scrolled ? "glass shadow-soft" : "bg-background/60 backdrop-blur"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-tight">{business.storeName}</span>
          </Link>

          <ul className="hidden md:flex items-center gap-3 lg:gap-6 text-xs lg:text-sm font-medium">
            <li>
              <Link
                to="/"
                className="py-2 text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100"
              >
                Home
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug} className="group relative">
                <Link
                  to="/$category"
                  params={{ category: c.slug }}
                  className="flex items-center gap-0.5 lg:gap-1 py-2 text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100 whitespace-nowrap"
                >
                  <span>{c.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-hover:rotate-180 shrink-0" />
                </Link>

                {/* Subcategory Dropdown */}
                <div className="absolute left-0 top-full hidden pt-2 group-hover:block z-50 min-w-[240px]">
                  <div className="rounded-2xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur-md">
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1">
                      {c.name}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto space-y-0.5">
                      {c.collections.map((col) => (
                        <Link
                          key={col}
                          to="/$category"
                          params={{ category: c.slug }}
                          search={{ collection: col }}
                          className="block rounded-lg px-3 py-1.5 text-xs text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          {col}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="py-2 text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:after:scale-x-100 whitespace-nowrap"
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <AdminHeaderNavButton />
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:text-accent-foreground/70 transition"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="p-2 hover:opacity-70 transition">
              <Heart className="h-5 w-5" />
            </Link>
            <button
              aria-label="Cart"
              onClick={() => setOpen(true)}
              className="relative p-2 hover:opacity-70 transition"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-charcoal px-1 text-[10px] font-semibold text-cream">
                  {count}
                </span>
              )}
            </button>
            <AuthHeaderLink />
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="font-display text-2xl">Eloria</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-6 space-y-6">
            {categories.map((c) => (
              <div key={c.slug} className="space-y-2">
                <Link
                  to="/$category"
                  params={{ category: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-xl font-medium text-foreground hover:text-accent transition-colors block"
                >
                  {c.name}
                </Link>
                <div className="pl-3 border-l border-border/70 space-y-1.5 pt-1">
                  {c.collections.map((col) => (
                    <Link
                      key={col}
                      to="/$category"
                      params={{ category: c.slug }}
                      search={{ collection: col }}
                      onClick={() => setMobileOpen(false)}
                      className="block text-xs text-muted-foreground hover:text-foreground py-0.5"
                    >
                      {col}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border space-y-3 text-sm">
              <Link to="/about" onClick={() => setMobileOpen(false)} className="block font-medium">
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block font-medium"
              >
                Contact Us
              </Link>
              <MobileAuthLink onClick={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function AdminHeaderNavButton() {
  return (
    <Link
      to="/admin"
      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition shrink-0"
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      <span>View Admin Dashboard</span>
    </Link>
  );
}

function AuthHeaderLink() {
  const { user, isLoading, signOut } = useAuth();
  if (isLoading) {
    return <div className="h-5 w-5" />;
  }
  if (!user) {
    return (
      <Link
        to="/auth"
        aria-label="Sign in"
        className="flex items-center gap-1.5 p-2 text-sm font-medium hover:opacity-70 transition md:px-0"
      >
        <User className="h-5 w-5" />
        <span className="hidden md:inline">Sign In</span>
      </Link>
    );
  }
  return (
    <div className="group relative">
      <button aria-label="Account" className="p-2 hover:opacity-70 transition">
        <User className="h-5 w-5" />
      </button>
      <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-2xl border border-border bg-card p-2 shadow-luxe group-hover:block">
        <div className="px-3 py-2">
          <div className="text-sm font-medium">{user.fullName || user.email}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </div>
        <Link to="/admin" className="block rounded-xl px-3 py-2 text-sm hover:bg-accent/20">
          View Admin Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

function MobileAuthLink({ onClick }: { onClick: () => void }) {
  const { user, signOut } = useAuth();
  if (!user) {
    return (
      <Link to="/auth" onClick={onClick} className="flex items-center gap-2 text-primary">
        <User className="h-5 w-5" /> Sign In / Create Account
      </Link>
    );
  }
  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground truncate">{user.email}</div>
      <Link to="/admin" onClick={onClick} className="block text-primary">
        Admin Dashboard
      </Link>
      <button
        onClick={() => {
          onClick();
          signOut();
        }}
        className="flex items-center gap-2 text-destructive"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}

export function SiteFooter() {
  const business = useBusinessSettings();
  const categories = useStoreCategories();

  const whatsappUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    "Hi Eloria!",
  )}`;

  return (
    <footer className="mt-24 border-t border-border bg-cream/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl">{business.storeName}</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            {business.tagline ||
              "Premium curtains, elegant handbags and fashionable ladies' shoes — thoughtfully curated, affordably priced."}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={business.instagramUrl || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full border border-border hover:bg-accent/20 transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={business.facebookUrl || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full border border-border hover:bg-accent/20 transition"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="p-2 rounded-full border border-border hover:bg-accent/20 transition"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-4 space-y-1.5 text-sm text-foreground/80">
            <a href={`tel:${business.phoneDisplay}`} className="block hover:text-foreground">
              {business.phoneDisplay}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="block hover:text-foreground"
            >
              WhatsApp: {business.phoneDisplay}
            </a>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(business.location)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5" /> {business.location}
            </a>
          </div>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/$category"
                  params={{ category: c.slug }}
                  className="hover:text-foreground text-foreground/80"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Customer Care
          </div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>Shipping &amp; Delivery</li>
            <li>Returns &amp; Refunds</li>
            <li>Size Guide</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            The List
          </div>
          <p className="text-sm text-muted-foreground">
            Sign up for early access, private sales and styling notes.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Join
            </button>
          </form>
          <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="rounded-full border px-2 py-1">M-Pesa</span>
            <span className="rounded-full border px-2 py-1">Visa</span>
            <span className="rounded-full border px-2 py-1">Mastercard</span>
            <span className="rounded-full border px-2 py-1">Airtel</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Eloria Store. Crafted with care.
      </div>
    </footer>
  );
}

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const business = useBusinessSettings();

  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const whatsappLink = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    "Hi Eloria! I'd like some help.",
  )}`;

  return (
    <>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe hover:scale-105 transition"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      {showTop && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft hover:opacity-90 transition"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </>
  );
}

export function CartDrawer() {
  const { open, setOpen, items, productMap, setQty, remove, subtotal } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-luxe">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h3 className="font-display text-xl">Your Bag</h3>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">Your bag is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => {
                const p = productMap[it.productId];
                if (!p) return null;
                return (
                  <li key={`${it.productId}-${it.color}-${it.size}`} className="flex gap-4">
                    <img src={p.image} alt={p.name} className="h-24 w-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {[it.color, it.size].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                        <button onClick={() => remove(it.productId)} aria-label="Remove">
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <button
                            onClick={() => setQty(it.productId, it.qty - 1)}
                            className="h-7 w-7 rounded-full border"
                          >
                            −
                          </button>
                          <span className="w-6 text-center">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.productId, it.qty + 1)}
                            className="h-7 w-7 rounded-full border"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm font-medium">
                          KSh {(p.price * it.qty).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="mt-4 block w-full rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingActions />
      <CartDrawer />
    </div>
  );
}
