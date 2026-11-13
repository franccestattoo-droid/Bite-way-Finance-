import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MESES } from "@/lib/finance";
import { usePeriodo } from "@/lib/period";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, periodo = true, anoApenas = false, children }: { title: string; subtitle?: string; periodo?: boolean; anoApenas?: boolean; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {periodo && <PeriodoPicker anoApenas={anoApenas} />}
        {children}
      </div>
    </div>
  );
}

export function PeriodoPicker({ anoApenas }: { anoApenas?: boolean }) {
  const { ano, mes, setAno, setMes } = usePeriodo();
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 8 }, (_, i) => anoAtual - 5 + i);
  return (
    <div className="flex gap-2">
      {!anoApenas && (
        <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
          <SelectTrigger className="w-36 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todos os meses</SelectItem>
            {MESES.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      <Select value={String(ano)} onValueChange={(v) => setAno(Number(v))}>
        <SelectTrigger className="w-24 bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>{anos.map((a) => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

export function StatCard({ label, value, icon, tone = "default" }: { label: string; value: string; icon?: ReactNode; tone?: "default" | "primary" | "negative" | "positive" }) {
  return (
    <Card className={cn("border-border/70 shadow-soft", tone === "primary" && "bg-gradient-primary text-primary-foreground border-transparent")}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", tone === "primary" ? "text-primary-foreground/85" : "text-muted-foreground")}>{label}</p>
          {icon && <span className={cn("rounded-md p-1.5", tone === "primary" ? "bg-primary-foreground/15" : "bg-accent text-accent-foreground")}>{icon}</span>}
        </div>
        <p className={cn("mt-3 font-display text-2xl font-bold tabular-nums", tone === "negative" && "text-destructive", tone === "positive" && "text-success")}>{value}</p>
      </CardContent>
    </Card>
  );
}

export const fmtData = (d: string) => d.split("-").reverse().join("/");
