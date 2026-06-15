/**
 * Local app store (Zustand + localStorage).
 *
 * This is a DEV-ONLY fallback so the UI works end-to-end before Supabase is
 * wired up. Replace each setter with a TanStack Query mutation against your
 * Supabase tables (see /supabase/schema.sql) when you're ready.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reflection, StreakData, Task, DailyPriority, UserProfile } from "./types";

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

interface AppState {
  user: UserProfile | null;
  tasks: Task[];
  reflections: Reflection[];
  streak: StreakData;
  dailyPriority: DailyPriority | null;
  setUser: (u: UserProfile | null) => void;
  addTask: (t: Omit<Task, "id" | "created_at" | "updated_at" | "user_id" | "status"> & { status?: Task["status"] }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  addReflection: (r: Omit<Reflection, "id" | "user_id" | "created_at" | "date"> & { date?: string }) => void;
  computeTop3: () => void;
}

const priorityWeight: Record<Task["priority"], number> = {
  urgent: 100,
  high: 70,
  medium: 40,
  low: 15,
};

function scoreTask(t: Task): number {
  let s = priorityWeight[t.priority];
  if (t.deadline) {
    const hours = (new Date(t.deadline).getTime() - Date.now()) / 36e5;
    if (hours < 24) s += 60;
    else if (hours < 72) s += 30;
    else if (hours < 168) s += 10;
  }
  // shorter effort gets a small boost (quick wins)
  s += Math.max(0, 30 - t.estimated_effort / 5);
  return Math.round(s);
}

function reasonFor(t: Task): string {
  const bits: string[] = [];
  if (t.priority === "urgent" || t.priority === "high") bits.push(`${t.priority} priority`);
  if (t.deadline) {
    const h = (new Date(t.deadline).getTime() - Date.now()) / 36e5;
    if (h < 24) bits.push("due within 24h");
    else if (h < 72) bits.push("deadline approaching");
  }
  if (t.estimated_effort <= 30) bits.push("quick win");
  if (!bits.length) bits.push("steady progress on active work");
  return bits.join(" • ");
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      tasks: [],
      reflections: [],
      streak: { current_streak: 0, longest_streak: 0, last_active_date: null },
      dailyPriority: null,

      setUser: (user) => set({ user }),

      addTask: (t) =>
        set((s) => ({
          tasks: [
            {
              ...t,
              id: uid(),
              user_id: s.user?.id ?? "local",
              status: t.status ?? "todo",
              created_at: now(),
              updated_at: now(),
            },
            ...s.tasks,
          ],
        })),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch, updated_at: now() } : t)),
        })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      toggleComplete: (id) => {
        const t = get().tasks.find((x) => x.id === id);
        if (!t) return;
        const status: Task["status"] = t.status === "done" ? "todo" : "done";
        get().updateTask(id, { status });
        // streak update
        if (status === "done") {
          const s = get().streak;
          const todayStr = today();
          if (s.last_active_date !== todayStr) {
            const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
            const next = s.last_active_date === yesterday ? s.current_streak + 1 : 1;
            set({
              streak: {
                current_streak: next,
                longest_streak: Math.max(next, s.longest_streak),
                last_active_date: todayStr,
              },
            });
          }
        }
      },

      addReflection: (r) =>
        set((s) => ({
          reflections: [
            {
              ...r,
              id: uid(),
              user_id: s.user?.id ?? "local",
              date: r.date ?? today(),
              created_at: now(),
            },
            ...s.reflections,
          ],
        })),

      computeTop3: () => {
        const active = get()
          .tasks.filter((t) => t.status !== "done")
          .map((t) => ({ t, score: scoreTask(t) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        const slot = (i: number) =>
          active[i]
            ? { task_id: active[i].t.id, reason: reasonFor(active[i].t), score: active[i].score }
            : null;
        set({
          dailyPriority: {
            id: uid(),
            user_id: get().user?.id ?? "local",
            date: today(),
            priority_one: slot(0),
            priority_two: slot(1),
            priority_three: slot(2),
            generated_at: now(),
          },
        });
      },
    }),
    { name: "focusflow:state:v1" },
  ),
);
