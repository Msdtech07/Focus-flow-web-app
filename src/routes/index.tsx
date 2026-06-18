import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
  ShieldCheck,
  LineChart,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusFlow — Stop Managing Tasks. Start Finishing What Matters." },
      {
        name: "description",
        content:
          "FocusFlow uses AI to surface the three highest-impact tasks you should tackle today. Beat decision fatigue and build a real focus habit.",
      },
      { property: "og:title", content: "FocusFlow — Know Your Next 3 Moves" },
      {
        property: "og:description",
        content: "AI-powered daily prioritization for people who finish things.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <PublicShell>
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <AiDemo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </PublicShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
      <div className="container mx-auto max-w-7xl px-4 pb-24 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered prioritization
          </Badge>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl">
            Stop managing tasks.
            <br />
            <span className="text-gradient-brand">Start finishing what matters.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            FocusFlow uses AI to identify the three highest-impact tasks you should tackle today —
            so you can stop debating, and start doing.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
              <Link to="/register">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">See how it works</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required • 25 free tasks</p>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="absolute -inset-4 -z-10 bg-gradient-brand opacity-20 blur-3xl" />
      <Card className="overflow-hidden border-border/60 p-0 shadow-brand">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/60" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
          <span className="ml-3 text-xs text-muted-foreground">focusflow.app/today</span>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-3">
          {[
            { n: 1, title: "Finish onboarding deck", reason: "due in 6h • high priority", score: 162 },
            { n: 2, title: "Review PR #482", reason: "blocks teammate • quick win", score: 118 },
            { n: 3, title: "Outline Q2 roadmap", reason: "high impact • deadline approaching", score: 94 },
          ].map((p) => (
            <div
              key={p.n}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-soft"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                  {p.n}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Score {p.score}
                </Badge>
              </div>
              <h3 className="font-semibold leading-tight">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.reason}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Problem() {
  const points = [
    "Decision paralysis from endless to-do lists",
    "Wasted mental energy choosing what to work on",
    "Important work pushed by urgent noise",
    "No clear sense of progress at end of day",
  ];
  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="container mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">The problem</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Your task manager stores your work. It doesn't help you decide.
          </h2>
        </div>
        <ul className="space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive" />
              <span className="text-sm">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Solution() {
  const steps = [
    { icon: Brain, title: "AI reads your work", body: "Urgency, deadlines, effort, and impact — analyzed in seconds." },
    { icon: Target, title: "Get your top 3", body: "Three tasks. Ranked. With reasoning. Every morning." },
    { icon: Trophy, title: "Finish & repeat", body: "Build a streak. Reflect. Compound your focus." },
  ];
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">The solution</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Three moves. Every day. That's it.</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.title} className="border-border/60 p-6 transition-all hover:shadow-soft">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "AI Top 3 Generator", body: "Daily re-ranking using GPT-4o." },
    { icon: Timer, title: "Focus dashboard", body: "Your day in one calm view." },
    { icon: LineChart, title: "Productivity analytics", body: "Weekly & monthly trends with heatmaps." },
    { icon: CheckCircle2, title: "Reflection journal", body: "Two-minute end-of-day ritual." },
    { icon: Trophy, title: "Streak system", body: "Don't break the chain." },
    { icon: ShieldCheck, title: "Team workspaces", body: "Shared priorities for small teams." },
  ];
  return (
    <section id="features" className="border-y border-border bg-muted/30 py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">Built for execution, not organization.</h2>
          <p className="mt-3 text-muted-foreground">Every feature points toward one thing: getting your highest-impact work done.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Card key={i.title} className="border-border/60 p-6">
              <i.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{i.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiDemo() {
  return (
    <section className="py-24">
      <div className="container mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How the AI thinks</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Reasoning you can actually trust.</h2>
          <p className="mt-4 text-muted-foreground">
            Every recommendation comes with a priority score and a one-line reason — urgency,
            deadline proximity, effort, and downstream impact, weighted against your history.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Urgency × importance", "Deadline proximity", "Estimated effort vs energy", "Historical completion patterns"].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <Card className="border-border/60 p-6 shadow-soft">
          <div className="rounded-md bg-muted/50 p-4 font-mono text-xs leading-relaxed">
            <span className="text-muted-foreground">// FocusFlow priority engine</span>
            <br />
            score = <span className="text-primary">priority_weight</span> +<br />
            &nbsp;&nbsp;<span className="text-primary">deadline_proximity</span> +<br />
            &nbsp;&nbsp;<span className="text-primary">effort_bonus</span> +<br />
            &nbsp;&nbsp;<span className="text-primary">historical_completion</span>
            <br />
            <br />
            <span className="text-muted-foreground">// returns top 3 with reasoning</span>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    {
      quote: "I stopped wasting the first hour of my day deciding what to do. FocusFlow just tells me.",
      name: "Priya R.",
      role: "Indie founder",
    },
    {
      quote: "The Top 3 forces ruthless prioritization. I ship more in 3 hours than I used to in a day.",
      name: "Marcus T.",
      role: "Staff engineer",
    },
    {
      quote: "It's the only productivity tool I've kept past week two. The reflection journal is gold.",
      name: "Lena S.",
      role: "PhD student",
    },
  ];
  return (
    <section className="border-y border-border bg-muted/30 py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-center text-4xl font-bold tracking-tight">Loved by people who finish things.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.map((x) => (
            <Card key={x.name} className="border-border/60 p-6">
              <p className="text-sm leading-relaxed">"{x.quote}"</p>
              <div className="mt-4 text-sm">
                <p className="font-semibold">{x.name}</p>
                <p className="text-muted-foreground">{x.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "Coming soon",
      period: "",
      features: ["25 active tasks", "Limited AI prioritizations", "Reflection journal", "Basic streak tracking"],
      cta: "Start free",
    },
    {
      name: "Pro",
      price: "Coming soon",
      period: "",
      features: ["Unlimited tasks", "Unlimited AI prioritizations", "Productivity analytics", "Priority support"],
      cta: "Coming soon",
      disabled: true,
    },
    {
      name: "Team",
      price: "Coming soon",
      period: "",
      features: ["Everything in Pro", "Team workspaces", "Shared priorities", "Team analytics", "Admin controls"],
      cta: "Coming soon",
      disabled: true,
    },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-center text-4xl font-bold tracking-tight">Simple pricing. Real focus.</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={`relative border-border/60 p-7 ${p.featured ? "border-primary/60 shadow-brand" : ""}`}
            >
              {p.featured && (
                <Badge className="absolute -top-3 right-6 bg-gradient-brand text-primary-foreground">Most popular</Badge>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
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
                className={`mt-7 w-full ${p.featured ? "bg-gradient-brand text-primary-foreground hover:opacity-95" : ""}`}
                variant={p.featured ? "default" : "outline"}
              >
                {p.disabled ? <span>{p.cta}</span> : <Link to="/register">{p.cta}</Link>}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "How does the AI choose my top 3?", a: "It combines urgency, deadline proximity, estimated effort, and historical completion patterns to rank every active task, then explains the top three." },
    { q: "Is my data private?", a: "Yes. Your tasks are stored in your own Supabase project with row-level security; only you can read them." },
    { q: "Can I cancel anytime?", a: "Yes. Subscriptions are managed via Razorpay and can be cancelled in one click from Billing." },
    { q: "Does it work on mobile?", a: "FocusFlow is fully responsive and works on every modern browser." },
  ];
  return (
    <section className="border-t border-border bg-muted/30 py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-center text-4xl font-bold tracking-tight">Questions, answered.</h2>
        <div className="mt-10 space-y-3">
          {items.map((i) => (
            <Card key={i.q} className="border-border/60 p-6">
              <h3 className="font-semibold">{i.q}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="relative overflow-hidden border-border/60 p-12 text-center shadow-brand">
          <div className="pointer-events-none absolute inset-0 bg-gradient-brand opacity-10" />
          <h2 className="relative text-4xl font-bold tracking-tight md:text-5xl">
            Know your next <span className="text-gradient-brand">3 moves.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of operators who replaced their to-do list with a focus practice.
          </p>
          <Button size="lg" asChild className="relative mt-7 bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
            <Link to="/register">
              Start free <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
