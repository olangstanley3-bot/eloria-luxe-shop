import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Search, Shield, Filter, Download } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/logs")({
  component: AdminLogsPage,
});

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: "Product" | "Order" | "Settings" | "Security" | "Coupon";
  details: string;
  ip: string;
}

const DEFAULT_LOGS: AuditLog[] = [
  {
    id: "log_101",
    timestamp: "2026-08-03 07:18:22",
    user: "admin@eloria.co.ke",
    action: "Updated Product Price",
    category: "Product",
    details: "Changed price for 'Royal Blue Velvet Grommet Drapes' from KSh 8,500 to KSh 7,900",
    ip: "102.217.155.10",
  },
  {
    id: "log_102",
    timestamp: "2026-08-02 16:42:05",
    user: "david.store@eloria.co.ke",
    action: "Order Status Change",
    category: "Order",
    details: "Marked order #ELO-89201 as 'Delivered' (M-Pesa Ref: QGH82910)",
    ip: "197.232.88.4",
  },
  {
    id: "log_103",
    timestamp: "2026-08-01 11:05:40",
    user: "admin@eloria.co.ke",
    action: "Created Coupon Code",
    category: "Coupon",
    details: "Created promo code 'NAIROBI15' (15% OFF, Min KSh 5,000)",
    ip: "102.217.155.10",
  },
  {
    id: "log_104",
    timestamp: "2026-07-31 09:12:15",
    user: "admin@eloria.co.ke",
    action: "Updated Store Settings",
    category: "Settings",
    details: "Saved M-Pesa Till 5920311 and updated store phone display",
    ip: "102.217.155.10",
  },
];

export function AdminLogsPage() {
  const [logs] = useState<AuditLog[]>(DEFAULT_LOGS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportLogs = () => {
    const headers = ["ID", "Timestamp", "User", "Action", "Category", "Details", "IP Address"];
    const rows = filtered.map((l) => [
      l.id,
      l.timestamp,
      l.user,
      `"${l.action}"`,
      l.category,
      `"${l.details}"`,
      l.ip,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eloria_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported system audit logs to CSV!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">System Audit Logs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Trace administrative events, price changes, product edits, and order processing logs.
            </p>
          </div>
          <Button onClick={handleExportLogs} variant="outline" className="rounded-full shadow-soft">
            <Download className="mr-2 h-4 w-4" /> Export Logs
          </Button>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs by keyword, user, or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {["All", "Product", "Order", "Settings", "Coupon", "Security"].map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className="rounded-full text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20 transition">
                  <td className="px-6 py-4 font-mono text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{log.user}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-secondary text-foreground text-[10px] font-bold">
                      {log.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/90 max-w-xs">{log.details}</td>
                  <td className="px-6 py-4 text-right font-mono text-muted-foreground">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
