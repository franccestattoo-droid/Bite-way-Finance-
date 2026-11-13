import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/app/ui-bits";
import { Card } from "@/components/ui/card";
import { useDadosFinanceiros } from "@/lib/agregados";
import { brl, MESES, soma } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";
import { CANAIS } from "./entradas";
import { CATEGORIAS } from "./saidas";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({ meta: [
    { title: "Relatórios — Bite Way Finance" },
    { name: "description", content: "Totais e resultados financeiros do período." },
    { property: "og:title", content: "Relatórios — Bite Way Finance" },
    { property: "og:description", content: "Totais e resultados financeiros." },
  ] }),
  component: Relatorios,
});

function Linha({ label, valor, forte }: { label: string; valor: number; forte?: boolean }) {
  return <div className={`flex justify-between border-b border-border/60 py-2 text-sm last:border-0 ${forte ? "font-semibold" : ""}`}><span>{label}</span><span className="tabular-nums">{brl(valor)}</span></div>;
}

function Relatorios() {
  const { ano, mes } = usePeriodo();
  const { periodo } = useDadosFinanceiros();
  const p = periodo(ano, mes);
  const margem = p.faturamento ? (p.saldo / p.faturamento) * 100 : 0;
  return (
    <>
      <PageHeader title="Relatórios" subtitle={`Período: ${mes ? MESES[mes - 1] + "/" : "Ano de "}${ano}`} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total de entradas" value={brl(p.faturamento)} />
        <StatCard label="Total de saídas" value={brl(p.despesas)} />
        <StatCard label="Total de compras" value={brl(p.compras)} />
        <StatCard label="Resultado" value={brl(p.saldo)} tone="primary" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/70 p-4 shadow-soft">
          <h2 className="mb-2 font-display text-lg font-semibold">Entradas por canal</h2>
          {CANAIS.map((c) => <Linha key={c.value} label={c.label} valor={soma(p.entradas.filter((r) => r.canal === c.value))} />)}
          <Linha label="Total" valor={p.faturamento} forte />
        </Card>
        <Card className="border-border/70 p-4 shadow-soft">
          <h2 className="mb-2 font-display text-lg font-semibold">Saídas por categoria</h2>
          {CATEGORIAS.map((c) => <Linha key={c.value} label={c.label} valor={soma(p.saidas.filter((r) => r.categoria === c.value))} />)}
          <Linha label="Total" valor={p.despesas} forte />
        </Card>
        <Card className="border-border/70 p-4 shadow-soft">
          <h2 className="mb-2 font-display text-lg font-semibold">Demonstrativo de resultado</h2>
          <Linha label="(+) Entradas" valor={p.faturamento} />
          <Linha label="(−) Saídas" valor={p.despesas} />
          <Linha label="(−) Mercadorias e compras" valor={p.compras} />
          <Linha label="(=) Resultado" valor={p.saldo} forte />
          <div className="flex justify-between py-2 text-sm"><span>Margem sobre faturamento</span><span className="font-semibold tabular-nums">{margem.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</span></div>
        </Card>
      </div>
    </>
  );
}
