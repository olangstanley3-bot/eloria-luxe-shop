import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Truck, Plus, Trash2, Edit, Save, MapPin } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/shipping")({
  component: AdminShippingPage,
});

export interface ShippingZone {
  id: string;
  name: string;
  rate: number;
  estimatedDelivery: string;
  freeShippingAbove?: number;
  active: boolean;
}

const DEFAULT_ZONES: ShippingZone[] = [
  {
    id: "zone_cbd",
    name: "Nairobi CBD & Immediate Environs",
    rate: 250,
    estimatedDelivery: "Same Day (2 - 4 hours)",
    freeShippingAbove: 10000,
    active: true,
  },
  {
    id: "zone_nairobi_outer",
    name: "Greater Nairobi Metropolitan (Kitsuru, Karen, Westlands, Eastlands)",
    rate: 400,
    estimatedDelivery: "Same Day or Next Morning",
    freeShippingAbove: 15000,
    active: true,
  },
  {
    id: "zone_upcountry",
    name: "Upcountry Kenya (Mombasa, Kisumu, Nakuru, Eldoret via Courier)",
    rate: 650,
    estimatedDelivery: "24 - 48 hours",
    freeShippingAbove: 20000,
    active: true,
  },
  {
    id: "zone_pickup",
    name: "In-Store Pickup (Kamukunji Luxury Plaza)",
    rate: 0,
    estimatedDelivery: "Instant Ready for Collection",
    active: true,
  },
];

export function AdminShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>(() => {
    try {
      const stored = localStorage.getItem("eloria_shipping_zones");
      return stored ? JSON.parse(stored) : DEFAULT_ZONES;
    } catch {
      return DEFAULT_ZONES;
    }
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    estimatedDelivery: "",
    freeShippingAbove: "",
  });

  const saveZones = (updated: ShippingZone[]) => {
    setZones(updated);
    localStorage.setItem("eloria_shipping_zones", JSON.stringify(updated));
  };

  const handleOpenModal = (zone?: ShippingZone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData({
        name: zone.name,
        rate: zone.rate.toString(),
        estimatedDelivery: zone.estimatedDelivery,
        freeShippingAbove: zone.freeShippingAbove ? zone.freeShippingAbove.toString() : "",
      });
    } else {
      setEditingZone(null);
      setFormData({
        name: "",
        rate: "300",
        estimatedDelivery: "1 - 2 Days",
        freeShippingAbove: "15000",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const rateNum = parseFloat(formData.rate) || 0;
    const freeThreshold = formData.freeShippingAbove
      ? parseFloat(formData.freeShippingAbove)
      : undefined;

    if (editingZone) {
      const updated = zones.map((z) =>
        z.id === editingZone.id
          ? {
              ...z,
              name: formData.name,
              rate: rateNum,
              estimatedDelivery: formData.estimatedDelivery,
              freeShippingAbove: freeThreshold,
            }
          : z,
      );
      saveZones(updated);
      toast.success("Updated shipping zone!");
    } else {
      const newZone: ShippingZone = {
        id: `zone_${Date.now()}`,
        name: formData.name,
        rate: rateNum,
        estimatedDelivery: formData.estimatedDelivery || "1 - 2 Business Days",
        freeShippingAbove: freeThreshold,
        active: true,
      };
      saveZones([...zones, newZone]);
      toast.success("Added new shipping zone!");
    }
    setDialogOpen(false);
  };

  const handleToggleZone = (id: string) => {
    const updated = zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z));
    saveZones(updated);
    toast.success("Updated zone visibility!");
  };

  const handleDeleteZone = (id: string) => {
    const updated = zones.filter((z) => z.id !== id);
    saveZones(updated);
    toast.success("Deleted shipping zone!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Shipping &amp; Delivery Rates</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure courier delivery fees across Nairobi metro and upcountry Kenya parcel
              stations.
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="rounded-full shadow-soft">
            <Plus className="mr-2 h-4 w-4" /> Add Delivery Zone
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="p-5 rounded-3xl border border-border bg-card shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-secondary text-primary mt-1 sm:mt-0">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{zone.name}</h3>
                    {!zone.active && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                    <span>
                      Est. Delivery:{" "}
                      <strong className="text-foreground">{zone.estimatedDelivery}</strong>
                    </span>
                    {zone.freeShippingAbove && (
                      <span>
                        Free delivery on orders over{" "}
                        <strong className="text-primary">
                          {formatKES(zone.freeShippingAbove)}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {zone.rate === 0 ? "FREE" : formatKES(zone.rate)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleZone(zone.id)}
                    className="rounded-full text-xs"
                  >
                    {zone.active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(zone)}
                    className="rounded-full h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteZone(zone.id)}
                    className="rounded-full text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingZone ? "Edit Shipping Zone" : "New Delivery Zone"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Zone Name *</Label>
              <Input
                required
                placeholder="e.g. Kisumu & Western Region"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-full text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Shipping Rate (KSh) *</Label>
                <Input
                  type="number"
                  required
                  placeholder="500"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Free Delivery Threshold</Label>
                <Input
                  type="number"
                  placeholder="15000"
                  value={formData.freeShippingAbove}
                  onChange={(e) => setFormData({ ...formData, freeShippingAbove: e.target.value })}
                  className="rounded-full text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Estimated Delivery Time</Label>
              <Input
                placeholder="e.g. 24 - 48 Hours"
                value={formData.estimatedDelivery}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                className="rounded-full text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full text-xs">
                <Save className="mr-1 h-3.5 w-3.5" /> Save Zone
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
