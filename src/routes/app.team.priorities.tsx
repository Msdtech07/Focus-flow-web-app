import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/team/priorities")({
  head: () => ({ meta: [{ title: "Shared Priorities — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: SharedPrioritiesPage,
});

function SharedPrioritiesPage() {
  return (
    <Card className="border-border/60 p-6">
      <h2 className="font-semibold">Shared team priorities</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The AI surfaces the three most important things your team should ship today.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="border-border/60 p-5">
            <Badge className="bg-gradient-brand text-primary-foreground">#{n}</Badge>
            <p className="mt-3 text-sm text-muted-foreground">No shared priority yet.</p>
          </Card>
        ))}
      </div>
    </Card>
  );
}
