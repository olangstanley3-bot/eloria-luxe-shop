import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Smartphone, KeyRound, AlertTriangle, Save } from "lucide-react";
import { AdminHeader } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/security")({
  component: AdminSecurityPage,
});

export function AdminSecurityPage() {
  const [enable2FA, setEnable2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [ipWhitelist, setIpWhitelist] = useState("102.217.155.10, 197.232.88.4");
  const [adminPasswordPolicy, setAdminPasswordPolicy] = useState(
    "Strong (12+ characters, special symbol)",
  );

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security policies updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Security &amp; Access Controls</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure administrator authentication policies, 2FA enforcement, session timeout
              limits, and IP restrictions.
            </p>
          </div>
          <Button onClick={handleSaveSecurity} className="rounded-full shadow-soft">
            <Save className="mr-2 h-4 w-4" /> Save Security Policies
          </Button>
        </div>

        <form onSubmit={handleSaveSecurity} className="mt-8 space-y-6">
          {/* Two-Factor Authentication */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 font-display text-lg">
                <Smartphone className="h-5 w-5 text-emerald-600" /> Two-Factor Authentication (2FA)
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="rounded border-border text-primary"
                />
                Enforce 2FA for Admin Portal
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Require all store managers and super admins to authenticate via SMS verification or
              Google Authenticator OTP app.
            </p>
          </div>

          {/* Session Timeout */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg">
              <Lock className="h-5 w-5 text-amber-600" /> Auto Session Timeout &amp; Expiry
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Inactivity Lockout (Minutes)
                </Label>
                <Input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="rounded-full text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">
                  Password Enforcement Policy
                </Label>
                <Input
                  value={adminPasswordPolicy}
                  onChange={(e) => setAdminPasswordPolicy(e.target.value)}
                  className="rounded-full text-xs"
                />
              </div>
            </div>
          </div>

          {/* IP Whitelisting */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-soft space-y-4">
            <div className="flex items-center gap-2 font-display text-lg">
              <KeyRound className="h-5 w-5 text-indigo-600" /> Authorized Admin IP Addresses
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">
                Allowed IP Whitelist (Comma-separated)
              </Label>
              <Input
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="102.217.155.10, 197.232.88.4"
                className="rounded-full text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground pt-1">
                Leave empty or specify IP ranges to restrict admin login attempts strictly to
                authorized office networks in Nairobi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
