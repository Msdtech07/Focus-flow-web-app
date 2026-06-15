export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskCategory = "work" | "personal" | "study" | "health" | "other";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  deadline?: string; // ISO
  estimated_effort: number; // minutes
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface DailyPriority {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  priority_one: { task_id: string; reason: string; score: number } | null;
  priority_two: { task_id: string; reason: string; score: number } | null;
  priority_three: { task_id: string; reason: string; score: number } | null;
  generated_at: string;
}

export interface Reflection {
  id: string;
  user_id: string;
  date: string;
  went_well: string;
  didnt_go_well: string;
  tomorrow_goals: string;
  mood: 1 | 2 | 3 | 4 | 5;
  created_at: string;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export type Plan = "free" | "pro" | "team";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  plan: Plan;
  created_at: string;
}
