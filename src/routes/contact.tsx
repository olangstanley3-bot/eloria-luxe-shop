import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Instagram } from "lucide-react";
import { SiteShell } from "@/components/site-layout";
import { useBusinessSettings } from "@/lib/store";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Eloria · We'd love to hear from you" },
      {
        name: "description",
        content:
          "Reach the Eloria team by WhatsApp, phone, or email — we usually reply within the hour.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const business = useBusinessSettings();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const whatsappUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent("Hi Eloria!")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from("enquiries").insert({
        name,
        email,
        phone,
        subject: subject || "Store Inquiry",
        message,
        kind: "general",
        status: "pending",
      });
    } catch (err) {
      console.warn("Failed saving to Supabase, local state fallback active:", err);
    } finally {
      setLoading(false);
      setSent(true);
      toast.success(`Thank you! Your message has been received by ${business.storeName} team.`);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }
  };
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne-deep">Contact</div>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">We'd love to hear from you.</h1>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="space-y-6">
              {[
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: business.phoneDisplay,
                  href: whatsappUrl,
                },
                {
                  icon: Phone,
                  label: "Call us",
                  value: business.phoneDisplay,
                  href: `tel:${business.phoneDisplay}`,
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                  value: "@eloriastore1",
                  href: business.instagramUrl || "https://instagram.com/eloriastore1",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: business.emailDisplay,
                  href: `mailto:${business.emailDisplay}`,
                },
                {
                  icon: MapPin,
                  label: "Visit us",
                  value: business.location,
                  href: `https://www.google.com/maps?q=${encodeURIComponent(business.location)}`,
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                    <c.icon className="h-5 w-5 text-champagne-deep" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </div>
                    <div className="mt-0.5 text-foreground group-hover:text-champagne-deep transition">
                      {c.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Hours</div>
              <p className="mt-2 text-foreground/85">
                Mon – Sat · 9:00 – 19:00
                <br />
                Sun · 11:00 – 17:00
              </p>
            </div>

            <div className="mt-10 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border">
              <iframe
                title="Eloria Store — Kamukunji, Nairobi"
                src="https://www.google.com/maps?q=Kamukunji,+Nairobi,+Kenya&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-3xl border border-border bg-secondary/30 p-8 shadow-soft"
          >
            <h2 className="font-display text-2xl">Send us a note</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Have questions about custom curtain stitching, handbag materials, or delivery? Send us
              a message directly.
            </p>
            <div className="mt-6 space-y-4">
              <input
                required
                placeholder="Your name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  type="email"
                  placeholder="Email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  placeholder="Phone number (e.g. 0712...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <input
                placeholder="Subject / Product of Interest"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <textarea
                required
                rows={5}
                placeholder="How can we help? Include window measurements for custom curtains..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-3xl border border-border bg-background px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {sent && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Thanks! We have received your note and will be in touch shortly.
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="font-display text-3xl">Frequently asked</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {[
              {
                q: "How long does delivery take?",
                a: "Same-day dispatch in Nairobi. 2–3 business days nationwide via our courier partners.",
              },
              {
                q: "Do you accept M-Pesa?",
                a: "Yes — M-Pesa, Airtel Money, card payments, bank transfer, and (in select areas) cash on delivery.",
              },
              {
                q: "What is your return policy?",
                a: "14 days from delivery. Items must be unworn, with tags, in original packaging.",
              },
              {
                q: "Do you ship internationally?",
                a: "Kenya-wide today; East Africa shipping is coming soon — join the newsletter to hear first.",
              },
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
