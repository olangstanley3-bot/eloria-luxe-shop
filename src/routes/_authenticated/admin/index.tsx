import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LayoutDashboard, Package, Layers, Settings, Users, Image, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getAdminStats } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["admin", "stats"],
      queryFn: getAdminStats,
    });
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { data: stats } = useSuspenseQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl">Eloria</span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/">View Store</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's what's happening in your store.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Package} label="Products" value={stats?.productCount ?? 0} />
          <StatCard icon={Layers} label="Categories" value={stats?.categoryCount ?? 0} />
          <StatCard icon={Image} label="Images" value={stats?.imageCount ?? 0} />
          <StatCard icon={Users} label="Enquiries" value={stats?.enquiryCount ?? 0} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <AdminCard
            icon={Package}
            title="Products"
            description="Add, edit, and manage products, pricing, stock, and images."
            to="/admin/products"
          />
          <AdminCard
            icon={Layers}
            title="Categories"
            description="Organize collections and homepage sections."
            to="/admin/categories"
          />
          <AdminCard
            icon={Settings}
            title="Site Settings"
            description="Update WhatsApp, social links, location, and business info."
            to="/admin/settings"
          />
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Quick Start</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Upload product images to the storage bucket.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Add products with names, prices, descriptions, and categories.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Set homepage sections and featured collections.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof LayoutDashboard; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </div>
  );
}

function AdminCard({ icon: Icon, title, description, to }: { icon: typeof LayoutDashboard; title: string; description: string; to: string }) {
  return (
    <Link to={to as "/admin/products"} className="group rounded-2xl border border-border bg-card p-6 transition hover:shadow-soft hover:border-accent">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary group-hover:bg-accent/20 transition">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
