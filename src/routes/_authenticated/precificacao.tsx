import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/app/crud-section";
import { PageHeader, StatCard } from "@/components/app/ui-bits";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTabela, type Row } from "@/lib/data";
import { brl, custoIngrediente, round2, UNIDADES } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/precificacao")({
  head: () => ({ meta: [
    { title: "Precificação — Bite Way Finance" },
    { name: "description", content: "Cálculo de custo dos produtos por ingredientes em gramas, quilos, litros e unidades." },
    { property: "og:title", content: "Precificação — Bite Way Finance" },
    { property: "og:description", content: "Custo final dos produtos calculado por ingredientes." },
  ] }),
  component: Precificacao,
});

const custoProduto = (ings: Row<"ingredientes">[]) => round2(ings.reduce((s, i) => s + (custoIngrediente(i) ?? 0), 0));

function Precificacao() {
  const { data: produtos = [] } = useTabela("produtos_precificados");
  const { data: ingredientes = [] } = useTabela("ingredientes");
  const [sel, setSel] = useState<string>("");
  const selecionado = produtos.find((p) => p.id === sel) ?? produtos[0];
  const ingsSel = selecionado ? ingredientes.filter((i) => i.produto_id === selecionado.id) : [];
  const ingsDe = (id: string) => ingredientes.filter((i) => i.produto_id === id);

  return (
    <>
      <PageHeader title="Precificação" subtitle="Custo dos produtos calculado a partir dos ingredientes" periodo={false} />
      <div className="grid gap-6">
        <CrudSection<Row<"produtos_precificados">>
          tabela="produtos_precificados" titulo="Produtos" novoLabel="Novo produto" rows={produtos}
          campos={[
            { name: "familia", label: "Família de origem", type: "text", required: true },
            { name: "nome", label: "Nome do produto", type: "text", required: true },
          ]}
          colunas={[
            { label: "Família de origem", render: (r) => r.familia },
            { label: "Nome do produto", render: (r) => <button className="font-medium text-primary underline-offset-4 hover:underline" onClick={() => setSel(r.id)}>{r.nome}</button> },
            { label: "Ingredientes", render: (r) => ingsDe(r.id).length, align: "right" },
            { label: "Custo final", render: (r) => <span className="font-semibold">{brl(custoProduto(ingsDe(r.id)))}</span>, align: "right" },
          ]}
        />

        {selecionado ? (
          <div className="grid gap-4">
            <Card className="flex flex-col gap-4 border-border/70 p-4 shadow-soft md:flex-row md:items-end md:justify-between">
              <div className="grid gap-1.5">
                <Label>Produto selecionado</Label>
                <Select value={selecionado.id} onValueChange={setSel}>
                  <SelectTrigger className="w-72"><SelectValue /></SelectTrigger>
                  <SelectContent>{produtos.map((p) => <SelectItem key={p.id} value={p.id}>{p.familia} · {p.nome}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="min-w-56"><StatCard label={`Custo final — ${selecionado.nome}`} value={brl(custoProduto(ingsSel))} tone="primary" /></div>
            </Card>
            <CrudSection<Row<"ingredientes">>
              key={selecionado.id}
              tabela="ingredientes" titulo={`Ingredientes de ${selecionado.nome}`} novoLabel="Novo ingrediente" rows={ingsSel}
              extra={{ produto_id: selecionado.id }}
              defaults={{ unidade_usada: "g", unidade_compra: "kg", quantidade_compra: "1" }}
              campos={[
                { name: "nome", label: "Ingrediente", type: "text", required: true },
                { name: "quantidade_usada", label: "Quantidade usada no produto", type: "number", step: "0.001" },
                { name: "unidade_usada", label: "Unidade usada", type: "select", options: UNIDADES },
                { name: "preco_compra", label: "Preço pago na compra (R$)", type: "number" },
                { name: "quantidade_compra", label: "Quantidade comprada", type: "number", step: "0.001" },
                { name: "unidade_compra", label: "Unidade da compra", type: "select", options: UNIDADES },
              ]}
              colunas={[
                { label: "Ingrediente", render: (r) => r.nome },
                { label: "Usado", render: (r) => `${Number(r.quantidade_usada).toLocaleString("pt-BR")} ${r.unidade_usada}`, align: "right" },
                { label: "Compra", render: (r) => `${brl(Number(r.preco_compra))} / ${Number(r.quantidade_compra).toLocaleString("pt-BR")} ${r.unidade_compra}`, align: "right" },
                { label: "Custo", render: (r) => { const c = custoIngrediente(r); return c === null ? <span className="text-destructive">Unidades incompatíveis</span> : brl(c); }, align: "right" },
              ]}
              rodape={<TableRow><TableCell colSpan={3} className="font-semibold">Custo final calculado</TableCell><TableCell className="text-right font-semibold tabular-nums">{brl(custoProduto(ingsSel))}</TableCell><TableCell /></TableRow>}
            />
          </div>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">Cadastre um produto para adicionar ingredientes.</Card>
        )}
      </div>
    </>
  );
}
