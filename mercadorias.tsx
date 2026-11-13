import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/app/crud-section";
import { PageHeader, StatCard, fmtData } from "@/components/app/ui-bits";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTabela, type Row } from "@/lib/data";
import { brl, noPeriodo, round2, totalMercadoria, UNIDADES } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";

export const Route = createFileRoute("/_authenticated/mercadorias")({
  head: () => ({ meta: [
    { title: "Mercadorias e compras — Bite Way Finance" },
    { name: "description", content: "Cadastro de produtos comprados, quantidades, preços unitários e totais." },
    { property: "og:title", content: "Mercadorias e compras — Bite Way Finance" },
    { property: "og:description", content: "Controle de mercadorias e compras." },
  ] }),
  component: Mercadorias,
});

function Mercadorias() {
  const { ano, mes } = usePeriodo();
  const { data = [] } = useTabela("mercadorias");
  const rows = data.filter((r) => noPeriodo(r.data, ano, mes));
  const total = round2(rows.reduce((s, r) => s + totalMercadoria(r), 0));
  return (
    <>
      <PageHeader title="Mercadorias e compras" subtitle="Produtos, quantidades, preços unitários e totais" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Itens no período" value={String(rows.length)} />
        <StatCard label="Total em compras" value={brl(total)} tone="primary" />
      </div>
      <CrudSection<Row<"mercadorias">>
        tabela="mercadorias" titulo="Compras registradas" novoLabel="Nova compra" rows={rows}
        defaults={{ unidade: "un" }}
        campos={[
          { name: "data", label: "Data", type: "date" },
          { name: "produto", label: "Produto", type: "text", required: true },
          { name: "quantidade", label: "Quantidade", type: "number", step: "0.001" },
          { name: "unidade", label: "Unidade", type: "select", options: UNIDADES },
          { name: "preco_unitario", label: "Preço unitário (R$)", type: "number" },
        ]}
        colunas={[
          { label: "Data", render: (r) => fmtData(r.data) },
          { label: "Produto", render: (r) => r.produto },
          { label: "Quantidade", render: (r) => `${Number(r.quantidade).toLocaleString("pt-BR")} ${r.unidade}`, align: "right" },
          { label: "Preço unit.", render: (r) => brl(Number(r.preco_unitario)), align: "right" },
          { label: "Total", render: (r) => brl(totalMercadoria(r)), align: "right" },
        ]}
        rodape={<TableRow><TableCell colSpan={4} className="font-semibold">Total do período</TableCell><TableCell className="text-right font-semibold tabular-nums">{brl(total)}</TableCell><TableCell /></TableRow>}
      />
    </>
  );
}
