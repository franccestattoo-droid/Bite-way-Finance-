import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui-bits";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDadosFinanceiros } from "@/lib/agregados";
import { brl, MESES } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({ meta: [
    { title: "Histórico mensal — Bite Way Finance" },
    { name: "description", content: "Entradas, saídas e resultados organizados por mês e ano." },
    { property: "og:title", content: "Histórico mensal — Bite Way Finance" },
    { property: "og:description", content: "Resultados mês a mês." },
  ] }),
  component: Historico,
});

function Historico() {
  const { ano } = usePeriodo();
  const { periodo } = useDadosFinanceiros();
  const linhas = MESES.map((m, i) => ({ mes: m, ...periodo(ano, i + 1) }));
  const t = periodo(ano, 0);
  return (
    <>
      <PageHeader title="Histórico mensal" subtitle={`Resultados de ${ano}, mês a mês`} anoApenas />
      <Card className="overflow-hidden border-border/70 shadow-soft">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Mês</TableHead><TableHead className="text-right">Entradas</TableHead><TableHead className="text-right">Saídas</TableHead>
                <TableHead className="text-right">Compras</TableHead><TableHead className="text-right">Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhas.map((l) => (
                <TableRow key={l.mes}>
                  <TableCell className="font-medium">{l.mes}/{ano}</TableCell>
                  <TableCell className="text-right tabular-nums">{brl(l.faturamento)}</TableCell>
                  <TableCell className="text-right tabular-nums">{brl(l.despesas)}</TableCell>
                  <TableCell className="text-right tabular-nums">{brl(l.compras)}</TableCell>
                  <TableCell className={cn("text-right font-semibold tabular-nums", l.saldo < 0 ? "text-destructive" : l.saldo > 0 && "text-success")}>{brl(l.saldo)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-semibold">Total {ano}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{brl(t.faturamento)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{brl(t.despesas)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{brl(t.compras)}</TableCell>
                <TableCell className={cn("text-right font-semibold tabular-nums", t.saldo < 0 && "text-destructive")}>{brl(t.saldo)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </>
  );
}
