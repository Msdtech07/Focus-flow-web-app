import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { Menu } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild className="bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
            <Link to="/register">Start free</Link>
          </Button>
        </div>
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="flex-1 bg-gradient-brand text-primary-foreground">
                <Link to="/register">Start free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
