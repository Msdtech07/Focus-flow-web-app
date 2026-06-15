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

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — FocusFlow" },
      { name: "description", content: "Start your free FocusFlow account. No credit card required." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // Email + password register
  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
          },
        },
      });
      if (error) throw error;
      toast.success("Account created! Check your email to confirm.");
      navigate({ to: "/app/today" });
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Google register/login
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Supabase redirects automatically
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="25 free tasks. No credit card."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...form.register("name")} className="mt-1.5" />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
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

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <Link to="/terms" className="underline">Terms</Link> and{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
