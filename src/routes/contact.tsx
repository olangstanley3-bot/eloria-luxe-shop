import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site-layout";
import { whatsappUrl, PHONE_NUMBER, PHONE_DISPLAY, EMAIL_ADDRESS, INSTAGRAM_URL } from "@/lib/products";
import { Instagram } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Eloria · We'd love to hear from you" },
      { name: "description", content: "Reach the Eloria team by WhatsApp, phone, or email — we usually reply within the hour." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">Contact</div>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">We'd love to hear from you.</h1>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="space-y-6">
              {[
                { icon: MessageCircle, label: "WhatsApp", value: PHONE_DISPLAY, href: whatsappUrl("Hi Eloria!") },
                { icon: Phone, label: "Call us", value: PHONE_DISPLAY, href: `tel:${PHONE_NUMBER}` },
                { icon: Instagram, label: "Instagram", value: "@eloriastore1", href: INSTAGRAM_URL },
                { icon: Mail, label: "Email", value: EMAIL_ADDRESS, href: `mailto:${EMAIL_ADDRESS}` },
                { icon: MapPin, label: "Nairobi, Kenya", value: "Delivery countrywide" },
              ].map((c) => (
                <a key={c.label} href={c.href} target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-start gap-4 group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                    <c.icon className="h-5 w-5 text-champagne-deep" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                    <div className="mt-0.5 text-foreground group-hover:text-champagne-deep transition">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Hours</div>
              <p className="mt-2 text-foreground/85">Mon – Sat · 9:00 – 19:00<br />Sun · 11:00 – 17:00</p>
            </div>

            <div className="mt-10 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border">
              <iframe
                title="Eloria location"
                src="https://www.google.com/maps?q=Westlands+Nairobi&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="h-fit rounded-3xl border border-border bg-secondary/30 p-8"
          >
            <h2 className="font-display text-2xl">Send us a note</h2>
            <div className="mt-6 space-y-4">
              <input required placeholder="Your name" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
              <input required type="email" placeholder="Email" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
              <input placeholder="Subject" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
              <textarea required rows={5} placeholder="How can we help?" className="w-full rounded-3xl border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" />
              <button className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90">Send message</button>
              {sent && <p className="text-sm text-champagne-deep">Thanks — we'll be in touch shortly.</p>}
            </div>
          </form>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="font-display text-3xl">Frequently asked</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {[
              { q: "How long does delivery take?", a: "Same-day dispatch in Nairobi. 2–3 business days nationwide via our courier partners." },
              { q: "Do you accept M-Pesa?", a: "Yes — M-Pesa, Airtel Money, card payments, bank transfer, and (in select areas) cash on delivery." },
              { q: "What is your return policy?", a: "14 days from delivery. Items must be unworn, with tags, in original packaging." },
              { q: "Do you ship internationally?", a: "Kenya-wide today; East Africa shipping is coming soon — join the newsletter to hear first." },
            ].map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                  {f.q}
                  <span className="text-champagne-deep transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-foreground/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
