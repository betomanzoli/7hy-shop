# 7hy-Shop - Funcionalidades Inovadoras

## 📋 Visão Geral

Este repositório contém funcionalidades inovadoras desenvolvidas para o site 7hy-shop, transformando-o em uma plataforma avançada de comparação de produtos e afiliados focada em Amazon e Shopee.

## 🚀 Funcionalidades Principais

### 1. Sistema de Automação de Cadastro
- **AutoProductForm.tsx**: Componente React para cadastro automático de produtos
- **product_scraper.py**: Serviço Python para extração de dados de produtos
- Suporte a Amazon e Shopee
- Extração automática de título, preço, imagens, especificações e reviews

### 2. Sistema de Comparação Inteligente
- **ProductComparison.tsx**: Componente para comparação avançada de produtos
- Análise de custo-benefício com scores normalizados
- Comparação de especificações técnicas
- Histórico de preços e tendências

### 3. Recomendações Personalizadas
- **PersonalizedRecommendations.tsx**: Sistema de recomendações baseado em ML
- Algoritmos de collaborative filtering
- Tracking de comportamento de usuário
- Recomendações por categoria e preferências

### 4. API Backend Completa
- **flask_api.py**: API Flask com endpoints para todas as funcionalidades
- Integração com sistema de scraping
- Endpoints de busca, comparação e recomendações
- Sistema de analytics e métricas

### 5. Estrutura de Banco de Dados
- **7hy-shop-database.sql**: Schema completo para Supabase
- 15+ tabelas otimizadas com índices
- Triggers automáticos e funções auxiliares
- Políticas RLS para segurança

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Python 3.9+
- Conta no Supabase
- Redis (opcional, para cache)

### 1. Configuração do Banco de Dados
```sql
-- Execute o arquivo 7hy-shop-database.sql no seu projeto Supabase
-- Isso criará todas as tabelas, índices e funções necessárias
```

### 2. Configuração do Backend Python
```bash
# Instalar dependências
pip install flask flask-cors aiohttp beautifulsoup4 fake-useragent

# Configurar variáveis de ambiente
export SUPABASE_URL="sua_url_do_supabase"
export SUPABASE_KEY="sua_chave_do_supabase"
export SECRET_KEY="sua_chave_secreta"

# Executar API
python flask_api.py
```

### 3. Configuração do Frontend React
```bash
# No diretório do projeto 7hy-shop
npm install

# Adicionar os novos componentes aos diretórios apropriados:
# - AutoProductForm.tsx -> src/components/admin/products/
# - ProductComparison.tsx -> src/components/products/
# - PersonalizedRecommendations.tsx -> src/components/recommendations/

# Configurar variáveis de ambiente
echo "VITE_API_URL=http://localhost:5000" >> .env.local
echo "VITE_SUPABASE_URL=sua_url_do_supabase" >> .env.local
echo "VITE_SUPABASE_ANON_KEY=sua_chave_publica" >> .env.local

# Executar desenvolvimento
npm run dev
```

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

#### Backend (Python)
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_de_servico
SECRET_KEY=chave_secreta_para_flask
PORT=5000
REDIS_URL=redis://localhost:6379 (opcional)
```

#### Frontend (React)
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica
```

### Configuração do Supabase

1. **Criar projeto no Supabase**
2. **Executar script SQL**: Copie e execute o conteúdo de `7hy-shop-database.sql`
3. **Configurar Storage**: Criar bucket público para imagens de produtos
4. **Configurar RLS**: As políticas já estão incluídas no script SQL

## 📚 Como Usar

### 1. Cadastro Automático de Produtos

```tsx
import { AutoProductForm } from '@/components/admin/products/AutoProductForm';

function AdminPage() {
  const handleProductScraped = (product) => {
    console.log('Produto extraído:', product);
  };

  const handleProductSaved = (productId) => {
    console.log('Produto salvo:', productId);
  };

  return (
    <AutoProductForm
      onProductScraped={handleProductScraped}
      onProductSaved={handleProductSaved}
    />
  );
}
```

### 2. Comparação de Produtos

```tsx
import { ProductComparison } from '@/components/products/ProductComparison';

function ComparisonPage() {
  const products = [
    // Array de produtos para comparar
  ];

  return (
    <ProductComparison
      products={products}
      onAddToWishlist={(productId) => console.log('Adicionado:', productId)}
      onShare={(comparisonId) => console.log('Compartilhado:', comparisonId)}
    />
  );
}
```

### 3. Recomendações Personalizadas

```tsx
import { PersonalizedRecommendations } from '@/components/recommendations/PersonalizedRecommendations';

function HomePage() {
  return (
    <PersonalizedRecommendations
      userId="user-123"
      onProductClick={(productId) => console.log('Produto clicado:', productId)}
      onAddToWishlist={(productId) => console.log('Adicionado à wishlist:', productId)}
      maxRecommendations={20}
    />
  );
}
```

### 4. API Endpoints

#### Scraping de Produto
```javascript
const response = await fetch('/api/scrape-product', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://www.amazon.com.br/produto...'
  })
});
const productData = await response.json();
```

#### Busca de Produtos
```javascript
const response = await fetch('/api/search?q=smartphone&marketplace=amazon&page=1');
const searchResults = await response.json();
```

#### Comparação de Produtos
```javascript
const response = await fetch('/api/products/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_ids: ['prod_1', 'prod_2', 'prod_3']
  })
});
const comparison = await response.json();
```

## 🔍 Funcionalidades Avançadas

### Sistema de Cache
- Cache Redis para dados de produtos (TTL: 1 hora)
- Cache de imagens via CDN (TTL: 24 horas)
- Cache de resultados de busca (TTL: 30 minutos)

### Rate Limiting
- Scraping: máximo 1 requisição por segundo
- API pública: 100 requisições por minuto por IP
- Rotação automática de user agents

### Monitoramento
- Logs estruturados para todas as operações
- Métricas de performance em tempo real
- Alertas automáticos para falhas de scraping

### Segurança
- Validação de entrada em todos os endpoints
- Sanitização de dados extraídos
- Proteção contra ataques de injeção
- Rate limiting por IP e usuário

## 📊 Métricas e Analytics

### Métricas de Scraping
- Taxa de sucesso por marketplace
- Tempo médio de extração
- Produtos processados por hora
- Erros por categoria

### Métricas de Usuário
- Produtos visualizados
- Comparações realizadas
- Cliques em links de afiliado
- Conversões por fonte

### Dashboards
- Analytics em tempo real no admin
- Relatórios de performance
- Métricas de engajamento
- ROI por marketplace

## 🚨 Troubleshooting

### Problemas Comuns

#### Scraping Falhando
1. Verificar se o site não mudou layout
2. Confirmar rate limiting adequado
3. Verificar proxies se configurados
4. Analisar logs de erro detalhados

#### Performance Lenta
1. Verificar índices do banco de dados
2. Analisar queries lentas
3. Verificar cache Redis
4. Monitorar uso de CPU/memória

#### Dados Inconsistentes
1. Verificar triggers do banco
2. Confirmar validações de entrada
3. Analisar logs de processamento
4. Verificar integridade referencial

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Integração com Mercado Livre
- [ ] Aplicativo mobile React Native
- [ ] Sistema de cupons automático
- [ ] IA avançada para recomendações
- [ ] Marketplace próprio
- [ ] Programa de fidelidade

### Melhorias Técnicas
- [ ] Microserviços para escalabilidade
- [ ] Machine learning para categorização
- [ ] Processamento de imagens com IA
- [ ] Sistema de notificações push
- [ ] Cache distribuído
- [ ] Monitoramento avançado

## 📄 Licença

Este projeto é propriedade do 7hy-shop e contém funcionalidades desenvolvidas especificamente para esta plataforma.

## 🤝 Contribuição

Para contribuir com melhorias:
1. Faça fork do repositório
2. Crie branch para sua feature
3. Implemente testes adequados
4. Submeta pull request com descrição detalhada

## 📞 Suporte

Para dúvidas técnicas ou suporte:
- Documentação completa em `7hy-shop-analysis.md`
- Exemplos de uso nos componentes
- Logs detalhados para debugging
- Métricas de monitoramento em tempo real

