-- Add ads on/off toggle and report fields on clients
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS ads_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS report jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Demands table (one client -> many demands managed by team)
CREATE TABLE IF NOT EXISTS public.client_demands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pendente',
  assignee text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'media',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_demands TO anon, authenticated;
GRANT ALL ON public.client_demands TO service_role;

ALTER TABLE public.client_demands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read demands" ON public.client_demands FOR SELECT USING (true);
CREATE POLICY "Public insert demands" ON public.client_demands FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update demands" ON public.client_demands FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete demands" ON public.client_demands FOR DELETE USING (true);

CREATE TRIGGER trg_client_demands_updated_at
BEFORE UPDATE ON public.client_demands
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_client_demands_client ON public.client_demands(client_id);