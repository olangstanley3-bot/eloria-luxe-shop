import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  MessageCircle,
  Eye,
} from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { whatsappUrl } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: AdminEnquiriesPage,
});

export interface CustomerEnquiry {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  productId?: string;
  status: "pending" | "in_progress" | "resolved";
  createdAt: string;
}

const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: "enq_1",
    kind: "custom_curtain",
    name: "Amina Mohamed",
    email: "amina.m@gmail.com",
    phone: "0712345678",
    subject: "Custom Velvet Sheer Curtain Sizing for Living Room",
    message:
      "Hi Eloria! I have a window measuring 3.5m wide by 2.8m drop. Do you offer custom double-pleat stitching and fitting in Westlands?",
    status: "pending",
    createdAt: "2026-08-01T14:20:00Z",
  },
  {
    id: "enq_2",
    kind: "general",
    name: "David Ochieng",
    email: "david.ochieng@yahoo.com",
    phone: "0722987654",
    subject: "Wholesale Handbag Inquiry",
    message:
      "Do you supply boutique shops in Kisumu with wholesale tote bags? Please send your wholesale catalog.",
    status: "in_progress",
    createdAt: "2026-07-30T09:15:00Z",
  },
  {
    id: "enq_3",
    kind: "order_help",
    name: "Mercy Njeri",
    email: "mercy.n@outlook.com",
    phone: "0733112233",
    subject: "Delivery Confirmation to Eldoret",
    message: "I placed an order via M-Pesa this morning. How long does dispatch take to Eldoret?",
    status: "resolved",
    createdAt: "2026-07-28T16:45:00Z",
  },
];

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(INITIAL_ENQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);

  const handleUpdateStatus = (id: string, newStatus: "pending" | "in_progress" | "resolved") => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.success(`Enquiry status updated to ${newStatus.replace("_", " ")}`);
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q) ||
      (e.subject && e.subject.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Customer Enquiries</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review, manage, and respond to incoming contact submissions and custom curtain
              requests ({enquiries.length} total).
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between bg-card border border-border p-4 rounded-2xl shadow-soft">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sender, email or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                statusFilter === "pending"
                  ? "bg-amber-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                statusFilter === "in_progress"
                  ? "bg-indigo-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                statusFilter === "resolved"
                  ? "bg-emerald-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Enquiries List */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="divide-y divide-border/60">
            {filteredEnquiries.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-10 w-10 opacity-40 mb-2" />
                <p>No enquiries found matching filter criteria.</p>
              </div>
            ) : (
              filteredEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-6 transition hover:bg-secondary/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base text-foreground">{enq.name}</span>
                      <StatusBadge status={enq.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {enq.subject && (
                      <div className="font-medium text-xs uppercase tracking-wider text-champagne-deep">
                        {enq.subject}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {enq.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {enq.email}
                      </span>
                      {enq.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" /> {enq.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEnquiry(enq)}
                      className="rounded-full text-xs"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> View Details
                    </Button>

                    {enq.phone && (
                      <a
                        href={whatsappUrl(
                          `Hi ${enq.name}, regarding your Eloria Store enquiry: "${enq.subject || enq.message.slice(0, 40)}..."`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#20bd5a] transition"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* View Enquiry Detail Modal */}
      <Dialog open={Boolean(selectedEnquiry)} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="max-w-lg sm:rounded-3xl border-border bg-background shadow-luxe p-6 space-y-4">
          {selectedEnquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="font-display text-xl">{selectedEnquiry.name}</DialogTitle>
                  <StatusBadge status={selectedEnquiry.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </DialogHeader>

              <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="font-medium hover:underline"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="font-medium hover:underline"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}
                {selectedEnquiry.subject && (
                  <div>
                    <span className="text-muted-foreground">Subject:</span>{" "}
                    <span className="font-medium">{selectedEnquiry.subject}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message Content:
                </div>
                <div className="rounded-2xl border border-border p-4 text-xs leading-relaxed bg-background">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Update Status:
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={selectedEnquiry.status === "pending" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, "pending")}
                    className="rounded-full text-xs"
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedEnquiry.status === "in_progress" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, "in_progress")}
                    className="rounded-full text-xs"
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedEnquiry.status === "resolved" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, "resolved")}
                    className="rounded-full text-xs"
                  >
                    Resolved
                  </Button>
                </div>
              </div>

              {selectedEnquiry.phone && (
                <a
                  href={whatsappUrl(
                    `Hi ${selectedEnquiry.name}, thank you for contacting Eloria Store! Regarding your inquiry: "${selectedEnquiry.message.slice(0, 60)}..."`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-xs font-medium text-white hover:bg-[#20bd5a] transition mt-4"
                >
                  <MessageCircle className="h-4 w-4" /> Reply to Customer via WhatsApp
                </a>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "in_progress" | "resolved" }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700">
        <Clock className="h-3 w-3" /> In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Resolved
    </span>
  );
}
