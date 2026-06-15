import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/app/team/members")({
  head: () => ({ meta: [{ title: "Team Members — FocusFlow" }, { name: "robots", content: "noindex" }] }),
  component: MembersPage,
});

interface Member { id: string; email: string; role: "owner" | "admin" | "member" }

function MembersPage() {
  const user = useAppStore((s) => s.user);
  const [members, setMembers] = useState<Member[]>(
    user ? [{ id: user.id, email: user.email, role: "owner" }] : [],
  );
  const [email, setEmail] = useState("");

  return (
    <Card className="border-border/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Members</h2>
        <div className="flex gap-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" className="w-64" />
          <Button
            onClick={() => {
              if (!email) return;
              setMembers((m) => [...m, { id: crypto.randomUUID(), email, role: "member" }]);
              toast.success(`Invite sent to ${email}`);
              setEmail("");
            }}
            className="bg-gradient-brand text-primary-foreground hover:opacity-95"
          >
            <Plus className="mr-1 h-4 w-4" /> Invite
          </Button>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 rounded-md border border-border p-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-brand text-xs text-primary-foreground">{m.email[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm">{m.email}</span>
            <Badge variant="outline" className="capitalize">{m.role}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
