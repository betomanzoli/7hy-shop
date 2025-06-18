
-- Primeiro, vamos remover políticas que podem já existir para evitar conflitos
DROP POLICY IF EXISTS "System can insert analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "Anyone can track clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Only admins can view clicks" ON public.affiliate_clicks;

-- Habilitar RLS nas tabelas que ainda não possuem (ignorar se já estiver habilitado)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_jobs ENABLE ROW LEVEL SECURITY;

-- Políticas para categories
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas para products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Only admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas para price_history
CREATE POLICY "Anyone can view price history" ON public.price_history
  FOR SELECT USING (true);

-- Políticas para affiliate_clicks (recriando após drop)
CREATE POLICY "Anyone can track clicks" ON public.affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view clicks" ON public.affiliate_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas para product_reviews
CREATE POLICY "Anyone can view product reviews" ON public.product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage reviews" ON public.product_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas para wishlists
CREATE POLICY "Users can manage their own wishlists" ON public.wishlists
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view public wishlists" ON public.wishlists
  FOR SELECT USING (is_public = true OR user_id = auth.uid());

-- Políticas para wishlist_items
CREATE POLICY "Users can manage items in their wishlists" ON public.wishlist_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE id = wishlist_items.wishlist_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view items in public wishlists" ON public.wishlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE id = wishlist_items.wishlist_id 
      AND (is_public = true OR user_id = auth.uid())
    )
  );

-- Políticas para price_alerts
CREATE POLICY "Users can manage their own price alerts" ON public.price_alerts
  FOR ALL USING (user_id = auth.uid());

-- Políticas para notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Políticas para product_comparisons
CREATE POLICY "Users can manage their own comparisons" ON public.product_comparisons
  FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can view public comparisons" ON public.product_comparisons
  FOR SELECT USING (is_public = true OR user_id = auth.uid() OR user_id IS NULL);

-- Políticas para order_history
CREATE POLICY "Users can view their own order history" ON public.order_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert order history" ON public.order_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas para user_analytics (recriando após drop)
CREATE POLICY "Only admins can view analytics" ON public.user_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "System can insert analytics" ON public.user_analytics
  FOR INSERT WITH CHECK (true);

-- Políticas para system_settings
CREATE POLICY "Anyone can view public settings" ON public.system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Only admins can manage all settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas para marketplace_credentials
CREATE POLICY "Only admins can manage credentials" ON public.marketplace_credentials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Políticas para scraping_jobs
CREATE POLICY "Only admins can manage scraping jobs" ON public.scraping_jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
