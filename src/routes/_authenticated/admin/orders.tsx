import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShoppingBag,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  RotateCcw,
  Eye,
  Filter,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatKES } from "@/lib/products";
import { useStoreOrders, updateOrderStatus, Order, OrderStatus } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrdersPage,
});

export function AdminOrdersPage() {
  const orders = useStoreOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus =
      statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handlePrintInvoice = (order: Order) => {
    toast.success(`Generating official PDF invoice for ${order.orderNumber}...`);
    window.print();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Clock className="h-3 w-3" /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
            <Truck className="h-3 w-3" /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Order Fulfillment &amp; Sales</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor, update statuses, print invoices, and process refunds ({orders.length} orders
              total).
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search order #, customer, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
            {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-secondary/20 transition">
                    <td className="px-6 py-4 font-mono font-medium">{ord.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{ord.customerName}</div>
                      <div className="text-xs text-muted-foreground">{ord.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{ord.date}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatKES(ord.total)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(ord.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(ord)}
                          className="rounded-full"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={Boolean(selectedOrder)} onOpenChange={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-3xl border-border bg-background shadow-luxe p-6">
            <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
              <DialogTitle className="font-display text-2xl">
                Order {selectedOrder.orderNumber}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="rounded-full"
                >
                  <Printer className="h-4 w-4 mr-1.5" /> Print Invoice
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4 text-sm">
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-secondary/30 p-4 border border-border">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Customer Info
                  </div>
                  <div className="font-semibold text-foreground">{selectedOrder.customerName}</div>
                  <div className="text-xs text-muted-foreground">{selectedOrder.customerPhone}</div>
                  <div className="text-xs text-muted-foreground">{selectedOrder.customerEmail}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Delivery Address
                  </div>
                  <div className="font-medium text-foreground">{selectedOrder.location}</div>
                  <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Payment Method
                  </div>
                  <div className="font-medium text-foreground">{selectedOrder.paymentMethod}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Order Items
                </div>
                <div className="divide-y divide-border border-t border-b border-border">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-foreground">{it.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {it.qty}</div>
                      </div>
                      <div className="font-semibold">{formatKES(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between font-display text-lg font-bold">
                  <span>Grand Total:</span>
                  <span>{formatKES(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Update Fulfillment Status
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]
                  ).map((st) => (
                    <Button
                      key={st}
                      variant={selectedOrder.status === st ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className="rounded-full text-xs"
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id, "Cancelled");
                    toast.info(`Refund initiated for ${selectedOrder.orderNumber}`);
                  }}
                  className="text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Issue Full Refund
                </Button>
                <Button onClick={() => setSelectedOrder(null)} className="rounded-full">
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
