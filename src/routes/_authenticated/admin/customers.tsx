import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  UserX,
  Download,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatKES } from "@/lib/products";
import { toast } from "sonner";
import {
  useStoreCustomers,
  toggleCustomerStatus,
  useStoreOrders,
  Customer,
  Order,
} from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomersPage,
});

export function AdminCustomersPage() {
  const customers = useStoreCustomers();
  const orders = useStoreOrders();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const handleToggleStatus = (id: string) => {
    toggleCustomerStatus(id);
    toast.success("Updated customer status");
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Location",
      "Orders",
      "Spent",
      "JoinedDate",
      "Status",
    ];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      `"${c.location}"`,
      c.totalOrders,
      c.totalSpent,
      c.joinedDate,
      c.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eloria_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported customer list to CSV!");
  };

  const getCustomerOrders = (email: string) => {
    return orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Customer Directory</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View customer profiles, contact info, total orders, and order history (
              {customers.length} total customers).
            </p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="rounded-full shadow-soft">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-between bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customer name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Lifetime Spend</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/20 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">Member since {c.joinedDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {c.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Phone className="h-3.5 w-3.5" /> {c.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {c.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      {c.totalOrders} orders <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {formatKES(c.totalSpent)}
                  </td>
                  <td className="px-6 py-4">
                    {c.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <UserX className="h-3.5 w-3.5" /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(c)}
                        className="rounded-full text-xs"
                      >
                        History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(c.id)}
                        className={`rounded-full text-xs ${
                          c.status === "Active"
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {c.status === "Active" ? "Block" : "Unblock"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Order History Modal */}
      <Dialog open={Boolean(selectedCustomer)} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Order History for{" "}
              {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-secondary/30 rounded-2xl border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block">Email:</span>
                  <span className="font-semibold text-foreground">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Phone:</span>
                  <span className="font-semibold text-foreground">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Lifetime Spend:</span>
                  <span className="font-semibold text-primary">
                    {formatKES(selectedCustomer.totalSpent)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {getCustomerOrders(selectedCustomer.email).length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No order records found for this email in recent orders.
                  </div>
                ) : (
                  getCustomerOrders(selectedCustomer.email).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{ord.orderNumber}</div>
                        <div className="text-muted-foreground">
                          {ord.date} • {ord.items.length} items
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          M-Pesa Ref: {ord.mpesaReference}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">
                          {formatKES(ord.totalAmount)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
