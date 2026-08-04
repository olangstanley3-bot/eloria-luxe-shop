import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { useStoreOrders, useStoreProducts } from "@/lib/store";
import { formatKES } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  component: AdminReportsPage,
});

export function AdminReportsPage() {
  const orders = useStoreOrders();
  const products = useStoreProducts();
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "year">("30d");

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const handleExportReport = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Items Count",
      "M-Pesa Ref",
      "Total Amount KSh",
      "Status",
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.date,
      `"${o.customerName}"`,
      o.items.length,
      o.mpesaReference,
      o.totalAmount,
      o.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eloria_sales_report_${timeframe}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported comprehensive sales report!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Reports &amp; Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Deep-dive metrics into store revenue, M-Pesa order volume, inventory turnover, and
              customer activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full bg-card border border-border p-1 text-xs">
              <button
                onClick={() => setTimeframe("7d")}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  timeframe === "7d"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeframe("30d")}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  timeframe === "30d"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeframe("year")}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  timeframe === "year"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                This Year
              </button>
            </div>
            <Button onClick={handleExportReport} className="rounded-full shadow-soft">
              <Download className="mr-2 h-4 w-4" /> Export CSV Report
            </Button>
          </div>
        </div>

        {/* High Level KPI Metrics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Gross Revenue
              </span>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display">{formatKES(totalRevenue)}</div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">
              ↑ 18.4% vs previous period
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Total Orders
              </span>
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display">{orders.length}</div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">
              ↑ 12% conversion rate
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Average Order Value
              </span>
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display">
              {formatKES(averageOrderValue)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Per completed checkout</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Catalog Products
              </span>
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-bold font-display">{products.length}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Active in 5 categories</div>
          </div>
        </div>

        {/* Visual Monthly Revenue & Category Breakdown */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">M-Pesa Revenue Velocity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monthly completed order volume in KSh
            </p>

            <div className="mt-6 space-y-4">
              {[
                { month: "May 2026", amount: 184000, percent: "65%" },
                { month: "Jun 2026", amount: 245000, percent: "82%" },
                { month: "Jul 2026", amount: 312000, percent: "100%" },
                { month: "Aug 2026 (M-D)", amount: 89000, percent: "35%" },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{row.month}</span>
                    <span className="text-primary">{formatKES(row.amount)}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: row.percent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">Sales by Product Category</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Top performing departments in Kenya
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  name: "Curtains & Drapes",
                  count: "14 Orders",
                  share: "45%",
                  color: "bg-emerald-500",
                },
                { name: "Luxury Bedding", count: "8 Orders", share: "28%", color: "bg-indigo-500" },
                { name: "Women Handbags", count: "5 Orders", share: "15%", color: "bg-amber-500" },
                { name: "Footwear & Shoes", count: "3 Orders", share: "12%", color: "bg-rose-500" },
              ].map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                    <span className="font-semibold text-foreground">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{cat.count}</span>
                    <span className="font-bold text-foreground">{cat.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
