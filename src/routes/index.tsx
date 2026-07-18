import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Undo2, HeartHandshake, Star } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eloria Store · Luxury Curtains, Bedding, Handbags & Shoes in Nairobi" },
      { name: "description", content: "Shop premium curtains, luxury bedding sets, elegant handbags and ladies' shoes in Nairobi, Kenya. Order via WhatsApp +254 742 461 744. Delivery countrywide." },
      { property: "og:title", content: "Eloria Store · Luxury Curtains, Bedding, Handbags & Shoes in Nairobi" },
      { property: "og:description", content: "Premium curtains, luxury bedding, handbags & shoes in Nairobi, Kenya. Order via WhatsApp." },
      { property: "og:url", content: "https://eloria-luxe-shop.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://eloria-luxe-shop.lovable.app/" }],
  }),
  component: Home,
});

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.tag === "Bestseller").slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.tag === "New" || p.tag === "Limited").slice(0, 6);
  const trending = PRODUCTS.slice(0, 8);
  const flash = PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);
  const { d, h, m, s } = useCountdown(Date.now() + 1000 * 60 * 60 * 26);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[92vh] min-h-[640px] w-full">
          <img
            src={heroImg} alt="" width={1920} height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/25 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
            <div className="max-w-xl text-cream animate-fade-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] backdrop-blur">
                <Sparkles className="h-3 w-3" /> New Season 2026
              </div>
              <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
                Style Your Home.<br />
                <span className="italic text-champagne">Elevate</span> Your Wardrobe.
              </h1>
              <p className="mt-6 max-w-md text-base md:text-lg text-cream/85">
                Premium curtains, elegant handbags, and fashionable ladies' shoes — quietly luxurious, remarkably affordable.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/$category" params={{ category: "handbags" }} className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-charcoal transition hover:bg-champagne">
                  Shop Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <a href="#collections" className="rounded-full border border-cream/40 px-7 py-3.5 text-sm font-medium text-cream backdrop-blur hover:bg-cream/10 transition">
                  Browse Collections
                </a>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-widest text-cream/70">
                <div>4.9<span className="ml-1 text-champagne">★</span> · 2,400+ reviews</div>
                <div className="hidden sm:block">Ships nationwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section id="collections" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">Featured</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Shop by Category</h2>
          </div>
          <a href="#trending" className="hidden md:inline text-sm underline underline-offset-4">See all</a>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to="/$category" params={{ category: c.slug }}
              className="group relative overflow-hidden rounded-3xl bg-secondary hover-lift"
              style={{ aspectRatio: i === 1 ? "3/4" : "3/4" }}
            >
              <img src={c.image} alt={c.name} loading="lazy" width={1200} height={1500} className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                <div className="text-[10px] uppercase tracking-[0.3em] text-champagne">Collection</div>
                <div className="mt-1 font-display text-3xl">{c.name}</div>
                <div className="mt-1 text-sm text-cream/80">{c.tagline}</div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader eyebrow="The Icons" title="Best Sellers" link={{ label: "Shop all", to: "/$category", params: { category: "handbags" } }} />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl gradient-luxe p-8 md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">Flash Deals</div>
              <h2 className="mt-2 font-display text-4xl">Limited-Time Edit</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Hand-picked icons at exceptional prices. When they're gone, they're gone.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: "Days", v: d },
                { label: "Hours", v: h },
                { label: "Min", v: m },
                { label: "Sec", v: s },
              ].map((t) => (
                <div key={t.label} className="w-16 rounded-2xl bg-background/80 px-3 py-2 text-center backdrop-blur">
                  <div className="font-display text-2xl">{String(t.v).padStart(2, "0")}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {flash.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader eyebrow="Just In" title="New Arrivals" link={{ label: "See more", to: "/$category", params: { category: "shoes" } }} />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* TRENDING */}
      <section id="trending" className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader eyebrow="On Everyone's List" title="Trending This Week" />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {trending.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY ELORIA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-border bg-secondary/40 p-10 md:p-16">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">The Eloria Promise</div>
            <h2 className="mt-2 font-display text-4xl">Why choose us</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Premium Quality", body: "Materials and construction we'd stake our name on." },
              { icon: Truck, title: "Fast Delivery", body: "Same-day dispatch in Nairobi. Nationwide in 2–3 days." },
              { icon: Undo2, title: "Easy Returns", body: "14 days, no questions. If it's not right, send it back." },
              { icon: HeartHandshake, title: "Real Support", body: "A team on WhatsApp — not a chatbot in a loop." },
            ].map((f) => (
              <div key={f.title}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-soft">
                  <f.icon className="h-5 w-5 text-champagne-deep" />
                </div>
                <div className="mt-4 font-display text-xl">{f.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="Loved by Clients" title="What people say" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { name: "Amara K.", text: "The velvet blackout curtains completely transformed my bedroom. Genuinely luxurious.", loc: "Nairobi" },
            { name: "Wanjiru M.", text: "My cream tote arrives compliments daily. Better than bags twice the price.", loc: "Mombasa" },
            { name: "Sasha L.", text: "The nude pump is now my everything shoe. Fits perfectly, feels expensive.", loc: "Kisumu" },
          ].map((t) => (
            <figure key={t.name} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-champagne-deep">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{t.name} · {t.loc}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INSTA GALLERY */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="@eloriastore" title="Styled by you" />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6">
          {PRODUCTS.slice(0, 6).map((p) => (
            <a key={p.id} href="#" className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-charcoal/0 transition group-hover:bg-charcoal/30" />
            </a>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">Join Eloria</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">The list, delivered.</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Early access to drops, private sales, and styling notes. No spam — just the good stuff.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-8 flex max-w-md gap-2">
          <input type="email" required placeholder="Your email"
            className="flex-1 rounded-full border border-border bg-background px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-accent" />
          <button className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90">Subscribe</button>
        </form>
      </section>
    </SiteShell>
  );
}

function SectionHeader({ eyebrow, title, link }: { eyebrow: string; title: string; link?: { label: string; to: string; params?: Record<string, string> } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">{eyebrow}</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link to={link.to as "/$category"} params={link.params as { category: string }} className="hidden md:inline text-sm underline underline-offset-4">
          {link.label}
        </Link>
      )}
    </div>
  );
}
