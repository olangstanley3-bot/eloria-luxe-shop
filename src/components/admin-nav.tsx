import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Ticket,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Store,
  LayoutTemplate,
  CreditCard,
  Truck,
  Star,
  BarChart3,
  Shield,
  ShieldAlert,
  FileText,
  Boxes,
  Bell,
  Search,
  Plus,
  ChevronRight,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AdminHeader({ title }: { title?: string }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Order #ELO-90182", time: "5m ago", unread: true },
    { id: 2, title: "Low Stock Alert: Velvet Drapes", time: "1h ago", unread: true },
    { id: 3, title: "New Customer Review Submitted", time: "3h ago", unread: false },
  ]);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Homepage", href: "/admin/homepage", icon: LayoutTemplate },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Shipping", href: "/admin/shipping", icon: Truck },
    { label: "Discounts", href: "/admin/coupons", icon: Ticket },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Media", href: "/admin/media", icon: ImageIcon },
    { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Users & Roles", href: "/admin/users", icon: Shield },
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "Security", href: "/admin/security", icon: ShieldAlert },
    { label: "System Logs", href: "/admin/logs", icon: FileText },
  ];

  const currentNav = navItems.find((i) => i.href === location.pathname);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="border-b border-border bg-card shadow-soft sticky top-0 z-30">
      {/* Top Header Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl tracking-tight font-bold">Eloria</span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
              CMS Admin
            </span>
          </Link>

          {/* Top Quick Search */}
          <div className="hidden lg:flex items-center relative w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, orders, customers..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-9 h-8 rounded-full text-xs bg-secondary/50 border-border/80 focus:bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action Button */}
          <Link
            to="/admin/products"
            className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition shadow-soft"
          >
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Link>

          {/* Notifications Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4 rounded-2xl shadow-luxe border-border">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                <span className="font-display text-sm font-semibold">Store Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border border-border/50 ${
                      n.unread ? "bg-secondary/60 font-medium" : "bg-card text-muted-foreground"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 text-xs font-semibold transition border border-border"
          >
            <Store className="h-3.5 w-3.5 text-primary" /> Storefront
          </Link>

          {/* Admin User Profile */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border">
            <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
              {user?.email}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="rounded-full h-8 w-8 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Bar / Breadcrumbs */}
      <div className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Link to="/admin" className="hover:text-foreground">
              Admin
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">
              {currentNav?.label || title || "Dashboard"}
            </span>
          </div>

          {/* Scrollable Navigation Menu */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href as "/admin"}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
