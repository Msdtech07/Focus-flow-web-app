import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo, LogoMark } from "@/components/brand/Logo";
import {
  LayoutDashboard,
  ListTodo,
  Target,
  LineChart,
  BookOpen,
  CreditCard,
  Settings,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";

const main = [
  { to: "/app/today", label: "Today's Focus", icon: Target },
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/tasks", label: "Tasks", icon: ListTodo },
  { to: "/app/analytics", label: "Analytics", icon: LineChart },
  { to: "/app/reflections", label: "Reflections", icon: BookOpen },
] as const;

const teamItems = [{ to: "/app/team", label: "Team", icon: Users }] as const;

const account = [
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const user = useAppStore((s) => s.user);
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-12 items-center px-2">
          {collapsed ? <LogoMark size={24} /> : <Logo />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((i) => (
                <SidebarMenuItem key={i.to}>
                  <SidebarMenuButton asChild isActive={isActive(i.to)} tooltip={i.label}>
                    <Link to={i.to}>
                      <i.icon className="h-4 w-4" />
                      {!collapsed && <span>{i.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collaboration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teamItems.map((i) => (
                <SidebarMenuItem key={i.to}>
                  <SidebarMenuButton asChild isActive={isActive(i.to)} tooltip={i.label}>
                    <Link to={i.to}>
                      <i.icon className="h-4 w-4" />
                      {!collapsed && <span>{i.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {account.map((i) => (
                <SidebarMenuItem key={i.to}>
                  <SidebarMenuButton asChild isActive={isActive(i.to)} tooltip={i.label}>
                    <Link to={i.to}>
                      <i.icon className="h-4 w-4" />
                      {!collapsed && <span>{i.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-brand text-xs font-semibold text-primary-foreground">
              {(user?.full_name ?? "F").slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.full_name ?? "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
