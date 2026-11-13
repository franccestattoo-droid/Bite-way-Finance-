import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowDownCircle, ArrowUpCircle, Package, Wallet } from "lucide-react";
import { PageHeader, StatCard } from "@/components/app/ui-bits";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDadosFinanceiros } from "@/lib/agregados";
import { brl, MESES, soma } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";
import { CANAIS } from "./entradas";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [
    { title: "Painel geral — Bite Way Finance" },
    { name: "description", content: "Faturamento, despesas, compras e saldo do seu negócio." },
    { property: "og:title", content: "Bite Way Finance — Painel geral" },
    { property: "og:description", content: "Dashboard financeiro com faturamento, despesas, compras e saldo." },
  ] }),
  component: Painel,
});

const chartConfig = {
  faturamento: { label: "Faturamento", color: "var(--chart-1)" },
  despesas: { label: "Despesas", color: "var(--chart-2)" },
  compras: { label: "Compras", color: "var(--chart-3)" },
};

function Painel() {
  const { ano, mes } = usePeriodo();
  const { periodo } = useDadosFinanceiros();
  const p = periodo(ano, mes);
  const serie = MESES.map((m, i) => { const r = periodo(ano, i + 1); return { mes: m.slice(0, 3), faturamento: r.faturamento, despesas: r.despesas, compras: r.compras }; });
  return (
    <>
      <PageHeader title="Painel geral" subtitle="Visão consolidada do período selecionado" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Faturamento" value={brl(p.faturamento)} icon={<ArrowDownCircle className="h-4 w-4" />} />
        <StatCard label="Despesas" value={brl(p.despesas)} icon={<ArrowUpCircle className="h-4 w-4" />} />
        <StatCard label="Compras" value={brl(p.compras)} icon={<Package className="h-4 w-4" />} />
        <StatCard label="Saldo" value={brl(p.saldo)} icon={<Wallet className="h-4 w-4" />} tone="primary" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="border-border/70 p-4 shadow-soft lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold">Evolução em {ano}</h2>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={serie}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={70} tickFormatter={(v) => brl(v).replace(",00", "")} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="faturamento" fill="var(--color-faturamento)" radius={4} />
              <Bar dataKey="despesas" fill="var(--color-despesas)" radius={4} />
              <Bar dataKey="compras" fill="var(--color-compras)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Card>
        <Card className="border-border/70 p-4 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Faturamento por canal</h2>
          <ul className="grid gap-3">
            {CANAIS.map((c) => {
              const v = soma(p.entradas.filter((r) => r.canal === c.value));
              const pct = p.faturamento ? (v / p.faturamento) * 100 : 0;
              return (
                <li key={c.value}>
                  <div className="mb-1 flex justify-between text-sm"><span>{c.label}</span><span className="font-medium tabular-nums">{brl(v)}</span></div>
                  <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
