import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { FinanceLayout } from "@/components/app/finance-layout";
import { verifyFinanceAccess } from "@/lib/auth-access";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const allowed = await verifyFinanceAccess(
      async () => { const { data, error } = await supabase.auth.getUser(); return !error && Boolean(data.user); },
      async () => { const { data, error } = await supabase.rpc("finance_access_allowed"); return !error && data === true; },
    );
    if (!allowed) throw redirect({ to: "/auth", replace: true });
  },
  component: FinanceLayout,
});