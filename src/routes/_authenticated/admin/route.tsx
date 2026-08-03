import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminGate,
});

function AdminGate() {
  const { isAdmin, isRoleLoading } = useAuth();

  if (isRoleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-border bg-card p-10 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 font-display text-2xl">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is restricted to store administrators.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Return to store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
