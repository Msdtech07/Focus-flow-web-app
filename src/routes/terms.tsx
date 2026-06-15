import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FocusFlow" },
      { name: "description", content: "The terms that govern your use of FocusFlow." },
      { property: "og:title", content: "FocusFlow terms of service" },
      { property: "og:description", content: "Your agreement with FocusFlow." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PublicShell>
      <article className="container mx-auto max-w-3xl px-4 py-20 prose prose-neutral dark:prose-invert">
        <h1>Terms of Service</h1>
        <p>Last updated: June 2026</p>
        <p>By using FocusFlow you agree to these terms. Use the service for lawful purposes only. Don't abuse the AI endpoints.</p>
        <h2>Subscriptions</h2>
        <p>Paid plans renew monthly via Razorpay. Cancel anytime from Billing.</p>
        <h2>Liability</h2>
        <p>FocusFlow is provided "as is". We aren't responsible for missed deadlines, but we do try to help you hit them.</p>
        <h2>Contact</h2>
        <p>Questions? Email legal@focusflow.app.</p>
      </article>
    </PublicShell>
  );
}
