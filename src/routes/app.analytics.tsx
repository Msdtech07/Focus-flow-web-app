import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FocusFlow" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  // fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });

  // fetch streak
  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ["streak"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { current_streak: 0, longest_streak: 0 };
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? { current_streak: 0, longest_streak: 0 };
    },
  });

  // fetch analytics snapshots
  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  const isLoading = tasksLoading || streakLoading || analyticsLoading;

  // last 30 days chart data
  const data30 = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() - (29 - i) * 864e5);
      const key = d.toISOString().slice(0, 10);
      const completed = tasks.filter(
        (t) =>
          t.status === "done" && t.updated_at?.slice(0, 10) === key
      ).length;
      return {
        day: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
        key,
        Completed: completed,
      };
    });
  }, [tasks]);

  // 12 week heatmap
  const heatmap = useMemo(() => {
    return Array.from({ length: 12 * 7 }, (_, i) => {
      const d = new Date(Date.now() - (83 - i) * 864e5);
      const key = d.toISOString().slice(0, 10);
      const c = tasks.filter(
        (t) => t.status === "done" && t.updated_at?.slice(0, 10) === key
      ).length;
      return { key, c };
    });
  }, [tasks]);

  const completionRate = useMemo(() => {
    const total = tasks.length;
    return total
      ? Math.round((tasks.filter((t) => t.status === "done").length / total) * 100)
      : 0;
  }, [tasks]);

  const tasksFinished = tasks.filter((t) => t.status === "done").length;
  const currentStreak = streak?.current_streak ?? 0;

  // compute scores
  const productivityScore = Math.min(
    99,
    40 + currentStreak * 3 + Math.round(completionRate / 4)
  );
  const focusScore = Math.min(99, 50 + currentStreak * 2);

  // latest analytics snapshot if available
  const latestSnapshot = analyticsData[0];

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Trends, scores, and your focus heatmap.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Productivity score"
          value={isLoading ? "..." : `${latestSnapshot?.productivity_score ?? productivityScore}`}
        />
        <Stat
          label="Focus score"
          value={isLoading ? "..." : `${latestSnapshot?.focus_score ?? focusScore}`}
        />
        <Stat
          label="Completion rate"
          value={isLoading ? "..." : `${latestSnapshot?.completion_rate ?? completionRate}%`}
        />
        <Stat
          label="Tasks finished"
          value={isLoading ? "..." : `${latestSnapshot?.tasks_completed ?? tasksFinished}`}
        />
      </div>

      {/* 30 day chart */}
      <Card className="border-border/60 p-6">
        <h3 className="font-semibold">Completed tasks — last 30 days</h3>
        <div className="mt-4 h-72">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data30}>
                <defs>
                  <linearGradient id="ff-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="currentColor" fontSize={11} interval={4} />
                <YAxis allowDecimals={false} stroke="currentColor" fontSize={11} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Completed"
                  stroke="var(--color-primary)"
                  fill="url(#ff-area)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Streak info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 p-6">
          <h3 className="font-semibold">Streak</h3>
          <div className="mt-4 flex items-center gap-8">
            <div>
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-3xl font-bold text-primary">
                {isLoading ? "..." : `${currentStreak}d`}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Longest</p>
              <p className="text-3xl font-bold">
                {isLoading ? "..." : `${streak?.longest_streak ?? 0}d`}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="font-semibold">Task breakdown</h3>
          <div className="mt-4 flex items-center gap-8">
            <div>
              <p className="text-xs text-muted-foreground">Total tasks</p>
              <p className="text-3xl font-bold">{isLoading ? "..." : tasks.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-primary">
                {isLoading ? "..." : tasks.filter((t) => t.status === "todo" || t.status === "in_progress").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Done</p>
              <p className="text-3xl font-bold text-success">
                {isLoading ? "..." : tasksFinished}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 12 week heatmap */}
      <Card className="border-border/60 p-6">
        <h3 className="font-semibold">12-week heatmap</h3>
        <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1">
          {heatmap.map((d) => {
            const lvl = Math.min(4, d.c);
            const bg = [
              "bg-muted",
              "bg-primary/25",
              "bg-primary/50",
              "bg-primary/75",
              "bg-primary",
            ][lvl];
            return (
              <div
                key={d.key}
                title={`${d.key}: ${d.c} completed`}
                className={`h-3 w-3 rounded-sm ${bg}`}
              />
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Darker = more tasks completed that day.
        </p>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="border-border/60 p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </Card>
  );
}