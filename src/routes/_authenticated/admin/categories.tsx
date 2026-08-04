import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useStoreCategories,
  saveStoreCategory,
  deleteStoreCategory,
  saveStoreMedia,
  Category,
} from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategoriesPage,
});

export function AdminCategoriesPage() {
  const categories = useStoreCategories();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    image: "",
    bannerImage: "",
    description: "",
    subcategories: "",
    collections: "Classic, Premium, Modern",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      tagline: "",
      image: "",
      bannerImage: "",
      description: "",
      subcategories: "Standard, Luxury, Custom",
      collections: "Classic, Premium, Modern",
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "bannerImage",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setFormData((prev) => ({ ...prev, [field]: base64Url }));
      saveStoreMedia({
        id: `cat_upload_${Date.now()}`,
        url: base64Url,
        title: file.name,
        folder: "Categories",
        createdAt: new Date().toISOString(),
      });
      toast.success("Uploaded category image!");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newCat: Category = {
      slug,
      name: formData.name,
      tagline: formData.tagline || "Curated Elegance",
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      bannerImage: formData.bannerImage || formData.image,
      description: formData.description || `Browse our exclusive collection of ${formData.name}.`,
      subcategories: formData.subcategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      collections: formData.collections
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    saveStoreCategory(newCat);
    toast.success(`Category "${formData.name}" created!`);
    resetForm();
    setIsAddOpen(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const updatedCat: Category = {
      ...editingCategory,
      name: formData.name,
      tagline: formData.tagline,
      image: formData.image || editingCategory.image,
      bannerImage: formData.bannerImage || editingCategory.bannerImage || formData.image,
      description: formData.description,
      subcategories: formData.subcategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      collections: formData.collections
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    saveStoreCategory(updatedCat);
    toast.success(`Category "${formData.name}" updated!`);
    setEditingCategory(null);
    resetForm();
  };

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    deleteStoreCategory(deletingCategory.slug);
    toast.success(`Deleted category "${deletingCategory.name}"`);
    setDeletingCategory(null);
  };

  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      tagline: c.tagline,
      image: c.image || "",
      bannerImage: c.bannerImage || c.image || "",
      description: c.description || "",
      subcategories: c.subcategories ? c.subcategories.join(", ") : "",
      collections: c.collections ? c.collections.join(", ") : "",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">Categories &amp; Collections</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organize storefront collections, hero section images, and taglines (
              {categories.length} categories).
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="rounded-full shadow-soft"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* Category Cards Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {categories.map((c) => (
            <div
              key={c.slug}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:border-accent"
            >
              <div className="relative h-48 w-full overflow-hidden bg-secondary">
                <img
                  src={c.heroImage}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-cream">
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                    {c.tagline}
                  </div>
                  <div className="font-display text-2xl font-semibold">{c.name}</div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    to="/$category"
                    params={{ category: c.slug }}
                    className="text-xs font-medium text-champagne-deep flex items-center gap-1 hover:underline"
                  >
                    View Catalog <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(c)}
                      className="rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingCategory(c)}
                      className="rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog
        open={isAddOpen || Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingCategory(null);
          }
        }}
      >
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Category Name *</Label>
              <Input
                required
                placeholder="e.g. Bedding & Linens"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Tagline</Label>
              <Input
                placeholder="e.g. Luxurious Comfort for Every Bedroom"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="rounded-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Category Image URL or Upload
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="rounded-full text-xs"
                />
                <label className="cursor-pointer shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80">
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Category Banner Image (For storefront headers)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  className="rounded-full text-xs"
                />
                <label className="cursor-pointer shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80">
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "bannerImage")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Subcategories (Comma separated)
              </Label>
              <Input
                placeholder="e.g. Blackout Drapes, Sheer Curtains, Velvet Drapes"
                value={formData.subcategories}
                onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                className="rounded-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Collections / Tags</Label>
              <Input
                placeholder="e.g. Classic, Premium, Modern"
                value={formData.collections}
                onChange={(e) => setFormData({ ...formData, collections: e.target.value })}
                className="rounded-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Category Description</Label>
              <textarea
                rows={3}
                placeholder="Short overview of items in this category for storefront banners..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingCategory(null);
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full">
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <Dialog open={Boolean(deletingCategory)} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-destructive">
              Delete Category?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete category{" "}
            <span className="font-medium text-foreground">{deletingCategory?.name}</span>? This will
            remove it from header navigation menus.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} className="rounded-full">
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
