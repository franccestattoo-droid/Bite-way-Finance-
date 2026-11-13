import { useTabela } from "@/lib/data";
import { noPeriodo, resumo } from "@/lib/finance";

export function useDadosFinanceiros() {
  const e = useTabela("entradas"), s = useTabela("saidas"), m = useTabela("mercadorias");
  const entradas = e.data ?? [], saidas = s.data ?? [], mercadorias = m.data ?? [];
  const periodo = (ano: number, mes: number) => {
    const en = entradas.filter((r) => noPeriodo(r.data, ano, mes));
    const sa = saidas.filter((r) => noPeriodo(r.data, ano, mes));
    const me = mercadorias.filter((r) => noPeriodo(r.data, ano, mes));
    return { entradas: en, saidas: sa, mercadorias: me, ...resumo(en, sa, me) };
  };
  return { periodo, carregando: e.isLoading || s.isLoading || m.isLoading };
}
