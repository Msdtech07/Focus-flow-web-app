import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — FocusFlow" },
      { name: "description", content: "Notes on focus, prioritization, and shipping work that matters." },
      { property: "og:title", content: "FocusFlow blog" },
      { property: "og:description", content: "Essays on focus, prioritization, and execution." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  { slug: "decision-fatigue", title: "Why decision fatigue is killing your output", date: "2026-06-04", excerpt: "Most productivity loss isn't time loss — it's choice loss." },
  { slug: "three-moves", title: "Three moves a day: a manifesto", date: "2026-05-22", excerpt: "Why we built FocusFlow around the number 3." },
  { slug: "reflection-ritual", title: "The two-minute reflection ritual", date: "2026-05-08", excerpt: "A small habit with a disproportionate return." },
];

function BlogPage() {
  return (
    <PublicShell>
      <section className="container mx-auto max-w-4xl px-4 py-20">
        <h1 className="text-5xl font-bold tracking-tight">Notes on focus.</h1>
        <p className="mt-4 text-muted-foreground">Short essays on prioritization, execution, and the craft of finishing.</p>
        <div className="mt-12 space-y-4">
          {posts.map((p) => (
            <Card key={p.slug} className="border-border/60 p-6 transition-colors hover:border-primary/40">
              <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</p>
              <h2 className="mt-1 text-2xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <Link to="/blog" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                Read more →
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
