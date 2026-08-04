import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shield, Plus, Edit, Trash2, Key, CheckCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsersPage,
});

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Store Manager" | "Fulfillment Agent" | "Support Agent";
  status: "Active" | "Inactive";
  lastLogin: string;
}

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "user_1",
    name: "System Admin",
    email: "admin@eloria.co.ke",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2026-08-03 07:15 AM",
  },
  {
    id: "user_2",
    name: "David Ochieng",
    email: "david.store@eloria.co.ke",
    role: "Store Manager",
    status: "Active",
    lastLogin: "2026-08-02 04:30 PM",
  },
  {
    id: "user_3",
    name: "Grace Wanjiru",
    email: "grace.orders@eloria.co.ke",
    role: "Fulfillment Agent",
    status: "Active",
    lastLogin: "2026-08-01 11:10 AM",
  },
];

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem("eloria_admin_users");
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Store Manager" as AdminUser["role"],
  });

  const saveUsers = (updated: AdminUser[]) => {
    setUsers(updated);
    localStorage.setItem("eloria_admin_users", JSON.stringify(updated));
  };

  const handleOpenModal = (u?: AdminUser) => {
    if (u) {
      setEditingUser(u);
      setFormData({ name: u.name, email: u.email, role: u.role });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "Store Manager" });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id
          ? { ...u, name: formData.name, email: formData.email, role: formData.role }
          : u,
      );
      saveUsers(updated);
      toast.success("Updated staff role!");
    } else {
      const newUser: AdminUser = {
        id: `usr_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: "Active",
        lastLogin: "Never",
      };
      saveUsers([...users, newUser]);
      toast.success("Created new administrator account!");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    toast.success("Removed user access!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Users &amp; Role Permissions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage store staff access, assign role privileges (Super Admin, Store Manager, Order
              Fulfillment).
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="rounded-full shadow-soft">
            <Plus className="mr-2 h-4 w-4" /> Add Admin Staff
          </Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Last Login</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition">
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> {u.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-secondary text-foreground text-[10px] font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(u)}
                        className="rounded-full text-xs"
                      >
                        <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                      </Button>
                      {u.role !== "Super Admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(u.id)}
                          className="rounded-full text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md sm:rounded-3xl border-border bg-background shadow-luxe p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingUser ? "Edit User Access" : "Add Administrator Staff"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Full Name *</Label>
              <Input
                required
                placeholder="e.g. Samuel Mutua"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Email Address *</Label>
              <Input
                type="email"
                required
                placeholder="samuel@eloria.co.ke"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Role &amp; Permissions</Label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as AdminUser["role"] })
                }
                className="w-full rounded-full border border-border bg-background px-4 py-2 text-xs font-medium outline-none"
              >
                <option value="Super Admin">Super Admin (Full Control)</option>
                <option value="Store Manager">Store Manager (Products, Pricing, Orders)</option>
                <option value="Fulfillment Agent">
                  Fulfillment Agent (Orders &amp; Shipping Only)
                </option>
                <option value="Support Agent">Support Agent (Enquiries &amp; Reviews)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full text-xs">
                Save User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
