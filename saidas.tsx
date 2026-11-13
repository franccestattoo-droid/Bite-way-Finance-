import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/app/crud-section";
import { PageHeader, StatCard, fmtData } from "@/components/app/ui-bits";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTabela, type Row } from "@/lib/data";
import { brl, noPeriodo, soma } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";

export const CATEGORIAS = [
  { value: "despesa", label: "Despesas" },
  { value: "salario", label: "Salários" },
  { value: "prolabore", label: "Pró-labore" },
  { value: "compra", label: "Compras" },
  { value: "outros", label: "Outros gastos" },
];
const nomeCat = (v: string) => CATEGORIAS.find((c) => c.value === v)?.label ?? v;

export const Route = createFileRoute("/_authenticated/saidas")({
  head: () => ({ meta: [
    { title: "Saídas — Bite Way Finance" },
    { name: "description", content: "Despesas, salários, pró-labore, compras e outros gastos." },
    { property: "og:title", content: "Saídas — Bite Way Finance" },
    { property: "og:description", content: "Controle de todas as saídas financeiras." },
  ] }),
  component: Saidas,
});

function Saidas() {
  const { ano, mes } = usePeriodo();
  const { data = [] } = useTabela("saidas");
  const rows = data.filter((r) => noPeriodo(r.data, ano, mes));
  return (
    <>
      <PageHeader title="Saídas" subtitle="Despesas, salários, pró-labore, compras e outros gastos" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
        {CATEGORIAS.map((c) => <StatCard key={c.value} label={c.label} value={brl(soma(rows.filter((r) => r.categoria === c.value)))} />)}
        <StatCard label="Total" value={brl(soma(rows))} tone="primary" />
      </div>
      <CrudSection<Row<"saidas">>
        tabela="saidas" titulo="Lançamentos de saída" novoLabel="Nova saída" rows={rows}
        campos={[
          { name: "data", label: "Data", type: "date" },
          { name: "categoria", label: "Categoria", type: "select", options: CATEGORIAS },
          { name: "descricao", label: "Descrição", type: "text" },
          { name: "valor", label: "Valor (R$)", type: "number" },
        ]}
        colunas={[
          { label: "Data", render: (r) => fmtData(r.data) },
          { label: "Categoria", render: (r) => nomeCat(r.categoria) },
          { label: "Descrição", render: (r) => r.descricao },
          { label: "Valor", render: (r) => brl(Number(r.valor)), align: "right" },
        ]}
        rodape={<TableRow><TableCell colSpan={3} className="font-semibold">Total do período</TableCell><TableCell className="text-right font-semibold tabular-nums">{brl(soma(rows))}</TableCell><TableCell /></TableRow>}
      />
    </>
  );
}
