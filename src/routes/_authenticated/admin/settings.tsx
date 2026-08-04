import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings, Save, Phone, MapPin, Globe, Sparkles } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useHomepageSettings,
  useBusinessSettings,
  saveHomepageSettings,
  saveBusinessSettings,
} from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettingsPage,
});

export function AdminSettingsPage() {
  const currentHomepage = useHomepageSettings();
  const currentBusiness = useBusinessSettings();

  const [storeName, setStoreName] = useState(currentBusiness.storeName || "Eloria Store");
  const [logoUrl, setLogoUrl] = useState(currentBusiness.logoUrl || "");
  const [phone, setPhone] = useState(currentBusiness.phoneDisplay);
  const [phoneDisplay, setPhoneDisplay] = useState(currentBusiness.phoneDisplay);
  const [whatsapp, setWhatsapp] = useState(currentBusiness.whatsappNumber);
  const [location, setLocation] = useState(currentBusiness.location);
  const [address, setAddress] = useState(
    currentBusiness.address || "Kamukunji Luxury Plaza, Floor 2",
  );
  const [businessHours, setBusinessHours] = useState(
    currentBusiness.businessHours || "Mon - Sat: 8:00 AM - 6:30 PM",
  );
  const [email, setEmail] = useState(currentBusiness.email);
  const [instagram, setInstagram] = useState(currentBusiness.instagramUrl);
  const [facebook, setFacebook] = useState(currentBusiness.facebookUrl);
  const [tiktok, setTiktok] = useState(currentBusiness.tiktokUrl);
  const [footerText, setFooterText] = useState(
    currentBusiness.footerText ||
      "© 2026 Eloria Store. All rights reserved. Quality luxury home & fashion in Nairobi.",
  );

  const [announcementText, setAnnouncementText] = useState(currentHomepage.bannerAnnouncement);
  const [heroHeading, setHeroHeading] = useState(currentHomepage.heroTitle);
  const [heroSubheading, setHeroSubheading] = useState(currentHomepage.heroSubtitle);

  useEffect(() => {
    setStoreName(currentBusiness.storeName || "Eloria Store");
    setLogoUrl(currentBusiness.logoUrl || "");
    setPhone(currentBusiness.phoneDisplay);
    setPhoneDisplay(currentBusiness.phoneDisplay);
    setWhatsapp(currentBusiness.whatsappNumber);
    setLocation(currentBusiness.location);
    setAddress(currentBusiness.address || "Kamukunji Luxury Plaza, Floor 2");
    setBusinessHours(currentBusiness.businessHours || "Mon - Sat: 8:00 AM - 6:30 PM");
    setEmail(currentBusiness.email);
    setInstagram(currentBusiness.instagramUrl);
    setFacebook(currentBusiness.facebookUrl);
    setTiktok(currentBusiness.tiktokUrl);
    setFooterText(
      currentBusiness.footerText ||
        "© 2026 Eloria Store. All rights reserved. Quality luxury home & fashion in Nairobi.",
    );

    setAnnouncementText(currentHomepage.bannerAnnouncement);
    setHeroHeading(currentHomepage.heroTitle);
    setHeroSubheading(currentHomepage.heroSubtitle);
  }, [currentBusiness, currentHomepage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    saveHomepageSettings({
      ...currentHomepage,
      bannerAnnouncement: announcementText,
      heroTitle: heroHeading,
      heroSubtitle: heroSubheading,
    });

    saveBusinessSettings({
      ...currentBusiness,
      storeName,
      logoUrl,
      phoneDisplay,
      whatsappNumber: whatsapp,
      location,
      address,
      businessHours,
      email,
      instagramUrl: instagram,
      facebookUrl: facebook,
      tiktokUrl: tiktok,
      footerText,
    });

    toast.success("Site settings and store credentials saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Site Settings &amp; Banners</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure store contact numbers, WhatsApp credentials, social channels, and top
              announcement banners.
            </p>
          </div>
          <Button onClick={handleSave} className="rounded-full shadow-soft">
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-8">
          {/* Store Branding & Identity */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg text-foreground">
              <Globe className="h-5 w-5 text-primary" /> Store Branding &amp; Identity
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Store Name</Label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Eloria Store"
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Logo Image URL</Label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://.../logo.png"
                  className="rounded-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Top Announcement Bar & Hero Banner Editor */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg text-foreground">
              <Sparkles className="h-5 w-5 text-champagne-deep" /> Top Announcement &amp; Hero
              Banners
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Top Banner Bar Announcement
                </Label>
                <Input
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Hero Headline</Label>
                  <Input
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Hero Subtitle</Label>
                  <Input
                    value={heroSubheading}
                    onChange={(e) => setHeroSubheading(e.target.value)}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Contact & WhatsApp Credentials */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg text-foreground">
              <Phone className="h-5 w-5 text-emerald-600" /> Phone &amp; WhatsApp Channels
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Call Phone Number (E.164)
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-full font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Formatted Display Phone</Label>
                <Input
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">WhatsApp Phone Number</Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="rounded-full font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Physical Store Location & Hours */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg text-foreground">
              <MapPin className="h-5 w-5 text-amber-600" /> Physical Store Location &amp; Hours
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">City / Neighborhood</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Detailed Address</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Operating Hours</Label>
                <Input
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles & Footer */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg text-foreground">
              <Globe className="h-5 w-5 text-indigo-600" /> Social Links &amp; Footer Text
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Instagram URL</Label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Facebook Page URL</Label>
                <Input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs uppercase tracking-wider">
                Footer Copyright &amp; Description
              </Label>
              <textarea
                rows={2}
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="rounded-full px-8 shadow-soft">
              <Save className="mr-2 h-5 w-5" /> Save All Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
