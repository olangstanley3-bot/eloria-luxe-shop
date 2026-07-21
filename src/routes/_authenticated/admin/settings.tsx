import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="font-display text-xl">Site Settings</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl">Settings panel</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update WhatsApp number, social links, location, and business info here. Full editor coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
