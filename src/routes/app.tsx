import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopBar } from "@/components/app/AppTopBar";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "FocusFlow — Workspace" },
      { name: "description", content: "Your daily focus dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/login" });
      }
      setChecking(false);
    });

    // listen for sign out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate({ to: "/login" });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // show nothing while checking auth — prevents flash of protected content
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopBar />
          <main className="flex-1 bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
