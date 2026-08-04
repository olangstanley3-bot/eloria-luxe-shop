import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  Smartphone,
  CreditCard,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatKES, PHONE_DISPLAY } from "@/lib/products";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useBusinessSettings,
  usePaymentSettings,
  useShippingSettings,
  saveStoreOrder,
  saveStoreCustomer,
  Order,
} from "@/lib/store";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discountRate?: number;
}

export function CheckoutDialog({ open, onOpenChange, discountRate = 0 }: CheckoutDialogProps) {
  const { items, productMap, subtotal, clear } = useCart();
  const [step, setStep] = useState<"details" | "mpesa_processing" | "success">("details");

  const business = useBusinessSettings();
  const payment = usePaymentSettings();
  const shipping = useShippingSettings();

  const whatsappUrl = (message: string) =>
    `https://wa.me/${business.whatsappNumber || "254742461744"}?text=${encodeURIComponent(message)}`;

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "airtel" | "bank" | "cod">(
    "mpesa",
  );
  const [mpesaNumber, setMpesaNumber] = useState("");

  const discountAmount = Math.round(subtotal * discountRate);
  const isNairobi =
    location.toLowerCase().includes("nairobi") ||
    location.toLowerCase().includes("kilimani") ||
    location.toLowerCase().includes("westlands");
  const shippingFee =
    subtotal >= shipping.freeShippingThreshold || subtotal === 0
      ? 0
      : isNairobi
        ? shipping.nairobiRate
        : shipping.countrywideRate;

  const finalTotal = subtotal - discountAmount + shippingFee;

  const createOrderRecord = () => {
    const orderNum = `ELO-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      customerName: fullName || "Guest Customer",
      customerPhone: phone || mpesaNumber || "+254 700 000 000",
      customerEmail: `${(fullName || "customer").toLowerCase().replace(/\s+/g, ".")}@example.com`,
      location: location || "Nairobi",
      date: new Date().toISOString().split("T")[0],
      items: items.map((it) => {
        const p = productMap[it.productId];
        return {
          id: it.productId,
          name: p ? p.name : "Product",
          price: p ? p.price : 0,
          qty: it.qty,
          image: p ? p.image : "",
        };
      }),
      total: finalTotal,
      paymentMethod:
        paymentMethod === "mpesa"
          ? "M-Pesa"
          : paymentMethod === "card"
            ? "Card"
            : paymentMethod === "airtel"
              ? "Airtel Money"
              : paymentMethod === "bank"
                ? "Bank Transfer"
                : "Pay on Delivery",
      status: "Processing",
    };

    saveStoreOrder(newOrder);
    saveStoreCustomer({
      id: `cust_${Date.now()}`,
      name: fullName || "Guest Customer",
      email: `${(fullName || "customer").toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: phone || mpesaNumber || "+254 700 000 000",
      location: location || "Nairobi",
      totalOrders: 1,
      totalSpent: finalTotal,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "Active",
    });
  };

  const handleStartCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    createOrderRecord();
    if (paymentMethod === "mpesa" || paymentMethod === "airtel") {
      setStep("mpesa_processing");
      setTimeout(() => {
        setStep("success");
      }, 3500);
    } else {
      setStep("success");
    }
  };

  const generateWhatsAppOrderText = () => {
    const itemLines = items
      .map((it) => {
        const p = productMap[it.productId];
        if (!p) return null;
        return `• ${p.name} (${it.color || "Standard"}, ${it.size || "Standard"}) x${it.qty} - KSh ${(p.price * it.qty).toLocaleString()}`;
      })
      .filter(Boolean)
      .join("\n");

    return `Hello Eloria Store! I have placed an order:\n\n*Customer Info:*\nName: ${fullName}\nPhone: ${phone}\nDelivery Address: ${location}\n${notes ? `Notes: ${notes}\n` : ""}\n*Order Summary:*\n${itemLines}\n\n*Subtotal:* KSh ${subtotal.toLocaleString()}\n${discountAmount > 0 ? `*Discount:* -KSh ${discountAmount.toLocaleString()}\n` : ""}*Shipping:* ${shippingFee === 0 ? "Complimentary" : `KSh ${shippingFee.toLocaleString()}`}\n*Total Paid:* KSh ${finalTotal.toLocaleString()}\n*Payment Method:* ${paymentMethod.toUpperCase()}\n\nPlease confirm availability and dispatch!`;
  };

  const handleFinish = () => {
    clear();
    setStep("details");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:rounded-3xl border-border bg-background shadow-luxe p-6">
        {step === "details" && (
          <form onSubmit={handleStartCheckout} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Complete Your Order</DialogTitle>
              <p className="text-xs text-muted-foreground">
                Enter your delivery details in Kenya to complete your order securely.
              </p>
            </DialogHeader>

            {/* Order Items Preview */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
                <span>Items ({items.length})</span>
                <span>Total: {formatKES(finalTotal)}</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2 divide-y divide-border/40">
                {items.map((it) => {
                  const p = productMap[it.productId];
                  if (!p) return null;
                  return (
                    <div
                      key={`${it.productId}-${it.color}`}
                      className="pt-2 flex justify-between items-center text-xs"
                    >
                      <div className="truncate pr-2">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground ml-1">x{it.qty}</span>
                      </div>
                      <span className="font-medium shrink-0">{formatKES(p.price * it.qty)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="checkout-name" className="text-xs uppercase tracking-wider">
                  Full Name *
                </Label>
                <Input
                  id="checkout-name"
                  required
                  placeholder="e.g. Wanjiru Kamau"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-phone" className="text-xs uppercase tracking-wider">
                    Phone Number *
                  </Label>
                  <Input
                    id="checkout-phone"
                    required
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-location" className="text-xs uppercase tracking-wider">
                    Delivery Location / City *
                  </Label>
                  <Input
                    id="checkout-location"
                    required
                    placeholder="e.g. Kilimani, Nairobi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-notes" className="text-xs uppercase tracking-wider">
                  Delivery Notes / House No (Optional)
                </Label>
                <Input
                  id="checkout-notes"
                  placeholder="e.g. Gate B, Apt 4C"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-xs uppercase tracking-wider">Select Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) =>
                  setPaymentMethod(val as "mpesa" | "card" | "airtel" | "bank" | "cod")
                }
                className="grid gap-3"
              >
                {payment.mpesaEnabled !== false && (
                  <>
                    <div className="flex items-center justify-between rounded-2xl border border-border p-4 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-secondary/40">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="mpesa" id="pm-mpesa" />
                        <Label
                          htmlFor="pm-mpesa"
                          className="cursor-pointer font-medium flex items-center gap-2"
                        >
                          <Smartphone className="h-4 w-4 text-emerald-600" />
                          M-Pesa Express (STK Push)
                        </Label>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Instant
                      </span>
                    </div>

                    {paymentMethod === "mpesa" && (
                      <div className="ml-7 p-3 rounded-xl bg-secondary/50 space-y-2 border border-border/80 text-xs">
                        <Label htmlFor="mpesa-num" className="text-[11px] text-muted-foreground">
                          M-Pesa Phone Number for Prompt:
                        </Label>
                        <Input
                          id="mpesa-num"
                          placeholder="e.g. 0742461744"
                          value={mpesaNumber || phone}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          className="rounded-full bg-background"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          An STK PIN prompt will be sent directly to Till{" "}
                          {payment.mpesaTill || "5920311"}.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {payment.airtelEnabled !== false && (
                  <div className="flex items-center justify-between rounded-2xl border border-border p-4 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="airtel" id="pm-airtel" />
                      <Label
                        htmlFor="pm-airtel"
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        <Smartphone className="h-4 w-4 text-red-600" />
                        Airtel Money
                      </Label>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Direct Prompt</span>
                  </div>
                )}

                {payment.cardEnabled !== false && (
                  <div className="flex items-center justify-between rounded-2xl border border-border p-4 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="card" id="pm-card" />
                      <Label
                        htmlFor="pm-card"
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4 text-indigo-600" />
                        Debit / Credit Card
                      </Label>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Visa · Mastercard</span>
                  </div>
                )}

                {payment.bankEnabled !== false && (
                  <div className="flex items-center justify-between rounded-2xl border border-border p-4 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="bank" id="pm-bank" />
                      <Label
                        htmlFor="pm-bank"
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4 text-amber-600" />
                        Bank Transfer ({payment.bankName || "KCB / Equity"})
                      </Label>
                    </div>
                    <span className="text-[10px] text-muted-foreground">EFT / RTGS</span>
                  </div>
                )}

                {payment.codEnabled !== false && (
                  <div className="flex items-center justify-between rounded-2xl border border-border p-4 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="pm-cod" />
                      <Label
                        htmlFor="pm-cod"
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-champagne-deep" />
                        Pay on Delivery
                      </Label>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Cash / M-Pesa at door</span>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Total breakdown */}
            <div className="rounded-2xl bg-secondary/60 p-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatKES(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-champagne-deep">
                  <span>Discount</span>
                  <span>−{formatKES(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingFee === 0 ? "Complimentary" : formatKES(shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-border/80 pt-2 font-semibold text-sm">
                <span>Total Amount Due</span>
                <span>{formatKES(finalTotal)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full py-6 text-base font-medium">
              Pay & Confirm Order · {formatKES(finalTotal)}
            </Button>
          </form>
        )}

        {step === "mpesa_processing" && (
          <div className="py-12 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <div>
              <h3 className="font-display text-2xl">M-Pesa Prompt Sent</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Please check phone{" "}
                <span className="font-semibold text-foreground">
                  {mpesaNumber || phone || PHONE_DISPLAY}
                </span>{" "}
                and enter your M-Pesa PIN to complete payment of{" "}
                <span className="font-semibold text-foreground">{formatKES(finalTotal)}</span>.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
              Waiting for network response from Safaricom M-Pesa...
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Order Received
              </span>
              <h3 className="mt-3 font-display text-3xl">Thank You for Shopping at Eloria!</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Your order has been recorded. Dispatch is being prepared for{" "}
                <span className="font-medium text-foreground">{location}</span>.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-left space-y-2 text-xs">
              <div className="font-semibold uppercase tracking-wider text-muted-foreground">
                Summary
              </div>
              <div className="flex justify-between">
                <span>Customer</span>
                <span className="font-medium">
                  {fullName} ({phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid</span>
                <span className="font-medium">{formatKES(finalTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium uppercase">{paymentMethod}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl(generateWhatsAppOrderText())}
                target="_blank"
                rel="noreferrer"
                onClick={handleFinish}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-medium text-white hover:bg-[#20bd5a] transition"
              >
                <MessageCircle className="h-5 w-5" /> Send Order Receipt via WhatsApp
              </a>

              <Button variant="outline" onClick={handleFinish} className="w-full rounded-full">
                Back to Store
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
