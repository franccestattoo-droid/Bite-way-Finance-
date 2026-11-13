import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/app/crud-section";
import { PageHeader, StatCard, fmtData } from "@/components/app/ui-bits";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTabela, type Row } from "@/lib/data";
import { brl, noPeriodo, soma } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";

export const CANAIS = [
  { value: "ifood", label: "iFood" },
  { value: "99food", label: "99Food" },
  { value: "biteway", label: "Biteway" },
  { value: "dinheiro", label: "Dinheiro" },
];
const nomeCanal = (v: string) => CANAIS.find((c) => c.value === v)?.label ?? v;

export const Route = createFileRoute("/_authenticated/entradas")({
  head: () => ({ meta: [
    { title: "Entradas — Bite Way Finance" },
    { name: "description", content: "Registros de entradas por iFood, 99Food, Biteway e dinheiro." },
    { property: "og:title", content: "Entradas — Bite Way Finance" },
    { property: "og:description", content: "Registros de entradas por canal de venda." },
  ] }),
  component: Entradas,
});

function Entradas() {
  const { ano, mes } = usePeriodo();
  const { data = [] } = useTabela("entradas");
  const rows = data.filter((r) => noPeriodo(r.data, ano, mes));
  return (
    <>
      <PageHeader title="Entradas" subtitle="Faturamento separado por canal de venda" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {CANAIS.map((c) => <StatCard key={c.value} label={c.label} value={brl(soma(rows.filter((r) => r.canal === c.value)))} />)}
        <StatCard label="Total" value={brl(soma(rows))} tone="primary" />
      </div>
      <CrudSection<Row<"entradas">>
        tabela="entradas" titulo="Lançamentos de entrada" novoLabel="Nova entrada" rows={rows}
        campos={[
          { name: "data", label: "Data", type: "date" },
          { name: "canal", label: "Canal", type: "select", options: CANAIS },
          { name: "descricao", label: "Descrição", type: "text" },
          { name: "valor", label: "Valor (R$)", type: "number" },
        ]}
        colunas={[
          { label: "Data", render: (r) => fmtData(r.data) },
          { label: "Canal", render: (r) => nomeCanal(r.canal) },
          { label: "Descrição", render: (r) => r.descricao },
          { label: "Valor", render: (r) => brl(Number(r.valor)), align: "right" },
        ]}
        rodape={<TableRow><TableCell colSpan={3} className="font-semibold">Total do período</TableCell><TableCell className="text-right font-semibold tabular-nums">{brl(soma(rows))}</TableCell><TableCell /></TableRow>}
      />
    </>
  );
}
