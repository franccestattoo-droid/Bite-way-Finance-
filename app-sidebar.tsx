import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Package, Calculator, CalendarRange, FileBarChart } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const items = [
  { title: "Painel geral", url: "/", icon: LayoutDashboard },
  { title: "Entradas", url: "/entradas", icon: ArrowDownCircle },
  { title: "Saídas", url: "/saidas", icon: ArrowUpCircle },
  { title: "Mercadorias e compras", url: "/mercadorias", icon: Package },
  { title: "Precificação", url: "/precificacao", icon: Calculator },
  { title: "Histórico mensal", url: "/historico", icon: CalendarRange },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
] as const;

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary font-display text-lg font-bold text-sidebar-primary-foreground">B</div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-base font-bold">Bite Way</p>
              <p className="text-xs text-sidebar-foreground/70">Finance</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={path === i.url} tooltip={i.title}>
                    <Link to={i.url} onClick={() => setOpenMobile(false)}>
                      <i.icon className="h-4 w-4" />
                      <span>{i.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
