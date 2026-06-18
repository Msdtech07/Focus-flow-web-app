import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FocusFlow" },
      { name: "description", content: "Free, Pro, and Team plans. Pay only for the focus you need." },
      { property: "og:title", content: "FocusFlow pricing" },
      { property: "og:description", content: "Free, Pro, and Team plans designed around real focus." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "Free",
    period: "",
    desc: "For getting started.",
    features: ["25 active tasks", "Limited AI prioritizations", "Reflection journal", "Basic streak tracking"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "Coming soon",
    period: "",
    desc: "For serious operators.",
    features: ["Unlimited tasks", "Unlimited AI prioritizations", "Productivity analytics", "Advanced insights", "Priority support"],
    cta: "Coming soon",
    disabled: true,
  },
  {
    name: "Team",
    price: "Coming soon",
    period: "",
    desc: "For small focused teams.",
    features: ["Everything in Pro", "Team workspaces", "Shared priorities", "Team analytics", "Admin controls"],
    cta: "Coming soon",
    disabled: true,
  },
];

function PricingPage() {
  return (
    <PublicShell>
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">Pricing</Badge>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Pay for focus. Not features.</h1>
          <p className="mt-4 text-muted-foreground">Cancel anytime. All plans include the AI Top 3 generator.</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={`relative p-7 ${p.featured ? "border-primary/60 shadow-brand" : "border-border/60"}`}>
              {p.featured && (
                <Badge className="absolute -top-3 right-6 bg-gradient-brand text-primary-foreground">Most popular</Badge>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild={!p.disabled}
                disabled={p.disabled}
                className={`mt-7 w-full ${p.featured ? "bg-gradient-brand text-primary-foreground" : ""}`}
                variant={p.featured ? "default" : "outline"}
              >
                {p.disabled ? <span>{p.cta}</span> : <Link to="/register">{p.cta}</Link>}
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}