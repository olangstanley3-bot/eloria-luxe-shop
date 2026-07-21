import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-xl">Products</h1>
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl">Product management</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The full product CRUD interface is being finalized. For now, please add or edit products through the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
