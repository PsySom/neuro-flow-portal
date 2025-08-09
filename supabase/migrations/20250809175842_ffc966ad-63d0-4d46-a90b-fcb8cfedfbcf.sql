-- Step 2: Content schema (practices, tests, strategies) with RLS

-- 0) Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE public.content_status AS ENUM ('draft', 'published');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
    CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
  END IF;
END
$$;

-- 1) Tables
CREATE TABLE IF NOT EXISTS public.practices (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  duration_minutes integer,
  difficulty_level public.difficulty_level NOT NULL DEFAULT 'beginner',
  instructions text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tests (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb, -- instructions, questions, keys, response formats, etc.
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.strategies (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Indexes
CREATE INDEX IF NOT EXISTS idx_practices_status ON public.practices (status);
CREATE INDEX IF NOT EXISTS idx_practices_updated_at ON public.practices (updated_at);
CREATE INDEX IF NOT EXISTS idx_practices_created_by ON public.practices (created_by);

CREATE INDEX IF NOT EXISTS idx_tests_status ON public.tests (status);
CREATE INDEX IF NOT EXISTS idx_tests_updated_at ON public.tests (updated_at);
CREATE INDEX IF NOT EXISTS idx_tests_created_by ON public.tests (created_by);

CREATE INDEX IF NOT EXISTS idx_strategies_status ON public.strategies (status);
CREATE INDEX IF NOT EXISTS idx_strategies_updated_at ON public.strategies (updated_at);
CREATE INDEX IF NOT EXISTS idx_strategies_created_by ON public.strategies (created_by);

-- 3) RLS
ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- 4) Policies
-- Practices
DROP POLICY IF EXISTS "Practices: select published or own or admin" ON public.practices;
CREATE POLICY "Practices: select published or own or admin"
ON public.practices
FOR SELECT TO authenticated
USING (
  status = 'published'::public.content_status
  OR created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Practices: admin insert" ON public.practices;
CREATE POLICY "Practices: admin insert"
ON public.practices
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') AND created_by = auth.uid()
);

DROP POLICY IF EXISTS "Practices: admin update" ON public.practices;
CREATE POLICY "Practices: admin update"
ON public.practices
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Practices: admin delete" ON public.practices;
CREATE POLICY "Practices: admin delete"
ON public.practices
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Tests
DROP POLICY IF EXISTS "Tests: select published or own or admin" ON public.tests;
CREATE POLICY "Tests: select published or own or admin"
ON public.tests
FOR SELECT TO authenticated
USING (
  status = 'published'::public.content_status
  OR created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Tests: admin insert" ON public.tests;
CREATE POLICY "Tests: admin insert"
ON public.tests
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') AND created_by = auth.uid()
);

DROP POLICY IF EXISTS "Tests: admin update" ON public.tests;
CREATE POLICY "Tests: admin update"
ON public.tests
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Tests: admin delete" ON public.tests;
CREATE POLICY "Tests: admin delete"
ON public.tests
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Strategies
DROP POLICY IF EXISTS "Strategies: select published or own or admin" ON public.strategies;
CREATE POLICY "Strategies: select published or own or admin"
ON public.strategies
FOR SELECT TO authenticated
USING (
  status = 'published'::public.content_status
  OR created_by = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Strategies: admin insert" ON public.strategies;
CREATE POLICY "Strategies: admin insert"
ON public.strategies
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') AND created_by = auth.uid()
);

DROP POLICY IF EXISTS "Strategies: admin update" ON public.strategies;
CREATE POLICY "Strategies: admin update"
ON public.strategies
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Strategies: admin delete" ON public.strategies;
CREATE POLICY "Strategies: admin delete"
ON public.strategies
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5) Triggers for updated_at
DROP TRIGGER IF EXISTS trg_update_practices_updated_at ON public.practices;
CREATE TRIGGER trg_update_practices_updated_at
BEFORE UPDATE ON public.practices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_update_tests_updated_at ON public.tests;
CREATE TRIGGER trg_update_tests_updated_at
BEFORE UPDATE ON public.tests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_update_strategies_updated_at ON public.strategies;
CREATE TRIGGER trg_update_strategies_updated_at
BEFORE UPDATE ON public.strategies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();