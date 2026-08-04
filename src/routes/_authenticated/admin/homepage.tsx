import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Layout,
  Plus,
  Trash2,
  Save,
  Check,
  Star,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Zap,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useHomepageSettings,
  saveHomepageSettings,
  useStoreProducts,
  useStoreMedia,
  HomepageSettings,
  Testimonial,
  PromoBanner,
} from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: AdminHomepageManagerPage,
});

export function AdminHomepageManagerPage() {
  const currentSettings = useHomepageSettings();
  const products = useStoreProducts();
  const mediaLibrary = useStoreMedia();

  // Form states
  const [heroBadge, setHeroBadge] = useState(currentSettings.heroBadge || "New Season 2026");
  const [heroTitle, setHeroTitle] = useState(currentSettings.heroTitle || "");
  const [heroSubtitle, setHeroSubtitle] = useState(currentSettings.heroSubtitle || "");
  const [heroImage, setHeroImage] = useState(currentSettings.heroImage || "");
  const [heroCtaText, setHeroCtaText] = useState(currentSettings.heroCtaText || "Shop Collection");
  const [heroCtaCategory, setHeroCtaCategory] = useState(
    currentSettings.heroCtaCategory || "curtains",
  );
  const [bannerAnnouncement, setBannerAnnouncement] = useState(
    currentSettings.bannerAnnouncement || "",
  );

  // Flash sales
  const [flashSaleTitle, setFlashSaleTitle] = useState(
    currentSettings.flashSaleTitle || "Weekly Flash Sales",
  );
  const [flashSaleEndTime, setFlashSaleEndTime] = useState(
    currentSettings.flashSaleEndTime || "2026-12-31T23:59:59",
  );
  const [selectedFlashProductIds, setSelectedFlashProductIds] = useState<string[]>(
    currentSettings.flashSaleProductIds || [],
  );

  // Selected Section Products
  const [selectedFeaturedIds, setSelectedFeaturedIds] = useState<string[]>(
    currentSettings.featuredProductIds || [],
  );
  const [selectedBestSellerIds, setSelectedBestSellerIds] = useState<string[]>(
    currentSettings.bestSellerProductIds || [],
  );
  const [selectedNewArrivalIds, setSelectedNewArrivalIds] = useState<string[]>(
    currentSettings.newArrivalProductIds || [],
  );

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    currentSettings.testimonials || [
      {
        id: "t1",
        name: "Wanjiku N.",
        location: "Kilimani, Nairobi",
        content:
          "The heavy blackout velvet curtains completely changed our living room! Incredible quality and fast delivery.",
        rating: 5,
        productName: "Velvet Blackout Drapes",
      },
      {
        id: "t2",
        name: "Kevin M.",
        location: "Westlands, Nairobi",
        content:
          "Ordered the leather tote bag for my wife's anniversary. Craftsmanship is top tier! Will order again.",
        rating: 5,
        productName: "Italian Leather Tote",
      },
    ],
  );

  // Media picker modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"heroImage">("heroImage");

  const toggleProductSelection = (
    id: string,
    list: string[],
    setList: (items: string[]) => void,
  ) => {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleAddTestimonial = () => {
    const newT: Testimonial = {
      id: `test_${Date.now()}`,
      name: "Customer Name",
      location: "Nairobi, Kenya",
      content: "Great experience shopping with Eloria Store!",
      rating: 5,
    };
    setTestimonials([...testimonials, newT]);
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, val: string | number) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    toast.success("Removed testimonial");
  };

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings: HomepageSettings = {
      ...currentSettings,
      heroBadge,
      heroTitle,
      heroSubtitle,
      heroImage,
      heroCtaText,
      heroCtaCategory,
      bannerAnnouncement,
      flashSaleTitle,
      flashSaleEndTime,
      featuredProductIds: selectedFeaturedIds,
      bestSellerProductIds: selectedBestSellerIds,
      newArrivalProductIds: selectedNewArrivalIds,
      flashSaleProductIds: selectedFlashProductIds,
      testimonials,
    };

    saveHomepageSettings(updatedSettings);
    toast.success("Homepage content & banner settings saved! Storefront updated immediately.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Homepage Content &amp; Banner Manager</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Customize hero banners, sliders, flash deal countdowns, featured products, best
              sellers, and testimonials without coding.
            </p>
          </div>
          <Button onClick={handleSaveHomepage} className="rounded-full shadow-soft">
            <Save className="mr-2 h-4 w-4" /> Save &amp; Publish Homepage
          </Button>
        </div>

        <form onSubmit={handleSaveHomepage} className="mt-8 space-y-8">
          {/* 1. HERO BANNER & ANNOUNCEMENT BAR */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <h2 className="font-display text-xl flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-champagne-deep" /> Hero Banner &amp; Top
              Announcement Bar
            </h2>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Top Announcement Bar Text</Label>
              <Input
                value={bannerAnnouncement}
                onChange={(e) => setBannerAnnouncement(e.target.value)}
                placeholder="e.g. Complimentary Delivery over KSh 10,000 | WhatsApp +254 742 461 744"
                className="rounded-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Hero Eyebrow / Badge Text
                </Label>
                <Input
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="e.g. New Season 2026"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Hero CTA Button Text</Label>
                <Input
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  placeholder="e.g. Explore Curtains"
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Main Hero Title / Headline</Label>
              <Input
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Curated luxury for everyday spaces."
                className="rounded-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Hero Subtitle / Description
              </Label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="e.g. Tailored curtains, elegant handbags & bespoke ladies' footwear."
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Hero Banner Background Image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="rounded-full text-xs"
                />
              </div>
              {heroImage && (
                <div className="mt-2 h-40 rounded-2xl overflow-hidden border border-border bg-secondary/30">
                  <img
                    src={heroImage}
                    alt="Hero Banner Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 2. FLASH DEALS & TIMER */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <h2 className="font-display text-xl flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-amber-500" /> Flash Deals &amp; Countdown Timer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Flash Sale Section Title</Label>
                <Input
                  value={flashSaleTitle}
                  onChange={(e) => setFlashSaleTitle(e.target.value)}
                  placeholder="Weekly Flash Sales & Special Deals"
                  className="rounded-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Countdown Target Expiry Date
                </Label>
                <Input
                  type="datetime-local"
                  value={flashSaleEndTime.substring(0, 16)}
                  onChange={(e) => setFlashSaleEndTime(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs uppercase tracking-wider">
                Select Flash Sale Products (Checked items show in Flash Deals block)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 border border-border rounded-2xl bg-secondary/20">
                {products.map((p) => {
                  const isSelected = selectedFlashProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        toggleProductSelection(
                          p.id,
                          selectedFlashProductIds,
                          setSelectedFlashProductIds,
                        )
                      }
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition ${
                        isSelected
                          ? "bg-amber-100 border-amber-400 text-amber-900 font-semibold"
                          : "bg-card border-border hover:bg-secondary"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="h-9 w-8 rounded-lg object-cover" />
                      <div className="truncate flex-1">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">KSh {p.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. FEATURED PRODUCTS & CURATED SECTIONS */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6">
            <h2 className="font-display text-xl flex items-center gap-2 text-foreground">
              <Layout className="h-5 w-5 text-primary" /> Curated Homepage Product Collections
            </h2>

            {/* Featured Products Selection */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">
                1. Featured Products Section ({selectedFeaturedIds.length} selected)
              </Label>
              <p className="text-xs text-muted-foreground">
                Choose specific items to highlight on the homepage. (Smart Fallback automatically
                uses tagged items if none are checked).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-52 overflow-y-auto p-2 border border-border rounded-2xl bg-secondary/20">
                {products.map((p) => {
                  const isSelected = selectedFeaturedIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        toggleProductSelection(p.id, selectedFeaturedIds, setSelectedFeaturedIds)
                      }
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition ${
                        isSelected
                          ? "bg-primary/15 border-primary text-primary font-semibold"
                          : "bg-card border-border hover:bg-secondary"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="h-9 w-8 rounded-lg object-cover" />
                      <div className="truncate flex-1">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Best Sellers Selection */}
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">
                2. Best Sellers Section ({selectedBestSellerIds.length} selected)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-52 overflow-y-auto p-2 border border-border rounded-2xl bg-secondary/20">
                {products.map((p) => {
                  const isSelected = selectedBestSellerIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        toggleProductSelection(
                          p.id,
                          selectedBestSellerIds,
                          setSelectedBestSellerIds,
                        )
                      }
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition ${
                        isSelected
                          ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold"
                          : "bg-card border-border hover:bg-secondary"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="h-9 w-8 rounded-lg object-cover" />
                      <div className="truncate flex-1">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">KSh {p.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. CUSTOMER TESTIMONIALS */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl flex items-center gap-2 text-foreground">
                <MessageSquare className="h-5 w-5 text-champagne-deep" /> Customer Reviews &amp;
                Testimonials
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTestimonial}
                className="rounded-full text-xs"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Review
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-border p-4 bg-secondary/30 space-y-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1.5 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 pr-8">
                    <div>
                      <Label className="text-[10px] uppercase tracking-wider">Customer Name</Label>
                      <Input
                        value={t.name}
                        onChange={(e) => handleUpdateTestimonial(t.id, "name", e.target.value)}
                        className="rounded-full text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] uppercase tracking-wider">Location</Label>
                      <Input
                        value={t.location}
                        onChange={(e) => handleUpdateTestimonial(t.id, "location", e.target.value)}
                        className="rounded-full text-xs h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] uppercase tracking-wider">Review Quote</Label>
                    <textarea
                      rows={2}
                      value={t.content}
                      onChange={(e) => handleUpdateTestimonial(t.id, "content", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background p-2 text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="rounded-full shadow-luxe px-8">
              <Save className="mr-2 h-5 w-5" /> Save &amp; Update Storefront Immediately
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
