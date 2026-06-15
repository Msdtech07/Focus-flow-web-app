import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — FocusFlow" },
      { name: "description", content: "Reset your FocusFlow password." },
    ],
  }),
  component: ForgotPage,
});

const schema = z.object({ email: z.string().trim().email().max(255) });

function ForgotPage() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a reset link."
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      <form
        onSubmit={form.handleSubmit(() => {
          toast.success("Check your inbox for the reset link.");
          form.reset();
        })}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} className="mt-1.5" />
          {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-gradient-brand text-primary-foreground hover:opacity-95">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
