import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Save, Smartphone, Building2, DollarSign, ShieldCheck } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePaymentSettings, savePaymentSettings, PaymentSettings } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: AdminPaymentsPage,
});

export function AdminPaymentsPage() {
  const currentPayments = usePaymentSettings();

  const [mpesaTill, setMpesaTill] = useState(currentPayments.mpesaTill || "5920311");
  const [mpesaPaybill, setMpesaPaybill] = useState(currentPayments.mpesaPaybill || "247247");
  const [mpesaAccountName, setMpesaAccountName] = useState(
    currentPayments.mpesaAccountName || "ELORIA STORE",
  );
  const [enableMpesa, setEnableMpesa] = useState(currentPayments.enableMpesa ?? true);

  const [enableCard, setEnableCard] = useState(currentPayments.enableCard ?? true);
  const [cardGateway, setCardGateway] = useState(
    currentPayments.cardGateway || "Visa / Mastercard / Flutterwave",
  );

  const [enableBankTransfer, setEnableBankTransfer] = useState(
    currentPayments.enableBankTransfer ?? true,
  );
  const [bankName, setBankName] = useState(currentPayments.bankName || "KCB Bank Kenya");
  const [bankAccountNumber, setBankAccountNumber] = useState(
    currentPayments.bankAccountNumber || "1289004821",
  );
  const [bankBranch, setBankBranch] = useState(currentPayments.bankBranch || "Nairobi Central");

  const [enableCOD, setEnableCOD] = useState(currentPayments.enableCOD ?? true);

  useEffect(() => {
    setMpesaTill(currentPayments.mpesaTill || "5920311");
    setMpesaPaybill(currentPayments.mpesaPaybill || "247247");
    setMpesaAccountName(currentPayments.mpesaAccountName || "ELORIA STORE");
    setEnableMpesa(currentPayments.enableMpesa ?? true);
    setEnableCard(currentPayments.enableCard ?? true);
    setCardGateway(currentPayments.cardGateway || "Visa / Mastercard / Flutterwave");
    setEnableBankTransfer(currentPayments.enableBankTransfer ?? true);
    setBankName(currentPayments.bankName || "KCB Bank Kenya");
    setBankAccountNumber(currentPayments.bankAccountNumber || "1289004821");
    setBankBranch(currentPayments.bankBranch || "Nairobi Central");
    setEnableCOD(currentPayments.enableCOD ?? true);
  }, [currentPayments]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: PaymentSettings = {
      ...currentPayments,
      mpesaTill,
      mpesaPaybill,
      mpesaAccountName,
      enableMpesa,
      enableCard,
      cardGateway,
      enableBankTransfer,
      bankName,
      bankAccountNumber,
      bankBranch,
      enableCOD,
    };

    savePaymentSettings(updated);
    toast.success("Payment configurations saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Payment Gateways &amp; Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure M-Pesa Till &amp; Paybill numbers, credit card gateways, bank details, and
              Cash on Delivery.
            </p>
          </div>
          <Button onClick={handleSave} className="rounded-full shadow-soft">
            <Save className="mr-2 h-4 w-4" /> Save Payment Settings
          </Button>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-8">
          {/* M-Pesa Configuration */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-display text-lg text-foreground">
                <Smartphone className="h-5 w-5 text-emerald-600" /> M-Pesa Express &amp; Paybill
                Setup
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableMpesa}
                  onChange={(e) => setEnableMpesa(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Enable M-Pesa
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  M-Pesa Buy Goods Till No.
                </Label>
                <Input
                  value={mpesaTill}
                  onChange={(e) => setMpesaTill(e.target.value)}
                  placeholder="5920311"
                  className="rounded-full font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">M-Pesa Paybill Number</Label>
                <Input
                  value={mpesaPaybill}
                  onChange={(e) => setMpesaPaybill(e.target.value)}
                  placeholder="247247"
                  className="rounded-full font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Account Name / Number Format
                </Label>
                <Input
                  value={mpesaAccountName}
                  onChange={(e) => setMpesaAccountName(e.target.value)}
                  placeholder="ELORIA STORE"
                  className="rounded-full font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Credit Card Gateway */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-display text-lg text-foreground">
                <CreditCard className="h-5 w-5 text-primary" /> Credit / Debit Card Gateway
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCard}
                  onChange={(e) => setEnableCard(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Enable Card Gateway
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Gateway Provider</Label>
                <Input
                  value={cardGateway}
                  onChange={(e) => setCardGateway(e.target.value)}
                  placeholder="Visa / Mastercard / Flutterwave"
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Currency Symbol</Label>
                <Input
                  value="KES (Kenyan Shilling)"
                  disabled
                  className="rounded-full text-xs bg-secondary/50 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Bank Wire Transfer */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-display text-lg text-foreground">
                <Building2 className="h-5 w-5 text-amber-600" /> Direct Bank Wire Transfer
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBankTransfer}
                  onChange={(e) => setEnableBankTransfer(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Enable Bank Transfer
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Bank Name</Label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="KCB Bank Kenya"
                  className="rounded-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Account Number</Label>
                <Input
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="1289004821"
                  className="rounded-full font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Branch / Swift Code</Label>
                <Input
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  placeholder="Nairobi Central"
                  className="rounded-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg text-foreground">
                <DollarSign className="h-5 w-5 text-emerald-600" /> Cash on Delivery (COD)
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCOD}
                  onChange={(e) => setEnableCOD(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Enable Cash on Delivery
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Allow Nairobi customers to inspect and pay upon doorstep courier delivery.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" size="lg" className="rounded-full shadow-soft px-8">
              <Save className="mr-2 h-4 w-4" /> Save &amp; Publish Payment Methods
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
