import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Card } from "@/components/ui/card";
import { Brain, Target, Trophy, Timer, LineChart, CheckCircle2, ShieldCheck, Users, Sparkles, Zap, BookOpen, Calendar } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — FocusFlow" },
      { name: "description", content: "Every FocusFlow feature points toward one outcome: getting your highest-impact work done." },
      { property: "og:title", content: "FocusFlow features" },
      { property: "og:description", content: "AI Top 3, focus dashboard, analytics, reflection journal, streaks, and team workspaces." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  {
    title: "AI prioritization",
    items: [
      { icon: Brain, title: "Top 3 generator", body: "GPT-4o analyzes urgency, importance, effort, and deadlines." },
      { icon: Sparkles, title: "Reasoning included", body: "Every priority comes with a one-line explanation." },
      { icon: Zap, title: "Auto re-rank", body: "Re-prioritizes whenever you create or update a task." },
    ],
  },
  {
    title: "Daily execution",
    items: [
      { icon: Target, title: "Today's focus dashboard", body: "Your three moves, your streak, your score — one view." },
      { icon: Timer, title: "Focus sessions", body: "Time the work, not the planning." },
      { icon: Calendar, title: "Daily AI email", body: "Wake up to your top 3 in your inbox." },
    ],
  },
  {
    title: "Habit & reflection",
    items: [
      { icon: Trophy, title: "Streak system", body: "Track consecutive productive days and longest streaks." },
      { icon: BookOpen, title: "Reflection journal", body: "Two-minute end-of-day ritual to close the loop." },
      { icon: CheckCircle2, title: "Completion patterns", body: "Learn when and how you actually finish things." },
    ],
  },
  {
    title: "Analytics & teams",
    items: [
      { icon: LineChart, title: "Productivity analytics", body: "Weekly and monthly trends with a completion heatmap." },
      { icon: Users, title: "Team workspaces", body: "Shared priorities and team dashboards (Team plan)." },
      { icon: ShieldCheck, title: "Roles & permissions", body: "Admin, member, viewer — built in." },
    ],
  },
];

function FeaturesPage() {
  return (
    <PublicShell>
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">Everything you need.<br />Nothing you don't.</h1>
          <p className="mt-4 text-muted-foreground">FocusFlow strips productivity software down to one principle: finish what matters.</p>
        </div>

        <div className="mt-16 space-y-14">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-primary">{g.title}</h2>
              <div className="grid gap-5 md:grid-cols-3">
                {g.items.map((i) => (
                  <Card key={i.title} className="border-border/60 p-6">
                    <i.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 font-semibold">{i.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
