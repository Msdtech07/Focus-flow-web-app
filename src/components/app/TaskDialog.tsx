import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().trim().min(1, "Required").max(140),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["work", "personal", "study", "health", "other"]),
  deadline: z.string().optional(),
  estimated_effort: z.coerce.number().min(5).max(480),
});

type FormValues = z.infer<typeof schema>;

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onTaskCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task?: any | null;
  onTaskCreated?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      deadline: "",
      estimated_effort: 30,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        task
          ? {
              title: task.title,
              description: task.description ?? "",
              priority: task.priority ?? "medium",
              category: task.category ?? "work",
              deadline: task.deadline ?? "",
              estimated_effort: task.estimated_effort ?? 30,
            }
          : {
              title: "",
              description: "",
              priority: "medium",
              category: "work",
              deadline: "",
              estimated_effort: 30,
            },
      );
    }
  }, [open, task, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const taskData = {
        title: values.title,
        description: values.description || null,
        priority: values.priority,
        category: values.category,
        deadline: values.deadline || null,
        estimated_effort: values.estimated_effort,
      };

      if (task) {
        // update existing task - don't change status unless specified
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", task.id);
        if (error) throw error;
        toast.success("Task updated!");
      } else {
        // create new task - let DB use its default status
        const { error } = await supabase
          .from("tasks")
          .insert({ ...taskData, user_id: user.id });
        if (error) throw error;
        toast.success("Task created!");
      }

      onOpenChange(false);
      onTaskCreated?.(); // refresh the task list
    } catch (err: any) {
      toast.error(err.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            FocusFlow will re-rank your Top 3 after every change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              className="mt-1.5"
              autoFocus
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...form.register("description")}
              className="mt-1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(v) =>
                  form.setValue("priority", v as FormValues["priority"])
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(v) =>
                  form.setValue("category", v as FormValues["category"])
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                {...form.register("deadline")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="estimated_effort">Effort (min)</Label>
              <Input
                id="estimated_effort"
                type="number"
                min={5}
                max={480}
                {...form.register("estimated_effort")}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-brand text-primary-foreground hover:opacity-95"
            >
              {loading
                ? "Saving..."
                : task
                ? "Save changes"
                : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
