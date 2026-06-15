import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/app/reflections")({
  head: () => ({ meta: [{ title: "Reflection Journal — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: ReflectionsPage,
});

const schema = z.object({
  went_well: z.string().trim().min(1, "Required").max(2000),
  didnt_go_well: z.string().trim().max(2000).optional().default(""),
  tomorrow_goals: z.string().trim().max(2000).optional().default(""),
  mood: z.coerce.number().min(1).max(5),
});

const moods = ["😞", "😐", "🙂", "😊", "🤩"] as const;

function ReflectionsPage() {
  const queryClient = useQueryClient();
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(4);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { went_well: "", didnt_go_well: "", tomorrow_goals: "", mood: 4 },
  });

  // Fetch reflections — filtered by current user
  const { data: reflections = [], isLoading } = useQuery({
    queryKey: ["reflections"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("reflections")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Save reflection
  const addReflectionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().slice(0, 10);

      // check if reflection already exists for today
      const { data: existing } = await supabase
        .from("reflections")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (existing) {
        // update existing
        const { error } = await supabase
          .from("reflections")
          .update({
            went_well: values.went_well,
            didnt_go_well: values.didnt_go_well || "",
            tomorrow_goals: values.tomorrow_goals || "",
            mood: values.mood,
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // insert new
        const { error } = await supabase.from("reflections").insert({
          user_id: user.id,
          date: today,
          went_well: values.went_well,
          didnt_go_well: values.didnt_go_well || "",
          tomorrow_goals: values.tomorrow_goals || "",
          mood: values.mood,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reflections"] });
      toast.success("Reflection saved.");
      form.reset();
      setMood(4);
    },
    onError: (err: any) => toast.error(err.message || "Failed to save reflection"),
  });

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reflection Journal</h1>
        <p className="text-muted-foreground">Close the day. Compound the focus.</p>
      </div>

      <Card className="border-border/60 p-6">
        <form
          onSubmit={form.handleSubmit((v) => {
            addReflectionMutation.mutate({ ...v, mood: mood as 1 | 2 | 3 | 4 | 5 });
          })}
          className="space-y-4"
        >
          <div>
            <Label>How was today?</Label>
            <div className="mt-2 flex gap-2">
              {moods.map((m, i) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMood((i + 1) as 1 | 2 | 3 | 4 | 5)}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border text-2xl transition-all ${
                    mood === i + 1
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="went_well">What went well?</Label>
            <Textarea
              id="went_well"
              rows={3}
              {...form.register("went_well")}
              className="mt-1.5"
            />
            {form.formState.errors.went_well && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.went_well.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="didnt_go_well">What didn't?</Label>
            <Textarea
              id="didnt_go_well"
              rows={2}
              {...form.register("didnt_go_well")}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="tomorrow_goals">Tomorrow's intent</Label>
            <Textarea
              id="tomorrow_goals"
              rows={2}
              {...form.register("tomorrow_goals")}
              className="mt-1.5"
            />
          </div>

          <Button
            type="submit"
            disabled={addReflectionMutation.isPending}
            className="bg-gradient-brand text-primary-foreground hover:opacity-95"
          >
            {addReflectionMutation.isPending ? "Saving..." : "Save reflection"}
          </Button>
        </form>
      </Card>

      {/* Past reflections */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Past reflections</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : reflections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reflections yet.</p>
        ) : (
          <div className="space-y-3">
            {reflections.map((r) => (
              <Card key={r.id} className="border-border/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.date}</p>
                  <span className="text-2xl">{moods[(r.mood ?? 3) - 1]}</span>
                </div>
                <div className="mt-2 grid gap-2 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Went well</p>
                    <p>{r.went_well || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Didn't</p>
                    <p>{r.didnt_go_well || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tomorrow</p>
                    <p>{r.tomorrow_goals || "—"}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}