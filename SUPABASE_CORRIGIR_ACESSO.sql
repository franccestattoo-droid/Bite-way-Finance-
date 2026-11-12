CREATE OR REPLACE FUNCTION public.finance_access_allowed()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
      AND lower(email) = 'bitewayexpress@gmail.com'
      AND email_confirmed_at IS NOT NULL
      AND deleted_at IS NULL
      AND (banned_until IS NULL OR banned_until < now())
  );
$$;
REVOKE ALL ON FUNCTION public.finance_access_allowed() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.finance_access_allowed() TO authenticated, service_role;

DROP POLICY IF EXISTS "acesso aberto" ON public.entradas;
DROP POLICY IF EXISTS "Conta autorizada" ON public.entradas;
DROP POLICY IF EXISTS "acesso aberto" ON public.saidas;
DROP POLICY IF EXISTS "Conta autorizada" ON public.saidas;
DROP POLICY IF EXISTS "acesso aberto" ON public.mercadorias;
DROP POLICY IF EXISTS "Conta autorizada" ON public.mercadorias;
DROP POLICY IF EXISTS "acesso aberto" ON public.produtos_precificados;
DROP POLICY IF EXISTS "Conta autorizada" ON public.produtos_precificados;
DROP POLICY IF EXISTS "acesso aberto" ON public.ingredientes;
DROP POLICY IF EXISTS "Conta autorizada" ON public.ingredientes;

REVOKE ALL ON public.entradas, public.saidas, public.mercadorias, public.produtos_precificados, public.ingredientes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entradas, public.saidas, public.mercadorias, public.produtos_precificados, public.ingredientes TO authenticated;
GRANT ALL ON public.entradas, public.saidas, public.mercadorias, public.produtos_precificados, public.ingredientes TO service_role;
ALTER TABLE public.entradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercadorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_precificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conta autorizada" ON public.entradas FOR ALL TO authenticated USING ((SELECT public.finance_access_allowed())) WITH CHECK ((SELECT public.finance_access_allowed()));
CREATE POLICY "Conta autorizada" ON public.saidas FOR ALL TO authenticated USING ((SELECT public.finance_access_allowed())) WITH CHECK ((SELECT public.finance_access_allowed()));
CREATE POLICY "Conta autorizada" ON public.mercadorias FOR ALL TO authenticated USING ((SELECT public.finance_access_allowed())) WITH CHECK ((SELECT public.finance_access_allowed()));
CREATE POLICY "Conta autorizada" ON public.produtos_precificados FOR ALL TO authenticated USING ((SELECT public.finance_access_allowed())) WITH CHECK ((SELECT public.finance_access_allowed()));
CREATE POLICY "Conta autorizada" ON public.ingredientes FOR ALL TO authenticated USING ((SELECT public.finance_access_allowed())) WITH CHECK ((SELECT public.finance_access_allowed()));
