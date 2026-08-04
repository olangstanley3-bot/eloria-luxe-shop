import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Plus,
  Copy,
  Check,
  Trash2,
  Search,
  Upload,
  Folder,
  Edit,
  FolderPlus,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useStoreMedia, saveStoreMedia, deleteStoreMedia, MediaAsset } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: AdminMediaPage,
});

const FOLDERS = [
  "All Folders",
  "Curtains",
  "Bedding",
  "Handbags",
  "Shoes",
  "Home Accessories",
  "Banners",
  "General",
];

export function AdminMediaPage() {
  const mediaList = useStoreMedia();
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All Folders");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState("General");

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setFolder("General");
    setEditingAsset(null);
  };

  const handleCopy = (m: MediaAsset) => {
    navigator.clipboard.writeText(m.url);
    setCopiedId(m.id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setUrl(base64Url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      toast.success("Image loaded into upload form!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please provide an image URL or upload a file.");
      return;
    }

    const assetToSave: MediaAsset = {
      id: editingAsset ? editingAsset.id : `media_${Date.now()}`,
      url: url.trim(),
      title: title.trim() || "Catalog Image",
      folder: folder || "General",
      createdAt: editingAsset?.createdAt || new Date().toISOString(),
    };

    saveStoreMedia(assetToSave);
    toast.success(editingAsset ? "Updated image asset!" : "Added new image to Media Library!");
    setIsAddOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteStoreMedia(id);
    toast.success("Deleted asset from media library!");
  };

  const openEditModal = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setTitle(asset.title);
    setUrl(asset.url);
    setFolder(asset.folder || "General");
    setIsAddOpen(true);
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.folder.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = selectedFolder === "All Folders" || m.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Media &amp; Asset Library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload product photos, replace images, organize into folders, and copy URLs for
              products or banners ({mediaList.length} total assets).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="rounded-full shadow-soft"
            >
              <Plus className="mr-2 h-4 w-4" /> Upload / Add Asset
            </Button>
          </div>
        </div>

        {/* Folder Navigation & Search */}
        <div className="mt-8 flex flex-col md:flex-row items-center gap-4 justify-between bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets by title or folder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Folder className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
            {FOLDERS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition shrink-0 ${
                  selectedFolder === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-3xl border border-border">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <p>No media assets found matching the selected folder or search query.</p>
            </div>
          ) : (
            filteredMedia.map((m) => (
              <div
                key={m.id}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-soft flex flex-col justify-between hover:border-primary/50 transition"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  <img
                    src={m.url}
                    alt={m.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-full bg-charcoal/80 text-cream px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider backdrop-blur">
                      {m.folder || "General"}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="font-medium text-xs text-foreground truncate" title={m.title}>
                    {m.title}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(m)}
                      className="h-7 text-[11px] rounded-full px-2 text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="mr-1 h-3 w-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3 w-3" /> Copy URL
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(m)}
                        className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(m.id)}
                        className="h-7 w-7 p-0 rounded-full text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload / Edit Asset Modal */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingAsset ? "Replace / Edit Media Asset" : "Add Asset to Media Library"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveMedia} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Asset Title *</Label>
              <Input
                required
                placeholder="e.g. Royal Blue Curtain Full Shot"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Folder / Category *</Label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                {FOLDERS.filter((f) => f !== "All Folders").map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Image File or URL</Label>

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex w-full items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-xs font-semibold transition border border-border">
                    <Upload className="mr-2 h-4 w-4" /> Upload Local Image File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="text-center text-xs text-muted-foreground my-1">— OR —</div>

                <Input
                  placeholder="Paste Image URL (https://...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>
            </div>

            {url && (
              <div className="mt-3">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Preview
                </Label>
                <div className="mt-1 h-36 rounded-2xl border border-border overflow-hidden bg-secondary/30">
                  <img src={url} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  resetForm();
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full">
                {editingAsset ? "Save Asset Changes" : "Save to Media Library"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
