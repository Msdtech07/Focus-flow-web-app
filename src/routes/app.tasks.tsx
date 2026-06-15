import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskDialog } from "@/components/app/TaskDialog";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: TasksPage,
});

type TaskPriority = "urgent" | "high" | "medium" | "low";

const priorityColor: Record<TaskPriority, string> = {
  urgent: "bg-destructive/15 text-destructive",
  high: "bg-warning/15 text-warning",
  medium: "bg-primary/15 text-primary",
  low: "bg-muted text-muted-foreground",
};

function TasksPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  // fetch tasks — filtered by current user
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .neq("status", "archived")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // delete task
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete task"),
  });

  // toggle task status — cycles todo → in_progress → done → todo
  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === "done" ? "todo" : "done";
      const { error } = await supabase
        .from("tasks")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          completed_at: newStatus === "done" ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to update task"),
  });

  const filtered = useMemo(() => {
    let list = tasks.filter(
      (t) =>
        (priorityFilter === "all" || t.priority === priorityFilter) &&
        (query === "" || t.title.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === "newest") {
      list = list.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    if (sort === "deadline") {
      list = list.slice().sort((a, b) =>
        (a.deadline ?? a.due_date ?? "9999").localeCompare(b.deadline ?? b.due_date ?? "9999")
      );
    }
    if (sort === "priority") {
      const w: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      list = list.slice().sort((a, b) => (w[a.priority] ?? 2) - (w[b.priority] ?? 2));
    }
    if (sort === "score") {
      list = list.slice().sort((a, b) => (b.priority_score ?? 0) - (a.priority_score ?? 0));
    }
    return list;
  }, [tasks, query, priorityFilter, sort]);

  const byStatus = (s: string) => filtered.filter((t) => t.status === s);

  const handleTaskCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">All your active work.</p>
        </div>
        <Button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="bg-gradient-brand text-primary-foreground hover:opacity-95"
        >
          <Plus className="mr-2 h-4 w-4" /> New task
        </Button>
      </div>

      {/* Filters */}
      <Card className="flex flex-col gap-3 border-border/60 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="pl-9"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="deadline">By deadline</SelectItem>
            <SelectItem value="priority">By priority</SelectItem>
            <SelectItem value="score">By AI score</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Views */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        {/* List view */}
        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <Card className="border-border/60 p-12 text-center">
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            </Card>
          ) : filtered.length === 0 ? (
            <Empty onAdd={() => { setEditing(null); setOpen(true); }} />
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onEdit={() => { setEditing(t); setOpen(true); }}
                  onDelete={() => deleteMutation.mutate(t.id)}
                  onToggle={() => toggleMutation.mutate({ id: t.id, status: t.status })}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Kanban view */}
        <TabsContent value="kanban" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {(["todo", "in_progress", "done"] as const).map((s) => (
              <Card key={s} className="border-border/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold capitalize">
                    {s.replace("_", " ")}
                  </h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {byStatus(s).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {byStatus(s).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setEditing(t); setOpen(true); }}
                      className="block w-full rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{t.title}</p>
                        <Badge
                          className={`text-[10px] ${priorityColor[t.priority as TaskPriority] ?? ""}`}
                          variant="outline"
                        >
                          {t.priority}
                        </Badge>
                      </div>
                      {(t.deadline || t.due_date) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Due {new Date(t.deadline ?? t.due_date).toLocaleDateString()}
                        </p>
                      )}
                      {t.priority_score > 0 && (
                        <p className="mt-1 text-xs text-primary">
                          AI Score: {t.priority_score}
                        </p>
                      )}
                    </button>
                  ))}
                  {byStatus(s).length === 0 && (
                    <p className="text-xs text-muted-foreground">Nothing here.</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        task={editing}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

function TaskRow({
  task,
  onEdit,
  onDelete,
  onToggle,
}: {
  task: any;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <Card className="flex items-center gap-3 border-border/60 p-3 transition-colors hover:border-primary/40">
      <Checkbox
        checked={task.status === "done"}
        onCheckedChange={onToggle}
        className="ml-1"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge
            className={`text-[10px] ${priorityColor[task.priority as TaskPriority] ?? ""}`}
            variant="outline"
          >
            {task.priority}
          </Badge>
          <span>{task.category}</span>
          {(task.deadline || task.due_date) && (
            <span>• Due {new Date(task.deadline ?? task.due_date).toLocaleDateString()}</span>
          )}
          <span>• {task.estimated_effort}m</span>
          {task.priority_score > 0 && (
            <span className="text-primary">• Score {task.priority_score}</span>
          )}
          {task.ai_reason && (
            <span className="italic">• {task.ai_reason}</span>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </Card>
  );
}

function Empty({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed border-border/60 p-12 text-center">
      <h3 className="font-semibold">No tasks yet</h3>
      <p className="text-sm text-muted-foreground">
        Add your first task and FocusFlow will rank it.
      </p>
      <Button
        onClick={onAdd}
        className="bg-gradient-brand text-primary-foreground hover:opacity-95"
      >
        <Plus className="mr-2 h-4 w-4" /> New task
      </Button>
    </Card>
  );
}