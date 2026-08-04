import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Package,
  Search,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  Save,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useStoreProducts, saveStoreProduct } from "@/lib/store";
import { formatKES, Product } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/inventory")({
  component: AdminInventoryPage,
});

export function AdminInventoryPage() {
  const products = useStoreProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    if (filter === "low") return matchesSearch && p.stock > 0 && p.stock <= 5;
    if (filter === "out") return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  const handleStockChange = (id: string, newStock: number) => {
    setStockUpdates((prev) => ({ ...prev, [id]: Math.max(0, newStock) }));
  };

  const handleSaveStock = (product: Product) => {
    const updatedStock = stockUpdates[product.id] ?? product.stock;
    const updated: Product = { ...product, stock: updatedStock };
    saveStoreProduct(updated);
    toast.success(`Updated stock for ${product.name} to ${updatedStock}`);
  };

  const handleBulkSave = () => {
    let count = 0;
    products.forEach((p) => {
      if (stockUpdates[p.id] !== undefined && stockUpdates[p.id] !== p.stock) {
        saveStoreProduct({ ...p, stock: stockUpdates[p.id] });
        count++;
      }
    });
    setStockUpdates({});
    toast.success(`Updated stock levels for ${count} products.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Stock &amp; Inventory Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor real-time inventory levels, set minimum stock alerts, and perform quick stock
              updates.
            </p>
          </div>
          {Object.keys(stockUpdates).length > 0 && (
            <Button
              onClick={handleBulkSave}
              className="rounded-full shadow-soft bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="mr-2 h-4 w-4" /> Save {Object.keys(stockUpdates).length} Changes
            </Button>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-foreground">{products.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Products
              </div>
            </div>
            <Package className="h-8 w-8 text-primary opacity-80" />
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-soft flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-amber-900">
                {products.filter((p) => p.stock > 0 && p.stock <= 5).length}
              </div>
              <div className="text-xs text-amber-700 font-medium uppercase tracking-wider">
                Low Stock (≤ 5)
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-soft flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold text-rose-900">
                {products.filter((p) => p.stock === 0).length}
              </div>
              <div className="text-xs text-rose-700 font-medium uppercase tracking-wider">
                Out of Stock
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-full text-xs"
            >
              All Items
            </Button>
            <Button
              variant={filter === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("low")}
              className="rounded-full text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
            >
              Low Stock
            </Button>
            <Button
              variant={filter === "out" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("out")}
              className="rounded-full text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              Out of Stock
            </Button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">SKU</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Stock Level</th>
                <th className="px-6 py-3.5 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((p) => {
                const currentVal = stockUpdates[p.id] ?? p.stock;
                const isModified =
                  stockUpdates[p.id] !== undefined && stockUpdates[p.id] !== p.stock;

                return (
                  <tr key={p.id} className="hover:bg-secondary/20 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-xl object-cover border border-border"
                        />
                        <div>
                          <div className="font-semibold text-foreground">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground capitalize">
                            {p.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">{p.sku || "N/A"}</td>
                    <td className="px-6 py-4 font-semibold">{formatKES(p.price)}</td>
                    <td className="px-6 py-4">
                      {currentVal === 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : currentVal <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, currentVal - 1)}
                          className="h-7 w-7 rounded-full bg-secondary hover:bg-secondary/80 font-bold text-center"
                        >
                          -
                        </button>
                        <Input
                          type="number"
                          value={currentVal}
                          onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center font-bold text-xs rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, currentVal + 1)}
                          className="h-7 w-7 rounded-full bg-secondary hover:bg-secondary/80 font-bold text-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isModified ? (
                        <Button
                          size="sm"
                          onClick={() => handleSaveStock(p)}
                          className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Save className="mr-1 h-3.5 w-3.5" /> Save
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Synced
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
