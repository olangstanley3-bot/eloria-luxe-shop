import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Lock, KeyRound, ArrowRight, Store, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedAdminLayout,
});

function AuthenticatedAdminLayout() {
  const { user, isLoading, signIn, signInAsAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Authenticating Administrator Access...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, render dedicated Admin Portal Login Page (Independent Layout)
  if (!user) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        return;
      }
      setSubmitting(true);
      const res = await signIn(email, password);
      setSubmitting(false);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Administrator Authenticated");
      }
    };

    const handleDemoAdmin = () => {
      signInAsAdmin();
      toast.success("Demo Administrator Access Granted");
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
        <div className="mx-auto w-full max-w-md pt-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-100">
              Eloria Store Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Restricted management console for store administrators.
            </p>
          </div>

          {/* Login Card */}
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-portal-email" className="text-xs font-medium text-slate-300">
                  Administrator Email
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-portal-email"
                    type="email"
                    placeholder="admin@eloriastore.co.ke"
                    className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20 rounded-full text-xs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-portal-pass" className="text-xs font-medium text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="admin-portal-pass"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20 rounded-full text-xs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-500">
                <span className="bg-slate-900 px-2">Quick Access Mode</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDemoAdmin}
              className="w-full rounded-full border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-slate-100 text-xs font-medium"
            >
              <Shield className="mr-2 h-4 w-4 text-amber-500" />
              Enter Administrator Dashboard (1-Click)
            </Button>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition font-medium"
            >
              <Store className="h-3.5 w-3.5 text-amber-500" /> Return to Customer Storefront
            </a>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-600 font-mono">
          Eloria Store Management Portal &bull; Encrypted Session Security
        </div>
      </div>
    );
  }

  // Once authenticated as Admin, render the Admin Dashboard routes
  return <Outlet />;
}
