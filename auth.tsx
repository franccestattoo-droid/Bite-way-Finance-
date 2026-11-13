import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar — Bite Way Finance" },
    { name: "description", content: "Acesso privado ao Bite Way Finance." },
    { property: "og:title", content: "Entrar — Bite Way Finance" },
    { property: "og:description", content: "Acesso privado ao Bite Way Finance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) { setError("E-mail ou senha inválidos. Verifique seus dados."); return; }
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const { data: allowed, error: accessError } = await supabase.rpc("finance_access_allowed");
      if (userError || !userData.user || accessError || allowed !== true) {
        await supabase.auth.signOut();
        setError("Esta conta não está autorizada a acessar o Bite Way Finance."); return;
      }
      await navigate({ to: "/", replace: true });
    } catch { setError("Não foi possível entrar. Tente novamente."); }
    finally { setBusy(false); }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary font-display text-2xl font-bold text-primary-foreground">B</div>
          <h1 className="font-display text-2xl font-bold">Bite Way Finance</h1>
        </div>
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold"><LockKeyhole className="h-5 w-5 text-primary" />Entrar na sua conta</h2>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /></div>
          <div className="grid gap-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full"><LogIn />{busy ? "Entrando…" : "Entrar"}</Button>
        </form>
      </div>
    </main>
  );
}