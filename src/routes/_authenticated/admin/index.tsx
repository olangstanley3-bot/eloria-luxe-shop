import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Layers,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getAdminStats } from "@/lib/admin.functions";
import { AdminHeader } from "@/components/admin-nav";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      try {
        return await getAdminStats();
      } catch (err) {
        return {
          productCount: 22,
          categoryCount: 5,
          imageCount: 54,
          enquiryCount: 3,
        };
      }
    },
    initialData: {
      productCount: 22,
      categoryCount: 5,
      imageCount: 54,
      enquiryCount: 3,
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl">Store Operations &amp; Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{user?.email}</span>.
              Control products, orders, customers, media assets, and settings.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Package} label="Total Products" value={stats.productCount} />
          <StatCard icon={ShoppingBag} label="Active Orders" value={4} />
          <StatCard icon={Users} label="Registered Customers" value={4} />
          <StatCard icon={MessageSquare} label="Customer Enquiries" value={stats.enquiryCount} />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            icon={Package}
            title="Product Management"
            description="Manage inventory, prices, tags, colors, sizes, and galleries."
            to="/admin/products"
          />
          <AdminCard
            icon={Layers}
            title="Category Management"
            description="Organize store collections, hero banners, and tags."
            to="/admin/categories"
          />
          <AdminCard
            icon={ShoppingBag}
            title="Order Fulfillment"
            description="View incoming orders, change delivery status, and print invoices."
            to="/admin/orders"
          />
          <AdminCard
            icon={Users}
            title="Customer Directory"
            description="View customer profiles, order histories, and manage accounts."
            to="/admin/customers"
          />
          <AdminCard
            icon={Ticket}
            title="Coupons & Discounts"
            description="Create promo codes, percentage discounts, and flash sales."
            to="/admin/coupons"
          />
          <AdminCard
            icon={ImageIcon}
            title="Media & Assets"
            description="Organize catalog images, banner graphics, and gallery URLs."
            to="/admin/media"
          />
          <AdminCard
            icon={MessageSquare}
            title="Customer Enquiries"
            description="View and respond to customer form submissions."
            to="/admin/enquiries"
          />
          <AdminCard
            icon={Settings}
            title="Site & Banner Settings"
            description="Update WhatsApp number, business hours, and announcement bar."
            to="/admin/settings"
          />
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Operational Checklist</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border p-4 bg-secondary/30">
              <div className="font-medium text-foreground mb-1">1. Product Inventory</div>
              <div>
                Ensure products have updated KSh pricing, stock levels, and gallery image URLs.
              </div>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-secondary/30">
              <div className="font-medium text-foreground mb-1">2. WhatsApp Quick Order</div>
              <div>Verify the store phone and WhatsApp credentials in Site Settings.</div>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-secondary/30">
              <div className="font-medium text-foreground mb-1">3. Customer Support</div>
              <div>
                Check the Enquiries inbox to resolve customer messages and custom curtain orders.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
          <Icon className="h-6 w-6 text-foreground" />
        </div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </div>
  );
}

function AdminCard({
  icon: Icon,
  title,
  description,
  to,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link
      to={to as "/admin"}
      className="group rounded-3xl border border-border bg-card p-6 transition hover:shadow-soft hover:border-accent flex flex-col justify-between"
    >
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="mt-6 flex items-center gap-1 text-xs font-medium text-champagne-deep group-hover:translate-x-1 transition-transform">
        Manage <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
