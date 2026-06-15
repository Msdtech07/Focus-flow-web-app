import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/app/team/analytics")({
  head: () => ({ meta: [{ title: "Team Analytics — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: TeamAnalyticsPage,
});

function TeamAnalyticsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {["Avg completion rate", "Avg focus score", "Active members"].map((l) => (
        <Card key={l} className="border-border/60 p-5">
          <p className="text-xs text-muted-foreground">{l}</p>
          <p className="mt-1 text-2xl font-bold">—</p>
          <p className="text-xs text-muted-foreground">Wire team tables to populate.</p>
        </Card>
      ))}
    </div>
  );
}
