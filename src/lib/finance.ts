export type Unidade = "g" | "kg" | "ml" | "L" | "un";
export const UNIDADES: { value: Unidade; label: string }[] = [
  { value: "g", label: "Gramas (g)" },
  { value: "kg", label: "Quilos (kg)" },
  { value: "ml", label: "Mililitros (ml)" },
  { value: "L", label: "Litros (L)" },
  { value: "un", label: "Unidades (un)" },
];

const BASE: Record<Unidade, { grupo: string; fator: number }> = {
  g: { grupo: "massa", fator: 1 },
  kg: { grupo: "massa", fator: 1000 },
  ml: { grupo: "volume", fator: 1 },
  L: { grupo: "volume", fator: 1000 },
  un: { grupo: "unidade", fator: 1 },
};

export function unidadesCompativeis(a: string, b: string) {
  const x = BASE[a as Unidade], y = BASE[b as Unidade];
  return !!x && !!y && x.grupo === y.grupo;
}

/** Custo do ingrediente usado, proporcional ao preço pago na compra. */
export function custoIngrediente(i: {
  quantidade_usada: number; unidade_usada: string;
  preco_compra: number; quantidade_compra: number; unidade_compra: string;
}): number | null {
  if (!unidadesCompativeis(i.unidade_usada, i.unidade_compra)) return null;
  const compraBase = Number(i.quantidade_compra) * BASE[i.unidade_compra as Unidade].fator;
  if (!compraBase) return null;
  const usadoBase = Number(i.quantidade_usada) * BASE[i.unidade_usada as Unidade].fator;
  return round2((Number(i.preco_compra) / compraBase) * usadoBase);
}

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const soma = (rows: { valor?: number | string | null }[]) =>
  round2(rows.reduce((s, r) => s + Number(r.valor ?? 0), 0));
export const totalMercadoria = (m: { quantidade: number | string; preco_unitario: number | string }) =>
  round2(Number(m.quantidade) * Number(m.preco_unitario));

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

/** month 0 = todos os meses do ano */
export function noPeriodo(data: string, ano: number, mes: number) {
  const [y, m] = data.split("-").map(Number);
  return y === ano && (mes === 0 || m === mes);
}
export const chaveMes = (data: string) => data.slice(0, 7);

export function resumo(entradas: { valor: number | string }[], saidas: { valor: number | string }[], mercadorias: { quantidade: number | string; preco_unitario: number | string }[]) {
  const faturamento = soma(entradas);
  const despesas = soma(saidas);
  const compras = round2(mercadorias.reduce((s, m) => s + totalMercadoria(m), 0));
  return { faturamento, despesas, compras, saldo: round2(faturamento - despesas - compras) };
}
