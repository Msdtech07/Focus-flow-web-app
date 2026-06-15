import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — FocusFlow" },
      { name: "description", content: "Log in to your FocusFlow account." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // Email + password login
  const onSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate({ to: "/app/today" });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Supabase will redirect automatically — no need to navigate
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            className="mt-1.5"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            className="mt-1.5"
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-brand text-primary-foreground hover:opacity-95"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
      </form>
    </AuthShell>
  );
}
