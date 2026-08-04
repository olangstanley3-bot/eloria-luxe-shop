import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star, Check, X, Trash2, Search, Filter } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviewsPage,
});

export interface CustomerReview {
  id: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
}

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: "rev_1",
    productName: "Royal Velvet Grommet Drapes",
    customerName: "Amina Wanjiku",
    customerEmail: "amina.w@gmail.com",
    rating: 5,
    comment:
      "The velvet fabric quality is exceptional! Blocking out midday Nairobi sun completely. Highly recommended!",
    date: "2026-07-28",
    status: "Approved",
  },
  {
    id: "rev_2",
    productName: "Luxe Egyptian Cotton Duvet Set",
    customerName: "David Kiprop",
    customerEmail: "dkiprop@yahoo.com",
    rating: 5,
    comment:
      "Soft texture and beautiful stitching. M-Pesa payment was smooth and delivered within 3 hours.",
    date: "2026-07-25",
    status: "Approved",
  },
  {
    id: "rev_3",
    productName: "Italian Leather Tote Bag",
    customerName: "Mercy Mwangi",
    customerEmail: "mercy.m@gmail.com",
    rating: 4,
    comment: "Authentic leather texture. Roomy and fits my laptop perfectly.",
    date: "2026-07-20",
    status: "Pending",
  },
];

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const stored = localStorage.getItem("eloria_store_reviews");
      return stored ? JSON.parse(stored) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const saveReviews = (updated: CustomerReview[]) => {
    setReviews(updated);
    localStorage.setItem("eloria_store_reviews", JSON.stringify(updated));
  };

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    saveReviews(updated);
    toast.success(`Review ${newStatus.toLowerCase()} successfully.`);
  };

  const handleDelete = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
    toast.success("Deleted review!");
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div>
          <h1 className="font-display text-3xl">Product Reviews &amp; Moderation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve customer feedback, view ratings, and maintain product page authenticity.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer, product, or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {["All", "Approved", "Pending", "Rejected"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="rounded-full text-xs"
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl border border-border bg-card shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground text-sm">{rev.customerName}</span>
                  <span className="text-xs text-muted-foreground">({rev.customerEmail})</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rev.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : rev.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted border"}`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-foreground ml-2">
                    {rev.productName}
                  </span>
                </div>

                <p className="text-xs text-foreground/90 italic leading-relaxed pt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="text-[11px] text-muted-foreground">{rev.date}</div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {rev.status !== "Approved" && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(rev.id, "Approved")}
                    className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                )}
                {rev.status !== "Rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(rev.id, "Rejected")}
                    className="rounded-full text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <X className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(rev.id)}
                  className="rounded-full text-muted-foreground hover:text-rose-600 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
