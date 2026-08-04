import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-layout";
import { useBusinessSettings, useHomepageSettings } from "@/lib/store";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Eloria · Affordable Luxury, Curated" },
      {
        name: "description",
        content:
          "The Eloria Store story — quality products, affordable luxury, and thoughtfully curated collections.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const business = useBusinessSettings();
  const homepage = useHomepageSettings();

  return (
    <SiteShell>
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
        <img
          src={homepage.heroImage || heroImg}
          alt={business.storeName}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-charcoal/20" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-14 text-cream">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-champagne">Our Story</div>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">
              {business.storeName}
              <br />
              <span className="text-3xl md:text-4xl font-normal opacity-90">
                {business.tagline}
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-8 px-6 py-20 text-lg leading-relaxed text-foreground/85">
        <p>
          {business.storeName} began with a single, stubborn belief: that beautiful things — the
          kind that lift a room or an outfit — shouldn't be locked behind luxury pricing.
        </p>
        <p>
          We travel showrooms and workshops to find the makers who care as much as we do. Every
          curtain, every bag, every pair of shoes is chosen the way we'd choose for our own homes
          and our own wardrobes.
        </p>
        <p className="font-display text-3xl text-foreground">
          "Quality you can feel. Prices that make sense. Service that remembers your name."
        </p>
        <p>
          We ship across Kenya from our {business.location} atelier. We answer WhatsApps directly at{" "}
          {business.phoneDisplay}. And we stand behind every piece we sell — because we already
          stood behind it before it reached you.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: "8,400+", l: "Happy clients" },
            { n: "4.9★", l: "Average rating" },
            { n: "48 hrs", l: "Nationwide dispatch" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-3xl border border-border bg-secondary/40 p-8 text-center"
            >
              <div className="font-display text-5xl text-champagne-deep">{s.n}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
