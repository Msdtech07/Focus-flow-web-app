import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, setUser } = useAppStore();
  const [name, setName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [dark, setDark] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Update profile in Supabase
      const { data: { user: authUser }, error: authError } = await supabase.auth.updateUser({
        email: email,
        data: { full_name: name },
      });

      if (authError) throw authError;

      // Update local store
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || email?.split("@")[0] || "User",
          avatar_url: authUser.user_metadata?.avatar_url,
          plan: "free",
          created_at: authUser.created_at,
        });
      }

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (err: any) {
      toast.error(err.message || "Sign out failed");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Account preferences and appearance.</p>
      </div>

      <Card className="space-y-4 border-border/60 p-6">
        <h2 className="font-semibold">Profile</h2>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <Button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-gradient-brand text-primary-foreground hover:opacity-95"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Card>

      <Card className="border-border/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Dark mode</h2>
            <p className="text-sm text-muted-foreground">Use a dark theme.</p>
          </div>
          <Switch checked={dark} onCheckedChange={setDark} />
        </div>
      </Card>

      <Card className="border-border/60 p-6">
        <h2 className="font-semibold text-destructive">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign out of your account.</p>
        <Button variant="destructive" className="mt-4" onClick={handleSignOut}>Sign out</Button>
      </Card>
    </div>
  );
}
