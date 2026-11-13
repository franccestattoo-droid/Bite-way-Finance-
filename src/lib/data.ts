import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Tabela = keyof Database["public"]["Tables"];
export type Row<T extends Tabela> = Database["public"]["Tables"][T]["Row"];

export function useTabela<T extends Tabela>(tabela: T) {
  return useQuery({
    queryKey: [tabela],
    queryFn: async () => {
      const order = tabela === "produtos_precificados" || tabela === "ingredientes" ? "created_at" : "data";
      const { data, error } = await supabase.from(tabela).select("*").order(order, { ascending: false }).range(0, 9999);
      if (error) throw error;
      return data as unknown as Row<T>[];
    },
  });
}

export function useSalvar(tabela: Tabela) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Record<string, unknown> }) => {
      const q = id
        ? supabase.from(tabela).update(values as never).eq("id", id)
        : supabase.from(tabela).insert(values as never);
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: [tabela] }); toast.success(v.id ? "Registro atualizado" : "Registro cadastrado"); },
    onError: (e: Error) => toast.error("Erro ao salvar: " + e.message),
  });
}

export function useExcluir(tabela: Tabela) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tabela).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [tabela] }); if (tabela === "produtos_precificados") qc.invalidateQueries({ queryKey: ["ingredientes"] }); toast.success("Registro excluído"); },
    onError: (e: Error) => toast.error("Erro ao excluir: " + e.message),
  });
}
