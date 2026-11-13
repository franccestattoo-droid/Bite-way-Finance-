import { Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PeriodoProvider } from "@/lib/period";
import { supabase } from "@/integrations/supabase/client";

export function FinanceLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error("Não foi possível sair. Tente novamente."); setBusy(false); return; }
    await navigate({ to: "/auth", replace: true });
  }
  return (
    <PeriodoProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
              <SidebarTrigger />
              <span className="font-display text-sm font-semibold text-muted-foreground">Bite Way Finance</span>
              <Button variant="ghost" size="sm" className="ml-auto" disabled={busy} onClick={signOut}><LogOut />Sair</Button>
            </header>
            <main className="flex-1 p-4 md:p-8"><Outlet /></main>
          </div>
        </div>
      </SidebarProvider>
    </PeriodoProvider>
  );
}