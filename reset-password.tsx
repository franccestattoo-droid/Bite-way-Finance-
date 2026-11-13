import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { passwordLinkType } from "@/lib/auth-access";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Definir senha — Bite Way Finance" },
    { name: "description", content: "Definição segura da senha da conta autorizada." },
    { property: "og:title", content: "Definir senha — Bite Way Finance" },
    { property: "og:description", content: "Definição segura da senha da conta autorizada." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: SetPassword,
});

function SetPassword() {
  const navigate = useNavigate();
  const [validLink, setValidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { setValidLink(passwordLinkType(window.location.hash)); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!validLink) return;
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setBusy(true);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      const { data: allowed } = await supabase.rpc("finance_access_allowed");
      if (userError || !user.user || allowed !== true) { setError("Link inválido, expirado ou conta não autorizada."); return; }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError("Não foi possível definir a senha. Use uma senha forte e tente novamente."); return; }
      await supabase.auth.signOut();
      await navigate({ to: "/auth", replace: true });
    } catch { setError("Não foi possível definir a senha. Tente novamente."); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center px-6 py-12"><div className="w-full max-w-sm">
    <h1 className="mb-3 font-display text-2xl font-bold">Bite Way Finance</h1>
    <h2 className="mb-6 text-lg font-semibold">Definir senha</h2>
    {validLink ? <form className="grid gap-5" onSubmit={submit}>
      <div className="grid gap-2"><Label htmlFor="new-password">Nova senha</Label><Input id="new-password" autoComplete="new-password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <div className="grid gap-2"><Label htmlFor="confirm-password">Confirmar senha</Label><Input id="confirm-password" autoComplete="new-password" type="password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button disabled={busy} type="submit">{busy ? "Salvando…" : "Salvar senha"}</Button>
    </form> : <p role="alert" className="text-sm text-muted-foreground">Acesse esta página pelo link de convite ou recuperação recebido por e-mail.</p>}
  </div></main>;
}