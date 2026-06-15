import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — FocusFlow" },
      { name: "description", content: "Confirm your email to activate your FocusFlow account." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <AuthShell title="Check your email" subtitle="We sent you a verification link.">
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <MailCheck className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Click the link in your inbox to verify your account. The link expires in 24 hours.
        </p>
      </div>
      <Button variant="outline" className="mt-4 w-full" asChild>
        <Link to="/login">Back to log in</Link>
      </Button>
    </AuthShell>
  );
}
