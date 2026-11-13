import { useMemo, useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useExcluir, useSalvar, type Tabela } from "@/lib/data";

export type Campo = {
  name: string; label: string; type: "text" | "number" | "date" | "select";
  options?: { value: string; label: string }[]; step?: string; required?: boolean;
};
export type Coluna<R> = { label: string; render: (r: R) => ReactNode; align?: "right" };

type Rec = { id: string } & Record<string, unknown>;

export function CrudSection<R extends Rec>({ tabela, titulo, campos, colunas, rows, rodape, novoLabel = "Novo lançamento", defaults, extra }: {
  tabela: Tabela; titulo: string; campos: Campo[]; colunas: Coluna<R>[]; rows: R[];
  rodape?: ReactNode; novoLabel?: string; defaults?: Record<string, string>; extra?: Record<string, unknown>;
}) {
  const [aberto, setAberto] = useState(false);
  const [editId, setEditId] = useState<string | undefined>();
  const [form, setForm] = useState<Record<string, string>>({});
  const [excluirId, setExcluirId] = useState<string | null>(null);
  const salvar = useSalvar(tabela);
  const excluir = useExcluir(tabela);

  const vazio = useMemo(() => {
    const v: Record<string, string> = {};
    campos.forEach((c) => (v[c.name] = c.type === "date" ? new Date().toISOString().slice(0, 10) : c.type === "select" ? c.options?.[0]?.value ?? "" : ""));
    return { ...v, ...defaults };
  }, [campos, defaults]);

  const abrirNovo = () => { setEditId(undefined); setForm(vazio); setAberto(true); };
  const abrirEditar = (r: R) => {
    const v: Record<string, string> = {};
    campos.forEach((c) => (v[c.name] = String(r[c.name] ?? "")));
    setEditId(r.id); setForm(v); setAberto(true);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: Record<string, unknown> = { ...extra };
    campos.forEach((c) => (values[c.name] = c.type === "number" ? Number(String(form[c.name] || "0").replace(",", ".")) : form[c.name]));
    salvar.mutate({ id: editId, values }, { onSuccess: () => setAberto(false) });
  };

  return (
    <Card className="overflow-hidden border-border/70 shadow-soft">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
        <h2 className="font-display text-lg font-semibold">{titulo}</h2>
        <Button onClick={abrirNovo} size="sm"><Plus className="h-4 w-4" />{novoLabel}</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {colunas.map((c) => <TableHead key={c.label} className={c.align === "right" ? "text-right" : ""}>{c.label}</TableHead>)}
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={colunas.length + 1} className="py-10 text-center text-muted-foreground">Nenhum registro neste período.</TableCell></TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                {colunas.map((c) => <TableCell key={c.label} className={c.align === "right" ? "text-right tabular-nums" : ""}>{c.render(r)}</TableCell>)}
                <TableCell className="text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => abrirEditar(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => setExcluirId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {rodape && <TableFooter>{rodape}</TableFooter>}
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Editar registro" : novoLabel}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            {campos.map((c) => (
              <div key={c.name} className="grid gap-1.5">
                <Label htmlFor={c.name}>{c.label}</Label>
                {c.type === "select" ? (
                  <Select value={form[c.name] ?? ""} onValueChange={(v) => setForm({ ...form, [c.name]: v })}>
                    <SelectTrigger id={c.name}><SelectValue /></SelectTrigger>
                    <SelectContent>{c.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <Input id={c.name} name={c.name} type={c.type} step={c.type === "number" ? c.step ?? "0.01" : undefined} min={c.type === "number" ? "0" : undefined}
                    required={c.required ?? c.type !== "text"} value={form[c.name] ?? ""} onChange={(e) => setForm({ ...form, [c.name]: e.target.value })} />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvar.isPending}>{salvar.isPending ? "Salvando..." : "Salvar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!excluirId} onOpenChange={(o) => !o && setExcluirId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => excluirId && excluir.mutate(excluirId)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
