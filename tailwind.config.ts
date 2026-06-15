import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(0.1693 0.0245 265.1572)",
        foreground: "oklch(0.9236 0.0163 262.7508)",
        card: "oklch(0.2010 0.0278 264.9723)",
        "card-foreground": "oklch(0.9236 0.0163 262.7508)",
        popover: "oklch(0.2010 0.0278 264.9723)",
        "popover-foreground": "oklch(0.9236 0.0163 262.7508)",
        primary: "oklch(0.9054 0.1546 194.7689)",
        "primary-foreground": "oklch(0.1693 0.0245 265.1572)",
        secondary: "oklch(0.2795 0.0368 260.0310)",
        "secondary-foreground": "oklch(0.9236 0.0163 262.7508)",
        muted: "oklch(0.2795 0.0368 260.0310)",
        "muted-foreground": "oklch(0.7107 0.0351 256.7878)",
        accent: "oklch(0.9680 0.2110 109.7692)",
        "accent-foreground": "oklch(0.1693 0.0245 265.1572)",
        destructive: "oklch(0.6137 0.2039 25.5645)",
        "destructive-foreground": "oklch(0.1693 0.0245 265.1572)",
        border: "oklch(0.2795 0.0368 260.0310)",
        input: "oklch(0.2795 0.0368 260.0310)",
        ring: "oklch(0.9054 0.1546 194.7689)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
