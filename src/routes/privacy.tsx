import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FocusFlow" },
      { name: "description", content: "How FocusFlow collects, uses, and protects your data." },
      { property: "og:title", content: "FocusFlow privacy policy" },
      { property: "og:description", content: "Our privacy practices in plain English." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicShell>
      <article className="container mx-auto max-w-3xl px-4 py-20 prose prose-neutral dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: June 2026</p>
        <p>FocusFlow ("we", "us") respects your privacy. This document explains what we collect and how we use it.</p>
        <h2>Data we collect</h2>
        <ul>
          <li>Account data: email, name, avatar.</li>
          <li>App data: tasks, reflections, streak metrics.</li>
          <li>Usage analytics: anonymous product analytics via PostHog.</li>
        </ul>
        <h2>How we use data</h2>
        <p>To operate the service, prioritize your tasks with AI, send transactional emails, and improve the product.</p>
        <h2>Storage</h2>
        <p>Your data is stored in Supabase with row-level security. Only you can read your own data.</p>
        <h2>Contact</h2>
        <p>Questions? Email privacy@focusflow.app.</p>
      </article>
    </PublicShell>
  );
}
