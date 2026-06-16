import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page slipped off our radar. Let's get you back to focus.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-95"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FocusFlow — Know Your Next 3 Moves" },
      {
        name: "description",
        content:
          "FocusFlow uses AI to identify the three highest-impact tasks you should tackle today. Clarity over complexity.",
      },
      { name: "author", content: "FocusFlow" },
      { property: "og:title", content: "FocusFlow — Know Your Next 3 Moves" },
      {
        property: "og:description",
        content: "AI-powered daily prioritization. Stop managing tasks. Start finishing what matters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FocusFlow — Know Your Next 3 Moves" },
      {
        name: "twitter:description",
        content: "AI-powered daily prioritization for people who finish things.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // ✅ Removed debug console.logs that were leaking env vars to the browser

  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();
  const { setUser } = useAppStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get current session on mount
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "User",
            avatar_url: session.user.user_metadata?.avatar_url,
            plan: "free",
            created_at: session.user.created_at,
          });
        }
      })
      .catch((e) => console.error("Error getting session:", e));

    // Subscribe to auth state changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            full_name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "User",
            avatar_url: session.user.user_metadata?.avatar_url,
            plan: "free",
            created_at: session.user.created_at,
          });

          // Redirect away from auth pages after sign-in
          const path = window.location.pathname;
          const isAuthPage = ["/login", "/register", "/auth/callback"].includes(path);
          if (isAuthPage) {
            navigate({ to: "/app/today" });
          }
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          navigate({ to: "/login" });
        }

        if (event === "PASSWORD_RECOVERY") {
          navigate({ to: "/forgot-password" });
        }
      });
      subscription = data.subscription;
    } catch (e) {
      console.error("Error setting up auth state change listener:", e);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </QueryClientProvider>
  );
}
