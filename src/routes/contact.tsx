import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/site/PublicShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FocusFlow" },
      { name: "description", content: "Get in touch with the FocusFlow team." },
      { property: "og:title", content: "Contact FocusFlow" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

function ContactPage() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", message: "" } });
  return (
    <PublicShell>
      <section className="container mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-5xl font-bold tracking-tight">Say hi.</h1>
        <p className="mt-4 text-muted-foreground">We read every message. Replies usually land within a day.</p>
        <Card className="mt-10 border-border/60 p-6">
          <form
            onSubmit={form.handleSubmit(() => {
              toast.success("Thanks — we'll be in touch shortly.");
              form.reset();
            })}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} className="mt-1.5" />
              {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} className="mt-1.5" />
              {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} {...form.register("message")} className="mt-1.5" />
              {form.formState.errors.message && <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-brand text-primary-foreground hover:opacity-95">Send message</Button>
          </form>
        </Card>
      </section>
    </PublicShell>
  );
}
