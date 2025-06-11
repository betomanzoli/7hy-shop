
-- Corrigir a função de atualização do search vector
CREATE OR REPLACE FUNCTION public.update_product_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.short_description, '')), 'C') ||
        setweight(to_tsvector('portuguese', 
            COALESCE(
                (SELECT string_agg(value::text, ' ') 
                 FROM jsonb_array_elements_text(COALESCE(NEW.tags, '[]'::jsonb))
                ), ''
            )
        ), 'D');
    RETURN NEW;
END;
$function$;

-- Agora vamos inserir os dados novamente
INSERT INTO categories (name, slug, description, icon, is_active, sort_order) VALUES
('Eletrônicos', 'eletronicos', 'Smartphones, tablets, notebooks e acessórios', 'smartphone', true, 1),
('Casa e Jardim', 'casa-jardim', 'Móveis, decoração e utensílios domésticos', 'home', true, 2),
('Moda e Beleza', 'moda-beleza', 'Roupas, calçados, cosméticos e acessórios', 'shirt', true, 3),
('Esportes e Lazer', 'esportes-lazer', 'Equipamentos esportivos e artigos de lazer', 'dumbbell', true, 4),
('Livros e Mídia', 'livros-midia', 'Livros, filmes, música e jogos', 'book', true, 5),
('Saúde e Bem-estar', 'saude-bem-estar', 'Suplementos, equipamentos de saúde e bem-estar', 'heart', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO products (
  title, description, short_description, price, original_price, currency, 
  affiliate_url, original_url, image_url, marketplace, marketplace_id,
  category_id, rating, review_count, is_featured, is_deal, status, 
  seller_name, tags, specifications
) VALUES
(
  'Smartphone Samsung Galaxy A54 5G 128GB',
  'Smartphone Samsung Galaxy A54 5G com tela Super AMOLED de 6.4", câmera tripla de 50MP + 12MP + 5MP, processador Exynos 1380, 6GB RAM e 128GB de armazenamento.',
  'Galaxy A54 5G 128GB - Tela 6.4" Super AMOLED',
  1299.99, 1599.99, 'BRL',
  'https://s.shopee.com.br/7hyckshop-galaxy-a54',
  'https://shopee.com.br/product/123456789/987654321',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  'shopee', 'SHOP123456789',
  (SELECT id FROM categories WHERE slug = 'eletronicos' LIMIT 1),
  4.5, 1230, true, true, 'active',
  'Samsung Oficial', 
  '["smartphone", "samsung", "galaxy", "5g", "android"]'::jsonb,
  '{"tela": "6.4 Super AMOLED", "memoria": "128GB", "ram": "6GB", "camera": "50MP + 12MP + 5MP", "bateria": "5000mAh"}'::jsonb
),
(
  'Apple iPhone 14 128GB',
  'iPhone 14 com chip A15 Bionic, tela Super Retina XDR de 6.1", sistema de câmera avançado e resistência à água.',
  'iPhone 14 128GB - Tela 6.1" Super Retina',
  3899.99, 4299.99, 'BRL',
  'https://amzn.to/3iPhone14-7hy01',
  'https://amazon.com.br/dp/B0BDJB8KJK',
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
  'amazon', 'B0BDJB8KJK',
  (SELECT id FROM categories WHERE slug = 'eletronicos' LIMIT 1),
  4.7, 892, true, false, 'active',
  'Apple',
  '["iphone", "apple", "smartphone", "ios"]'::jsonb,
  '{"tela": "6.1 Super Retina XDR", "memoria": "128GB", "chip": "A15 Bionic", "camera": "Dupla 12MP", "bateria": "Até 20h de vídeo"}'::jsonb
),
(
  'Fone de Ouvido Bluetooth JBL Tune 510BT',
  'Fone de ouvido on-ear wireless com som JBL Pure Bass, até 40 horas de bateria e conexão multiponto.',
  'JBL Tune 510BT - 40h de bateria',
  199.99, 249.99, 'BRL',
  'https://s.shopee.com.br/7hyckshop-jbl-tune510',
  'https://shopee.com.br/product/234567890/876543210',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
  'shopee', 'SHOP234567890',
  (SELECT id FROM categories WHERE slug = 'eletronicos' LIMIT 1),
  4.3, 567, false, true, 'active',
  'JBL Oficial',
  '["fone", "bluetooth", "jbl", "wireless"]'::jsonb,
  '{"tipo": "On-ear", "conectividade": "Bluetooth 5.0", "bateria": "40 horas", "resposta": "20Hz - 20kHz"}'::jsonb
),
(
  'Cafeteira Elétrica Philco PH41 Preto',
  'Cafeteira elétrica com capacidade para 30 cafezinhos, sistema corta-pingos e filtro permanente.',
  'Cafeteira Philco PH41 - 30 cafezinhos',
  89.99, 119.99, 'BRL',
  'https://amzn.to/3Cafeteira-7hy01',
  'https://amazon.com.br/dp/B08XYZ1234',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  'amazon', 'B08XYZ1234',
  (SELECT id FROM categories WHERE slug = 'casa-jardim' LIMIT 1),
  4.2, 334, false, false, 'active',
  'Philco',
  '["cafeteira", "eletrica", "philco", "cozinha"]'::jsonb,
  '{"capacidade": "30 cafezinhos", "potencia": "550W", "voltagem": "110V/220V", "filtro": "Permanente"}'::jsonb
),
(
  'Tênis Adidas Ultraboost 22',
  'Tênis de corrida com tecnologia Boost, cabedal Primeknit e solado Continental.',
  'Adidas Ultraboost 22 - Tecnologia Boost',
  899.99, 999.99, 'BRL',
  'https://s.shopee.com.br/7hyckshop-ultraboost22',
  'https://shopee.com.br/product/345678901/765432109',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
  'shopee', 'SHOP345678901',
  (SELECT id FROM categories WHERE slug = 'esportes-lazer' LIMIT 1),
  4.6, 445, true, false, 'active',
  'Adidas Oficial',
  '["tenis", "adidas", "corrida", "boost", "ultraboost"]'::jsonb,
  '{"tecnologia": "Boost", "cabedal": "Primeknit", "solado": "Continental", "drop": "10mm"}'::jsonb
);

-- Adicionar histórico de preços
INSERT INTO price_history (product_id, price, original_price, currency, is_promotion, recorded_at)
SELECT 
  p.id,
  p.price * (0.9 + random() * 0.2),
  p.original_price,
  p.currency,
  random() < 0.3,
  NOW() - (random() * interval '30 days')
FROM products p, generate_series(1, 5)
WHERE p.title IS NOT NULL;
