import { describe, expect, it } from "vitest";
import { custoIngrediente, resumo, totalMercadoria, noPeriodo } from "./finance";

describe("finance", () => {
  it("custo de 200 g de farinha comprada a R$ 5,00 o kg = R$ 1,00", () => {
    expect(custoIngrediente({ quantidade_usada: 200, unidade_usada: "g", preco_compra: 5, quantidade_compra: 1, unidade_compra: "kg" })).toBe(1);
  });
  it("custo de 250 ml de leite comprado a R$ 6,00 o litro = R$ 1,50", () => {
    expect(custoIngrediente({ quantidade_usada: 250, unidade_usada: "ml", preco_compra: 6, quantidade_compra: 1, unidade_compra: "L" })).toBe(1.5);
  });
  it("custo de 2 ovos de uma dúzia a R$ 12,00 = R$ 2,00", () => {
    expect(custoIngrediente({ quantidade_usada: 2, unidade_usada: "un", preco_compra: 12, quantidade_compra: 12, unidade_compra: "un" })).toBe(2);
  });
  it("unidades incompatíveis não calculam", () => {
    expect(custoIngrediente({ quantidade_usada: 2, unidade_usada: "un", preco_compra: 12, quantidade_compra: 1, unidade_compra: "kg" })).toBeNull();
  });
  it("total da mercadoria = quantidade × preço unitário", () => {
    expect(totalMercadoria({ quantidade: 3, preco_unitario: 4.5 })).toBe(13.5);
  });
  it("saldo = faturamento − despesas − compras", () => {
    expect(resumo([{ valor: 1000 }, { valor: 500.5 }], [{ valor: 300 }], [{ quantidade: 2, preco_unitario: 50 }])).toEqual({ faturamento: 1500.5, despesas: 300, compras: 100, saldo: 1100.5 });
  });
  it("filtro por mês e ano", () => {
    expect(noPeriodo("2026-11-05", 2026, 11)).toBe(true);
    expect(noPeriodo("2026-10-05", 2026, 11)).toBe(false);
    expect(noPeriodo("2026-10-05", 2026, 0)).toBe(true);
  });
});
