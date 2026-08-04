import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Ticket, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatKES } from "@/lib/products";
import { useStoreCoupons, saveStoreCoupon, deleteStoreCoupon, Coupon } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  component: AdminCouponsPage,
});

export function AdminCouponsPage() {
  const coupons = useStoreCoupons();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minSpend, setMinSpend] = useState("0");
  const [expiresAt, setExpiresAt] = useState("2026-12-31");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `coup_${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minSpend: parseFloat(minSpend) || 0,
      expiresAt,
      usageCount: 0,
      active: true,
    };

    saveStoreCoupon(newCoupon);
    toast.success(`Coupon code ${newCoupon.code} created!`);
    setIsAddOpen(false);
    setCode("");
  };

  const handleToggleCoupon = (coupon: Coupon) => {
    saveStoreCoupon({ ...coupon, active: !coupon.active });
    toast.success("Coupon status updated!");
  };

  const handleDeleteCoupon = (id: string) => {
    deleteStoreCoupon(id);
    toast.success("Deleted coupon!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Coupons &amp; Flash Discounts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage promotional discount codes for your customers.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full shadow-soft">
            <Plus className="mr-2 h-4 w-4" /> Create Coupon
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold tracking-wider text-primary">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(c)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      c.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {c.active ? "Active" : "Disabled"}
                  </button>
                </div>

                <div className="mt-4 text-2xl font-bold font-display">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}% OFF`
                    : `${formatKES(c.discountValue)} OFF`}
                </div>

                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div>Min Spend: {c.minSpend ? formatKES(c.minSpend) : "None"}</div>
                  <div>Expires: {c.expiresAt}</div>
                  <div>Times Used: {c.usageCount}</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCoupon(c.id)}
                  className="text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Create New Coupon</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCoupon} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Coupon Code *</Label>
              <Input
                required
                placeholder="e.g. SUMMER2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-full font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Discount Type</Label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                  className="w-full rounded-full border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (KSh)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Value *</Label>
                <Input
                  type="number"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Min Spend (KSh)</Label>
                <Input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                  className="rounded-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Expiry Date</Label>
                <Input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full">
                Save Coupon
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
