import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/team")({
  head: () => ({ meta: [{ title: "Team — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: TeamLayout,
});

const tabs = [
  { to: "/app/team", label: "Overview" },
  { to: "/app/team/members", label: "Members" },
  { to: "/app/team/priorities", label: "Shared priorities" },
  { to: "/app/team/analytics", label: "Team analytics" },
] as const;

function TeamLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAppStore((s) => s.user);
  const isTeam = user?.plan === "team";
  const isIndex = pathname === "/app/team";

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team workspace</h1>
          <p className="text-muted-foreground">Shared priorities for small focused teams.</p>
        </div>
        {!isTeam && <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">Team plan required</Badge>}
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => {
          const active = pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`border-b-2 px-4 py-2 text-sm transition-colors ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {isIndex ? <TeamOverview /> : <Outlet />}
    </div>
  );
}

function TeamOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border/60 p-6">
        <p className="text-xs text-muted-foreground">Members</p>
        <p className="mt-1 text-2xl font-bold">1</p>
      </Card>
      <Card className="border-border/60 p-6">
        <p className="text-xs text-muted-foreground">Shared priorities</p>
        <p className="mt-1 text-2xl font-bold">0</p>
      </Card>
      <Card className="border-border/60 p-6">
        <p className="text-xs text-muted-foreground">Team completion</p>
        <p className="mt-1 text-2xl font-bold">—</p>
      </Card>
    </div>
  );
}
