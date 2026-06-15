import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-brand p-10 text-primary-foreground md:flex">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
        <Link to="/" className="relative z-10 inline-flex items-center gap-2">
          <span className="text-lg font-semibold">focusflow</span>
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="text-3xl font-semibold leading-tight">
            "FocusFlow replaced my to-do list with a focus practice. I haven't gone back."
          </p>
          <p className="mt-4 text-sm opacity-80">— Priya R., indie founder</p>
        </div>
        <p className="relative z-10 text-xs opacity-60">© {new Date().getFullYear()} FocusFlow</p>
      </div>

      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border p-4 md:hidden">
          <Logo />
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
