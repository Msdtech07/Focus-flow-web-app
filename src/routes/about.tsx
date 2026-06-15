import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — FocusFlow" },
      { name: "description", content: "We build FocusFlow because the world has enough task managers. It needs a focus engine." },
      { property: "og:title", content: "About FocusFlow" },
      { property: "og:description", content: "A focus engine for people who finish things." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicShell>
      <section className="container mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-5xl font-bold tracking-tight">A focus engine, not a task manager.</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          The world has enough places to store work. FocusFlow exists for one question:
          <em> what's the next most important thing?</em>
        </p>

        <div className="mt-12 space-y-6">
          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-semibold">Our principles</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Clarity over complexity.</li>
              <li>• Three moves a day beats a fifty-item backlog.</li>
              <li>• Reflection compounds focus.</li>
              <li>• AI should reason, not replace.</li>
            </ul>
          </Card>
          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-semibold">Who we built this for</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Students, developers, freelancers, founders, knowledge workers — anyone whose work
              is a forest of choices and whose output depends on picking the right tree.
            </p>
          </Card>
        </div>
      </section>
    </PublicShell>
  );
}
