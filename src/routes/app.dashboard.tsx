import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/lib/types";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  // Fetch tasks from Supabase
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch daily priorities from Supabase
  const { data: dailyPriority, isLoading: priorityLoading } = useQuery({
    queryKey: ["dailyPriority"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("daily_priorities")
        .select("*")
        .eq("date", today)
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data[0] || null;
    },
  });

  // Fetch streak from Supabase
  const { data: streak = { current_streak: 0, longest_streak: 0 }, isLoading: streakLoading } = useQuery({
    queryKey: ["streak"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data[0] || { current_streak: 0, longest_streak: 0 };
    },
  });

  // Fetch reflections from Supabase
  const { data: reflections = [], isLoading: reflectionsLoading } = useQuery({
    queryKey: ["reflections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reflections")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    return {
      total,
      done,
      rate: total ? Math.round((done / total) * 100) : 0,
      active: total - done,
    };
  }, [tasks]);

  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 864e5);
      const key = d.toISOString().slice(0, 10);
      const count = tasks.filter((t) => t.status === "done" && t.updated_at.slice(0, 10) === key).length;
      return { day: d.toLocaleDateString(undefined, { weekday: "short" }), Completed: count };
    });
  }, [tasks]);

  const isLoading = tasksLoading || priorityLoading || streakLoading || reflectionsLoading;

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your focus, at a glance.</p>
        </div>
        <Button asChild className="bg-gradient-brand text-primary-foreground hover:opacity-95">
          <Link to="/app/today">Go to Today's Focus</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Active tasks" value={isLoading ? "..." : `${stats.active}`} />
        <Stat label="Completed" value={isLoading ? "..." : `${stats.done}`} />
        <Stat label="Completion rate" value={isLoading ? "..." : `${stats.rate}%`} />
        <Stat
          label="Streak"
          value={isLoading ? "..." : `${streak.current_streak}d`}
          sub={isLoading ? undefined : `Longest ${streak.longest_streak}d`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 p-6 lg:col-span-2">
          <h3 className="font-semibold">Last 7 days</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <XAxis dataKey="day" stroke="currentColor" fontSize={12} />
                <YAxis allowDecimals={false} stroke="currentColor" fontSize={12} />
                <Tooltip />
                <Bar dataKey="Completed" radius={[6, 6, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="border-border/60 p-6">
          <h3 className="font-semibold">Today's Top 3</h3>
          <ul className="mt-4 space-y-3">
            {priorityLoading ? (
              <li className="flex items-center justify-center p-3 text-sm text-muted-foreground">Loading...</li>
            ) : (
              [dailyPriority?.priority_one, dailyPriority?.priority_two, dailyPriority?.priority_three].map((p, i) => {
                const t = p ? tasks.find((x: Task) => x.id === p.task_id) : null;
                return (
                  <li key={i} className="flex items-start gap-3 rounded-md border border-border p-3">
                    <Badge variant="outline">#{i + 1}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t?.title ?? "—"}</p>
                      <p className="truncate text-xs text-muted-foreground">{p?.reason ?? "No priority yet"}</p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </Card>
      </div>

      <Card className="border-border/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recent reflections</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/reflections">View all</Link>
          </Button>
        </div>
        {reflectionsLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
        ) : reflections.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No reflections yet — try the journal tonight.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reflections.slice(0, 3).map((r) => (
              <li key={r.id} className="rounded-md border border-border p-3 text-sm">
                <p className="text-xs text-muted-foreground">{r.date}</p>
                <p className="mt-1 truncate"><strong>Went well:</strong> {r.went_well}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="border-border/60 p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
}
