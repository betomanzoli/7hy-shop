-- Adicionar constraint UNIQUE para marketplace_id para permitir upserts corretos
ALTER TABLE products ADD CONSTRAINT unique_marketplace_product UNIQUE (marketplace, marketplace_id);

-- Adicionar índice para melhor performance nas buscas por marketplace_id
CREATE INDEX IF NOT EXISTS idx_products_marketplace_id ON products (marketplace, marketplace_id);