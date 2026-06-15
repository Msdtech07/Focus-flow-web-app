import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Flame, Trophy, CheckCircle2, Target, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { TaskDialog } from "@/components/app/TaskDialog";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/app/today")({
  head: () => ({ meta: [{ title: "Today's Focus — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: TodayPage,
});

function TodayPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reranking, setReranking] = useState(false);

  // fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // fetch profile for name
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      return data;
    },
  });

  // fetch tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "archived")
        .order("rank_position", { ascending: true, nullsFirst: false })
        .order("priority_score", { ascending: false });
      if (error) throw error;
      console.log("Tasks data from Supabase:", data);
      return data;
    },
  });

  // fetch daily priorities
  const { data: dailyPriority, isLoading: priorityLoading } = useQuery({
    queryKey: ["dailyPriority"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("daily_priorities")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();
      if (error) throw error;
      console.log("Daily Priority data from Supabase:", data);
      return data;
    },
  });

  // fetch streak
  const { data: streak = { current_streak: 0, longest_streak: 0 }, isLoading: streakLoading } = useQuery({
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

  // toggle task complete
  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === "done" ? "todo" : "done";
      const { error } = await supabase
        .from("tasks")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;

      // update streak on completion
      if (newStatus === "done" && currentUser) {
        await supabase.rpc("update_user_streak", {
          p_user_id: currentUser.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      toast.success("Task updated!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update task"),
  });

  // re-rank with AI
  const handleRerank = async () => {
    if (!currentUser) return;
    if (tasks.length === 0) {
      toast.error("Add some tasks first!");
      return;
    }
    setReranking(true);
    try {
      const res = await fetch(import.meta.env.VITE_N8N_RERANK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: currentUser.id, tasks }),
      });
      if (!res.ok) throw new Error("Re-rank failed");
      toast.success("Tasks re-ranked by AI!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dailyPriority"] });
    } catch (err: any) {
      toast.error("Re-ranking failed — check n8n is running");
    } finally {
      setReranking(false);
    }
  };

  const completedToday = tasks.filter(
    (t) =>
      t.status === "done" &&
      t.updated_at?.slice(0, 10) === new Date().toISOString().slice(0, 10),
  ).length;

  const priorities = useMemo(
    () => [
      dailyPriority?.priority_one,
      dailyPriority?.priority_two,
      dailyPriority?.priority_three,
    ],
    [dailyPriority],
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const handleTaskCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { dateStyle: "full" })}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            {greeting}, {profile?.full_name?.split(" ")[0] ?? "there"}.
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here are your three moves for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRerank}
            disabled={reranking}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {reranking ? "Re-ranking..." : "Re-rank with AI"}
          </Button>
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-brand text-primary-foreground hover:opacity-95"
          >
            <Plus className="mr-2 h-4 w-4" /> New task
          </Button>
        </div>
      </div>

      {/* Streak stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${streak.current_streak} days`}
          accent="bg-warning/15 text-warning"
          loading={streakLoading}
        />
        <StatCard
          icon={Trophy}
          label="Longest streak"
          value={`${streak.longest_streak} days`}
          accent="bg-primary/15 text-primary"
          loading={streakLoading}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed today"
          value={`${completedToday}`}
          accent="bg-success/15 text-success"
          loading={tasksLoading}
        />
      </div>

      {/* Top 3 */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Your Top 3</h2>
        </div>
        {priorityLoading ? (
          <Card className="border-border/60 p-12 text-center">
            <p className="text-sm text-muted-foreground">Loading priorities...</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((idx) => {
              const p = priorities[idx];
              const t = p ? tasks.find((x) => x.id === p.task_id) : null;
              return (
                <Card
                  key={idx}
                  className="relative overflow-hidden border-border/60 p-6 transition-all hover:shadow-soft"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
                      {idx + 1}
                    </span>
                    {p?.score && (
                      <Badge variant="secondary" className="text-[10px]">
                        Score {p.score}
                      </Badge>
                    )}
                  </div>
                  {t ? (
                    <>
                      <h3 className="font-semibold leading-snug">{t.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p?.reason}
                      </p>
                      {t.estimated_effort <= 30 && (
                        <Badge variant="outline" className="mt-2 text-[10px]">
                          ⚡ quick win
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={t.status === "done" ? "outline" : "default"}
                        className={
                          t.status === "done"
                            ? "mt-4"
                            : "mt-4 bg-gradient-brand text-primary-foreground hover:opacity-95"
                        }
                        onClick={() =>
                          toggleMutation.mutate({
                            id: t.id,
                            status: t.status,
                          })
                        }
                        disabled={toggleMutation.isPending}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t.status === "done" ? "Completed" : "Mark complete"}
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-start justify-center gap-2 py-2">
                      <p className="text-sm text-muted-foreground">
                        {tasks.length === 0
                          ? "Add tasks to get started"
                          : "Click Re-rank with AI to assign"}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpen(true)}
                      >
                        Add a task
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Empty state */}
      {tasks.length === 0 && !tasksLoading && (
        <Card className="border-border/60 p-10 text-center">
          <Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <h3 className="font-semibold">No tasks yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first task and FocusFlow will rank it.
          </p>
          <Button
            className="mt-4 bg-gradient-brand text-primary-foreground hover:opacity-95"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add first task
          </Button>
        </Card>
      )}

      {/* Reflection CTA */}
      <Card className="border-border/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">End-of-day reflection</h3>
            <p className="text-sm text-muted-foreground">
              Close the loop in two minutes.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/app/reflections">Open journal</Link>
          </Button>
        </div>
      </Card>

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
  loading?: boolean;
}) {
  return (
    <Card className="border-border/60 p-5">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{loading ? "..." : value}</p>
        </div>
      </div>
    </Card>
  );
}
