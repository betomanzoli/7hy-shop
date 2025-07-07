-- Habilitar RLS em todas as tabelas que precisam
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Corrigir políticas RLS para categories (acesso público para leitura)
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Public read access for categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

-- Corrigir políticas para price_history (acesso público para leitura)
DROP POLICY IF EXISTS "Anyone can view price history" ON public.price_history;
CREATE POLICY "Public read access for price history" 
ON public.price_history 
FOR SELECT 
USING (true);

-- Corrigir políticas para product_reviews (acesso público para leitura)
DROP POLICY IF EXISTS "Anyone can view product reviews" ON public.product_reviews;
CREATE POLICY "Public read access for product reviews" 
ON public.product_reviews 
FOR SELECT 
USING (true);

-- Corrigir políticas para user_analytics (apenas para admins e próprio usuário)
DROP POLICY IF EXISTS "Users can view own analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "Only admins can view analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "System can insert analytics" ON public.user_analytics;

CREATE POLICY "Users can view own analytics" 
ON public.user_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" 
ON public.user_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can view all analytics" 
ON public.user_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- Garantir que as tabelas administrativas tenham políticas corretas
DROP POLICY IF EXISTS "Only admins can manage scraping jobs" ON public.scraping_jobs;
CREATE POLICY "Only admins can manage scraping jobs" 
ON public.scraping_jobs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- Política para system_settings
DROP POLICY IF EXISTS "Anyone can view public settings" ON public.system_settings;
DROP POLICY IF EXISTS "Only admins can manage all settings" ON public.system_settings;

CREATE POLICY "Public can view public settings" 
ON public.system_settings 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Only admins can manage settings" 
ON public.system_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);