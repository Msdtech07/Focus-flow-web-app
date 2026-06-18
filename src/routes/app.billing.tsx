import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: BillingPage,
});

type PlanRow = {
  key: "free" | "pro" | "team";
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  disabled?: boolean;
};

const plans: PlanRow[] = [
  {
    key: "free", name: "Free", price: "Coming soon", period: "",
    features: ["25 active tasks", "Limited AI prioritizations", "Reflection journal"],
  },
  {
    key: "pro", name: "Pro", price: "Coming soon", period: "",
    features: ["Unlimited tasks", "Unlimited AI prioritizations", "Analytics", "Priority support"],
    disabled: true,
  },
  {
    key: "team", name: "Team", price: "Coming soon", period: "",
    features: ["Everything in Pro", "Team workspaces", "Shared priorities", "Admin controls"],
    disabled: true,
  },
];

function BillingPage() {
  const { user, setUser } = useAppStore();
  const change = (key: "free" | "pro" | "team") => {
    if (!user) return;
    setUser({ ...user, plan: key });
    toast.success(`Switched to ${key.toUpperCase()} plan (dev mode — wire Razorpay to enable real checkout).`);
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your plan and payment method.</p>
      </div>

      <Card className="border-border/60 p-6">
        <p className="text-sm text-muted-foreground">Current plan</p>
        <div className="mt-2 flex items-center gap-3">
          <h2 className="text-2xl font-bold capitalize">{user?.plan ?? "free"}</h2>
          <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Active</Badge>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Payments are processed by Razorpay. Wire <code>RAZORPAY_KEY_ID</code> and the webhook endpoint to enable live checkout.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.key} className={`relative p-6 ${p.featured ? "border-primary/60 shadow-brand" : "border-border/60"}`}>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <Button
              disabled={user?.plan === p.key || p.disabled}
              onClick={() => !p.disabled && change(p.key)}
              className={`mt-6 w-full ${p.featured ? "bg-gradient-brand text-primary-foreground" : ""}`}
              variant={p.featured ? "default" : "outline"}
            >
              {user?.plan === p.key ? "Current plan" : (p.disabled ? "Coming soon" : `Switch to ${p.name}`)}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 p-6">
        <h3 className="font-semibold">Invoices</h3>
        <p className="mt-1 text-sm text-muted-foreground">No invoices yet.</p>
      </Card>
    </div>
  );
}
