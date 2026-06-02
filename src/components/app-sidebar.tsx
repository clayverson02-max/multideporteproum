import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, UserPlus, Crown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meus Clientes", url: "/clientes", icon: Users },
  { title: "Adicionar Cliente", url: "/clientes/novo", icon: UserPlus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gold-gradient shadow-gold">
            <Crown className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-gold-gradient">
                RF MULTIMARCAS
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Client Manager
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="group h-11 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-sidebar-accent transition-all"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                        {active && !collapsed && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-gold" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
