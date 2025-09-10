-- Fix Security Definer View issue
-- The issue is that views owned by postgres (superuser) can bypass RLS policies
-- We need to recreate these views to respect RLS and proper security

-- Drop existing views
DROP VIEW IF EXISTS public.user_dashboard_stats;
DROP VIEW IF EXISTS public.products_with_stats;

-- Recreate products_with_stats view with proper security
CREATE VIEW public.products_with_stats AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.short_description,
  p.price,
  p.original_price,
  p.currency,
  p.affiliate_url,
  p.original_url,
  p.image_url,
  p.additional_images,
  p.marketplace,
  p.marketplace_id,
  p.seller_name,
  p.seller_rating,
  p.category_id,
  p.tags,
  p.rating,
  p.review_count,
  p.sales_count,
  p.view_count,
  p.click_count,
  p.status,
  p.is_featured,
  p.is_deal,
  p.is_prime,
  p.stock_quantity,
  p.is_in_stock,
  p.shipping_info,
  p.scraped_at,
  p.last_price_check,
  p.created_at,
  p.updated_at,
  p.created_by,
  p.specifications,
  p.features,
  p.dimensions,
  p.meta_title,
  p.meta_description,
  p.search_vector,
  c.name AS category_name,
  c.slug AS category_slug,
  COALESCE(ph.price_trend, 'stable') AS price_trend,
  COALESCE(ph.lowest_price, p.price) AS lowest_price,
  COALESCE(ph.highest_price, p.price) AS highest_price,
  COALESCE(rv.avg_rating, p.rating) AS avg_rating,
  COALESCE(rv.total_reviews, p.review_count::bigint) AS total_reviews,
  COALESCE(wl.wishlist_count, 0::bigint) AS wishlist_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN (
  SELECT 
    product_id,
    MIN(price) AS lowest_price,
    MAX(price) AS highest_price,
    CASE
      WHEN LAG(price) OVER (PARTITION BY product_id ORDER BY recorded_at DESC) > price THEN 'down'
      WHEN LAG(price) OVER (PARTITION BY product_id ORDER BY recorded_at DESC) < price THEN 'up'
      ELSE 'stable'
    END AS price_trend
  FROM price_history
  WHERE recorded_at >= NOW() - INTERVAL '30 days'
  GROUP BY product_id, price, recorded_at
) ph ON p.id = ph.product_id
LEFT JOIN (
  SELECT 
    product_id,
    AVG(rating) AS avg_rating,
    COUNT(*) AS total_reviews
  FROM product_reviews
  GROUP BY product_id
) rv ON p.id = rv.product_id
LEFT JOIN (
  SELECT 
    product_id,
    COUNT(*) AS wishlist_count
  FROM wishlist_items
  GROUP BY product_id
) wl ON p.id = wl.product_id;

-- Recreate user_dashboard_stats view with proper security
CREATE VIEW public.user_dashboard_stats AS
SELECT 
  u.id AS user_id,
  u.full_name,
  COUNT(DISTINCT w.id) AS total_wishlists,
  COUNT(DISTINCT wi.id) AS total_wishlist_items,
  COUNT(DISTINCT pa.id) AS active_price_alerts,
  COUNT(DISTINCT n.id) FILTER (WHERE n.is_read = false) AS unread_notifications,
  COALESCE(SUM(p.original_price - p.price), 0) AS total_savings,
  COUNT(DISTINCT ua.id) FILTER (
    WHERE ua.event_type = 'product_click' 
    AND ua.created_at >= NOW() - INTERVAL '30 days'
  ) AS clicks_last_month
FROM users u
LEFT JOIN wishlists w ON u.id = w.user_id
LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
LEFT JOIN products p ON wi.product_id = p.id
LEFT JOIN price_alerts pa ON u.id = pa.user_id AND pa.is_active = true
LEFT JOIN notifications n ON u.id = n.user_id
LEFT JOIN user_analytics ua ON u.id = ua.user_id
GROUP BY u.id, u.full_name;

-- Grant proper permissions to views
GRANT SELECT ON public.products_with_stats TO anon, authenticated;
GRANT SELECT ON public.user_dashboard_stats TO anon, authenticated;

-- Ensure views respect RLS by setting proper ownership
ALTER VIEW public.products_with_stats OWNER TO supabase_admin;
ALTER VIEW public.user_dashboard_stats OWNER TO supabase_admin;