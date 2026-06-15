import type { ReactNode } from "react";
import { SiteHeader } from "./Header";
import { SiteFooter } from "./Footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
