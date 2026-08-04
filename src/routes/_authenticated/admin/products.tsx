import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Upload,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Copy,
} from "lucide-react";
import { formatKES, Product, CategorySlug, ProductTag } from "@/lib/products";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useStoreProducts,
  useStoreCategories,
  useStoreMedia,
  saveStoreProduct,
  deleteStoreProduct,
  saveStoreMedia,
} from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProductsPage,
});

export function AdminProductsPage() {
  const productList = useStoreProducts();
  const categoryList = useStoreCategories();
  const mediaLibrary = useStoreMedia();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetIndex, setMediaTargetIndex] = useState<number | "main" | "new">("main");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "curtains",
    subcategory: "",
    price: "",
    originalPrice: "",
    stock: "10",
    collection: "Classic Collection",
    tag: "" as ProductTag | "",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isOnSale: false,
    colors: "White, Cream, Charcoal",
    sizes: "Standard",
    mainImage: "",
    gallery: [] as string[],
    shortDescription: "",
    description: "",
    specifications: [{ label: "Material", value: "Premium Fabric" }],
    isPublished: true,
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      sku: `ELO-${Math.floor(10000 + Math.random() * 90000)}`,
      category: "curtains",
      subcategory: "",
      price: "",
      originalPrice: "",
      stock: "10",
      collection: "Classic Collection",
      tag: "",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      isOnSale: false,
      colors: "White, Cream, Charcoal",
      sizes: "Standard",
      mainImage: "",
      gallery: [],
      shortDescription: "",
      description: "",
      specifications: [{ label: "Material", value: "Premium Quality" }],
      isPublished: true,
    });
    setNewGalleryUrl("");
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const galleryImages = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
    setFormData({
      name: p.name,
      sku: p.sku || `ELO-${Math.floor(10000 + Math.random() * 90000)}`,
      category: p.category,
      subcategory: p.subcategory || "",
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : "",
      stock: p.stock.toString(),
      collection: p.collection || "Classic Collection",
      tag: p.tag || "",
      isFeatured: p.isFeatured || p.tag === "Featured",
      isBestSeller: p.isBestSeller || p.tag === "Bestseller",
      isNewArrival: p.isNewArrival || p.tag === "New",
      isOnSale: p.isOnSale || p.tag === "Sale" || Boolean(p.originalPrice),
      colors: p.colors ? p.colors.join(", ") : "",
      sizes: p.sizes ? p.sizes.join(", ") : "",
      mainImage: p.image,
      gallery: galleryImages,
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      specifications:
        p.specifications && p.specifications.length > 0
          ? p.specifications
          : [{ label: "Material", value: "Premium Quality" }],
      isPublished: p.isPublished !== false,
    });
    setNewGalleryUrl("");
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod_${Date.now()}`,
      name: `${p.name} (Copy)`,
      sku: p.sku ? `${p.sku}-COPY` : `ELO-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    saveStoreProduct(duplicated);
    toast.success(`Duplicated "${p.name}" successfully!`);
  };

  const handleAddSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const handleRemoveSpecRow = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateSpecRow = (idx: number, field: "label" | "value", val: string) => {
    setFormData((prev) => {
      const copy = [...prev.specifications];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, specifications: copy };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "main" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      if (target === "main") {
        setFormData((prev) => ({
          ...prev,
          mainImage: base64Url,
          gallery: prev.gallery.includes(base64Url) ? prev.gallery : [base64Url, ...prev.gallery],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, base64Url],
        }));
      }

      // Also auto-save file to media library
      saveStoreMedia({
        id: `uploaded_${Date.now()}`,
        url: base64Url,
        title: file.name,
        folder: formData.category ? formData.category.toUpperCase() : "GENERAL",
        createdAt: new Date().toISOString(),
      });

      toast.success("Image uploaded & added to Media Library!");
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const url = newGalleryUrl.trim();
    setFormData((prev) => ({
      ...prev,
      mainImage: prev.mainImage || url,
      gallery: [...prev.gallery, url],
    }));
    setNewGalleryUrl("");
    toast.success("Added image to gallery");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => {
      const updatedGallery = prev.gallery.filter((_, i) => i !== index);
      const newMain =
        prev.mainImage === prev.gallery[index] ? updatedGallery[0] || "" : prev.mainImage;
      return {
        ...prev,
        gallery: updatedGallery,
        mainImage: newMain,
      };
    });
    toast.success("Removed image from gallery");
  };

  const handleSetMainImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      mainImage: url,
    }));
    toast.success("Set as main featured image");
  };

  const handleMoveGalleryImage = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const galleryCopy = [...prev.gallery];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= galleryCopy.length) return prev;
      const temp = galleryCopy[index];
      galleryCopy[index] = galleryCopy[targetIndex];
      galleryCopy[targetIndex] = temp;
      return { ...prev, gallery: galleryCopy };
    });
  };

  const handleSelectFromMediaLibrary = (url: string) => {
    if (mediaTargetIndex === "main") {
      setFormData((prev) => ({
        ...prev,
        mainImage: url,
        gallery: prev.gallery.includes(url) ? prev.gallery : [url, ...prev.gallery],
      }));
    } else if (mediaTargetIndex === "new") {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, url],
        mainImage: prev.mainImage || url,
      }));
    } else if (typeof mediaTargetIndex === "number") {
      setFormData((prev) => {
        const copy = [...prev.gallery];
        copy[mediaTargetIndex] = url;
        return {
          ...prev,
          gallery: copy,
          mainImage: prev.mainImage === prev.gallery[mediaTargetIndex] ? url : prev.mainImage,
        };
      });
    }
    setIsMediaPickerOpen(false);
    toast.success("Selected image from Media Library");
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const mainImg =
      formData.mainImage ||
      formData.gallery[0] ||
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop";

    const finalGallery = formData.gallery.length > 0 ? formData.gallery : [mainImg];

    const targetId = editingProduct ? editingProduct.id : `prod_${Date.now()}`;

    const newProduct: Product = {
      id: targetId,
      name: formData.name,
      sku: formData.sku || `ELO-${Math.floor(10000 + Math.random() * 90000)}`,
      category: formData.category as CategorySlug,
      subcategory: formData.subcategory || undefined,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock) || 0,
      collection: formData.collection || "Classic Collection",
      tag: (formData.tag as ProductTag) || undefined,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      isOnSale: formData.isOnSale,
      colors: formData.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sizes: formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image: mainImg,
      gallery: finalGallery,
      shortDescription: formData.shortDescription || undefined,
      description: formData.description || "Premium handcrafted luxury item.",
      specifications: formData.specifications.filter((s) => s.label.trim() && s.value.trim()),
      features: editingProduct?.features || [
        "100% Quality Assurance",
        "Fast Delivery in Kenya",
        "Easy Returns",
      ],
      rating: editingProduct?.rating || 4.9,
      reviews: editingProduct?.reviews || 3,
      isPublished: formData.isPublished,
    };

    saveStoreProduct(newProduct);
    toast.success(
      editingProduct ? "Product saved & storefront updated!" : "New product published!",
    );
    setIsAddOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = () => {
    if (!deletingProduct) return;
    deleteStoreProduct(deletingProduct.id);
    toast.success("Product deleted successfully!");
    setDeletingProduct(null);
  };

  const handleTogglePublish = (product: Product) => {
    const updated = {
      ...product,
      isPublished: product.isPublished === false ? true : false,
    };
    saveStoreProduct(updated);
    toast.success(updated.isPublished ? "Product published!" : "Product hidden from store!");
  };

  const filteredProducts = productList.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
          ? p.isPublished !== false
          : p.isPublished === false;
    return matchesCat && matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Product &amp; Catalog Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add products, edit details, manage image galleries, pricing, variants, and visibility
              ({productList.length} items total).
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="rounded-full shadow-soft"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />

            {/* Category Filter */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Categories
            </button>
            {categoryList.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                  selectedCategory === c.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "hidden")}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none"
            >
              <option value="all">All Products</option>
              <option value="published">Published Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Item &amp; Gallery</th>
                <th className="px-6 py-4">Category / Subcategory</th>
                <th className="px-6 py-4">Price (KSh)</th>
                <th className="px-6 py-4">Tags &amp; Stock</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative group shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-14 w-12 rounded-xl object-cover border border-border"
                          />
                          {p.gallery && p.gallery.length > 1 && (
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border border-background">
                              {p.gallery.length}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{p.name}</div>
                          {p.shortDescription && (
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                              {p.shortDescription}
                            </div>
                          )}
                          <div className="text-[11px] text-muted-foreground">{p.collection}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-self-start rounded-full bg-secondary px-2.5 py-0.5 text-xs uppercase tracking-wider font-medium text-secondary-foreground w-fit">
                          {p.category}
                        </span>
                        {p.subcategory && (
                          <span className="text-xs text-muted-foreground pl-1">
                            {p.subcategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatKES(p.price)}
                      {p.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatKES(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        {p.tag && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-semibold">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {p.tag}
                          </span>
                        )}
                        <div>
                          {p.stock > 5 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> {p.stock} in stock
                            </span>
                          ) : p.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              <AlertTriangle className="h-3 w-3" /> Low ({p.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                              Out of stock
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                          p.isPublished !== false
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {p.isPublished !== false ? (
                          <>
                            <Eye className="h-3.5 w-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateProduct(p)}
                          title="Duplicate product"
                          className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(p)}
                          title="Edit product"
                          className="rounded-full hover:bg-secondary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingProduct(p)}
                          title="Delete product"
                          className="rounded-full text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Add / Edit Product Modal */}
      <Dialog
        open={isAddOpen || Boolean(editingProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingProduct ? `Edit ${editingProduct.name}` : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-6 mt-4">
            {/* 1. Basic Information */}
            <div className="space-y-4 rounded-2xl border border-border p-4 bg-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" /> Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Product Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Royal Blue Velvet Grommet Drapes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">SKU Code</Label>
                  <Input
                    placeholder="e.g. ELO-90821"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Category *</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-full border border-border bg-background px-3 py-2 text-sm outline-none"
                  >
                    {categoryList.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Subcategory</Label>
                  <Input
                    placeholder="e.g. Blackout Drapes, Tote Bags, High Heels"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Collection</Label>
                  <Input
                    placeholder="e.g. Royal Velvet Edit"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Selling Price (KSh) *</Label>
                  <Input
                    type="number"
                    required
                    placeholder="3500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">
                    Discounted / Original Price
                  </Label>
                  <Input
                    type="number"
                    placeholder="4500"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Stock Quantity *</Label>
                  <Input
                    type="number"
                    required
                    placeholder="15"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Product Badge Tag</Label>
                  <select
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value as ProductTag })
                    }
                    className="w-full rounded-full border border-border bg-background px-3 py-2 text-sm outline-none"
                  >
                    <option value="">No Badge</option>
                    <option value="Featured">Featured Product</option>
                    <option value="Bestseller">Best Seller</option>
                    <option value="New">New Arrival</option>
                    <option value="Sale">On Sale</option>
                    <option value="Limited">Limited Edition</option>
                  </select>
                </div>
              </div>

              {/* Special Flags Checkboxes */}
              <div className="pt-2 border-t border-border/60">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Promotional Flags
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer bg-secondary/30 p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-border"
                    />
                    Mark Featured
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer bg-secondary/30 p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded border-border"
                    />
                    Mark Best Seller
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer bg-secondary/30 p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="rounded border-border"
                    />
                    Mark New Arrival
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer bg-secondary/30 p-2.5 rounded-xl border border-border/50 hover:bg-secondary/60">
                    <input
                      type="checkbox"
                      checked={formData.isOnSale}
                      onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                      className="rounded border-border"
                    />
                    Mark On Sale
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isPublishedCheck" className="text-sm font-medium cursor-pointer">
                  Publish on Storefront immediately
                </Label>
              </div>
            </div>

            {/* 2. Image Gallery & Featured Image */}
            <div className="space-y-4 rounded-2xl border border-border p-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Product Media Gallery &amp; Featured Photo
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMediaTargetIndex("new");
                    setIsMediaPickerOpen(true);
                  }}
                  className="rounded-full text-xs"
                >
                  <ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Pick from Media Library
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Main Featured Image</Label>
                  <div className="relative aspect-square rounded-2xl border border-border overflow-hidden bg-secondary/30 flex items-center justify-center">
                    {formData.mainImage ? (
                      <img
                        src={formData.mainImage}
                        alt="Main product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-xs text-muted-foreground">
                        No main image selected
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <span className="inline-flex w-full items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 text-xs font-semibold transition">
                        <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "main")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <Label className="text-xs uppercase tracking-wider">
                    Gallery Images ({formData.gallery.length})
                  </Label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste Image URL (https://...)"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="rounded-full text-xs"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddGalleryUrl}
                      className="rounded-full text-xs shrink-0"
                    >
                      Add URL
                    </Button>
                  </div>

                  {/* Gallery Thumbnails List */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                    {formData.gallery.map((url, idx) => {
                      const isMain = formData.mainImage === url;
                      return (
                        <div
                          key={idx}
                          className={`relative group rounded-xl border overflow-hidden aspect-square bg-secondary/20 transition ${
                            isMain ? "border-primary ring-2 ring-primary/40" : "border-border"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="h-full w-full object-cover"
                          />

                          {isMain && (
                            <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              Main
                            </span>
                          )}

                          <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1 text-white">
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(url)}
                                className="bg-primary/90 hover:bg-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              >
                                Set Main
                              </button>
                            )}
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveGalleryImage(idx, "up")}
                                  className="p-1 hover:bg-white/20 rounded"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                              )}
                              {idx < formData.gallery.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveGalleryImage(idx, "down")}
                                  className="p-1 hover:bg-white/20 rounded"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="p-1 text-rose-300 hover:bg-rose-500/30 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Variants (Colors & Sizes) */}
            <div className="space-y-4 rounded-2xl border border-border p-4 bg-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layers className="h-4 w-4" /> Variants &amp; Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">
                    Color Options (Comma separated)
                  </Label>
                  <Input
                    placeholder="Gold, Champagne, Emerald, Royal Blue"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="rounded-full"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    e.g. Ivory, Midnight Navy, Charcoal
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">
                    Size Options (Comma separated)
                  </Label>
                  <Input
                    placeholder="Standard (7 x 9 ft), Double Panel, Custom Size"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="rounded-full"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    e.g. Single Panel, King Bed, EU 38
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Specifications */}
            <div className="space-y-4 rounded-2xl border border-border p-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Specifications &amp; Features
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpecRow}
                  className="rounded-full text-xs"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Specification
                </Button>
              </div>

              <div className="space-y-2">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder="Label (e.g. Material)"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpecRow(idx, "label", e.target.value)}
                      className="rounded-full text-xs flex-1"
                    />
                    <Input
                      placeholder="Value (e.g. 100% Velvet, Ring Eyelet)"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpecRow(idx, "value", e.target.value)}
                      className="rounded-full text-xs flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpecRow(idx)}
                      className="text-rose-500 hover:bg-rose-50 rounded-full h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Descriptions */}
            <div className="space-y-4 rounded-2xl border border-border p-4 bg-card">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Product Descriptions
              </h3>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Short Description</Label>
                <Input
                  placeholder="Brief 1-sentence highlight for cards & previews..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="rounded-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Full Detailed Description
                </Label>
                <textarea
                  rows={4}
                  placeholder="Include material details, weave pattern, care instructions, origin, packaging..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingProduct(null);
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full shadow-soft">
                {editingProduct ? "Save & Update Storefront" : "Create & Publish Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Media Picker Modal */}
      <Dialog open={isMediaPickerOpen} onOpenChange={setIsMediaPickerOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Select Image from Media Library
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
            {mediaLibrary.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectFromMediaLibrary(m.url)}
                className="group relative rounded-xl border border-border overflow-hidden aspect-square hover:ring-2 hover:ring-primary transition text-left"
              >
                <img src={m.url} alt={m.title} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-charcoal/80 p-1 text-[10px] text-cream truncate">
                  {m.title}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <Dialog open={Boolean(deletingProduct)} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-destructive">
              Delete Product?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{deletingProduct?.name}</span>? This
            action will remove the product from the storefront.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletingProduct(null)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} className="rounded-full">
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
