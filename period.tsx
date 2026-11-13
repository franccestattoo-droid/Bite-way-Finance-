import { createContext, useContext, useState, type ReactNode } from "react";

type P = { ano: number; mes: number; setAno: (n: number) => void; setMes: (n: number) => void };
const Ctx = createContext<P | null>(null);

export function PeriodoProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [ano, setAno] = useState(now.getFullYear());
  const [mes, setMes] = useState(now.getMonth() + 1);
  return <Ctx.Provider value={{ ano, mes, setAno, setMes }}>{children}</Ctx.Provider>;
}
export function usePeriodo() {
  const c = useContext(Ctx);
  if (!c) throw new Error("PeriodoProvider ausente");
  return c;
}
