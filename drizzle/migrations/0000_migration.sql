CREATE TABLE public.entradas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data date NOT NULL DEFAULT current_date,
  canal text NOT NULL CHECK (canal IN ('ifood','99food','biteway','dinheiro')),
  descricao text NOT NULL DEFAULT '',
  valor numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.saidas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data date NOT NULL DEFAULT current_date,
  categoria text NOT NULL CHECK (categoria IN ('despesa','salario','prolabore','compra','outros')),
  descricao text NOT NULL DEFAULT '',
  valor numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.mercadorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data date NOT NULL DEFAULT current_date,
  produto text NOT NULL,
  quantidade numeric(12,3) NOT NULL DEFAULT 0,
  unidade text NOT NULL DEFAULT 'un',
  preco_unitario numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.produtos_precificados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  familia text NOT NULL DEFAULT '',
  nome text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.ingredientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid NOT NULL REFERENCES public.produtos_precificados(id) ON DELETE CASCADE,
  nome text NOT NULL,
  quantidade_usada numeric(12,3) NOT NULL DEFAULT 0,
  unidade_usada text NOT NULL DEFAULT 'g',
  preco_compra numeric(12,2) NOT NULL DEFAULT 0,
  quantidade_compra numeric(12,3) NOT NULL DEFAULT 1,
  unidade_compra text NOT NULL DEFAULT 'kg',
  created_at timestamptz NOT NULL DEFAULT now()
);
DO $$ DECLARE t text; BEGIN
FOREACH t IN ARRAY ARRAY['entradas','saidas','mercadorias','produtos_precificados','ingredientes'] LOOP
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon, authenticated', t);
  EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  EXECUTE format('CREATE POLICY "acesso aberto" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', t);
END LOOP; END $$;