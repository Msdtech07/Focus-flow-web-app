import { Link } from "@tanstack/react-router";

export function Logo({ to = "/", showWordmark = true }: { to?: string; showWordmark?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2 group" aria-label="FocusFlow home">
      <LogoMark />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">
          focus<span className="bg-gradient-brand bg-clip-text text-transparent">flow</span>
        </span>
      )}
    </Link>
  );
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className="shrink-0 transition-transform group-hover:scale-105"
    >
      <defs>
        <linearGradient id="ff-grad" x1="6" y1="4" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.55 0.25 265)" />
          <stop offset="55%" stopColor="oklch(0.5 0.26 275)" />
          <stop offset="100%" stopColor="oklch(0.6 0.24 295)" />
        </linearGradient>
      </defs>
      <path
        d="M10 4h20a4 4 0 0 1 4 4v8H18v6h12v6a10 10 0 0 1-10 10H10V4z"
        fill="url(#ff-grad)"
      />
      <path
        d="M10 4h6v32h-6V4z"
        fill="white"
        fillOpacity="0.18"
      />
    </svg>
  );
}
