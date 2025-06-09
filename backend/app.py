# =====================================================
# API Flask para 7hy-Shop
# Arquivo: app.py
# =====================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import os
import logging
from datetime import datetime
from typing import Dict, List, Optional
import json

# Importar nosso scraper
from product_scraper import scrape_product_data, ProductScraper

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Criar app Flask
app = Flask(__name__)
CORS(app)  # Permitir CORS para todas as rotas

# Configurações
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SUPABASE_URL'] = os.environ.get('SUPABASE_URL', '')
app.config['SUPABASE_KEY'] = os.environ.get('SUPABASE_KEY', '')

# Simulação de banco de dados em memória (substituir por Supabase)
products_db = []
scraping_jobs = []

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de health check"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/scrape-product', methods=['POST'])
def scrape_product():
    """Endpoint para scraping de produto"""
    
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({'error': 'URL é obrigatória'}), 400
        
        url = data['url']
        
        # Validar URL
        if not url.startswith(('http://', 'https://')):
            return jsonify({'error': 'URL inválida'}), 400
        
        # Executar scraping de forma assíncrona
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            product_data = loop.run_until_complete(scrape_product_data(url))
            
            # Adicionar timestamp
            product_data['scraped_at'] = datetime.utcnow().isoformat()
            
            logger.info(f"Produto extraído com sucesso: {product_data.get('title', 'N/A')}")
            
            return jsonify(product_data)
            
        except Exception as scrape_error:
            logger.error(f"Erro no scraping: {str(scrape_error)}")
            return jsonify({
                'error': 'Erro ao extrair dados do produto',
                'details': str(scrape_error)
            }), 500
            
        finally:
            loop.close()
    
    except Exception as e:
        logger.error(f"Erro geral no endpoint scrape-product: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    """Endpoint para listar e criar produtos"""
    
    if request.method == 'GET':
        # Listar produtos com filtros
        try:
            # Parâmetros de query
            marketplace = request.args.get('marketplace')
            category = request.args.get('category')
            min_price = request.args.get('min_price', type=float)
            max_price = request.args.get('max_price', type=float)
            search = request.args.get('search', '').lower()
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 20, type=int)
            
            # Filtrar produtos
            filtered_products = products_db.copy()
            
            if marketplace:
                filtered_products = [p for p in filtered_products if p.get('marketplace') == marketplace]
            
            if category:
                filtered_products = [p for p in filtered_products if p.get('category') == category]
            
            if min_price is not None:
                filtered_products = [p for p in filtered_products if p.get('price', 0) >= min_price]
            
            if max_price is not None:
                filtered_products = [p for p in filtered_products if p.get('price', 0) <= max_price]
            
            if search:
                filtered_products = [
                    p for p in filtered_products 
                    if search in p.get('title', '').lower() or search in p.get('description', '').lower()
                ]
            
            # Paginação
            start = (page - 1) * limit
            end = start + limit
            paginated_products = filtered_products[start:end]
            
            return jsonify({
                'products': paginated_products,
                'total': len(filtered_products),
                'page': page,
                'limit': limit,
                'total_pages': (len(filtered_products) + limit - 1) // limit
            })
            
        except Exception as e:
            logger.error(f"Erro ao listar produtos: {str(e)}")
            return jsonify({'error': 'Erro ao listar produtos'}), 500
    
    elif request.method == 'POST':
        # Criar novo produto
        try:
            product_data = request.get_json()
            
            if not product_data:
                return jsonify({'error': 'Dados do produto são obrigatórios'}), 400
            
            # Validar campos obrigatórios
            required_fields = ['title', 'price', 'marketplace']
            for field in required_fields:
                if field not in product_data:
                    return jsonify({'error': f'Campo {field} é obrigatório'}), 400
            
            # Gerar ID único
            product_id = f"prod_{len(products_db) + 1}_{int(datetime.utcnow().timestamp())}"
            
            # Adicionar metadados
            product_data.update({
                'id': product_id,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat(),
                'status': 'active'
            })
            
            # Salvar no "banco de dados"
            products_db.append(product_data)
            
            logger.info(f"Produto criado: {product_id}")
            
            return jsonify(product_data), 201
            
        except Exception as e:
            logger.error(f"Erro ao criar produto: {str(e)}")
            return jsonify({'error': 'Erro ao criar produto'}), 500

@app.route('/api/products/<product_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_product(product_id):
    """Endpoint para operações em produto específico"""
    
    # Encontrar produto
    product = next((p for p in products_db if p['id'] == product_id), None)
    
    if not product:
        return jsonify({'error': 'Produto não encontrado'}), 404
    
    if request.method == 'GET':
        return jsonify(product)
    
    elif request.method == 'PUT':
        try:
            update_data = request.get_json()
            
            if not update_data:
                return jsonify({'error': 'Dados de atualização são obrigatórios'}), 400
            
            # Atualizar produto
            product.update(update_data)
            product['updated_at'] = datetime.utcnow().isoformat()
            
            logger.info(f"Produto atualizado: {product_id}")
            
            return jsonify(product)
            
        except Exception as e:
            logger.error(f"Erro ao atualizar produto: {str(e)}")
            return jsonify({'error': 'Erro ao atualizar produto'}), 500
    
    elif request.method == 'DELETE':
        try:
            products_db.remove(product)
            
            logger.info(f"Produto removido: {product_id}")
            
            return jsonify({'message': 'Produto removido com sucesso'})
            
        except Exception as e:
            logger.error(f"Erro ao remover produto: {str(e)}")
            return jsonify({'error': 'Erro ao remover produto'}), 500

@app.route('/api/products/compare', methods=['POST'])
def compare_products():
    """Endpoint para comparar produtos"""
    
    try:
        data = request.get_json()
        
        if not data or 'product_ids' not in data:
            return jsonify({'error': 'IDs dos produtos são obrigatórios'}), 400
        
        product_ids = data['product_ids']
        
        if len(product_ids) < 2:
            return jsonify({'error': 'Pelo menos 2 produtos são necessários para comparação'}), 400
        
        # Buscar produtos
        comparison_products = []
        for product_id in product_ids:
            product = next((p for p in products_db if p['id'] == product_id), None)
            if product:
                comparison_products.append(product)
        
        if len(comparison_products) < 2:
            return jsonify({'error': 'Produtos não encontrados'}), 404
        
        # Calcular métricas de comparação
        prices = [p['price'] for p in comparison_products]
        ratings = [p.get('rating', 0) for p in comparison_products]
        
        comparison_data = {
            'products': comparison_products,
            'metrics': {
                'lowest_price': min(prices),
                'highest_price': max(prices),
                'average_price': sum(prices) / len(prices),
                'best_rating': max(ratings) if ratings else 0,
                'price_difference': max(prices) - min(prices) if prices else 0
            },
            'recommendations': {
                'best_value': min(comparison_products, key=lambda x: x['price'])['id'],
                'best_rated': max(comparison_products, key=lambda x: x.get('rating', 0))['id'] if ratings else None
            }
        }
        
        return jsonify(comparison_data)
        
    except Exception as e:
        logger.error(f"Erro na comparação de produtos: {str(e)}")
        return jsonify({'error': 'Erro na comparação de produtos'}), 500

@app.route('/api/search', methods=['GET'])
def search_products():
    """Endpoint de busca avançada"""
    
    try:
        query = request.args.get('q', '').lower()
        marketplace = request.args.get('marketplace')
        category = request.args.get('category')
        sort_by = request.args.get('sort', 'relevance')
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        if not query:
            return jsonify({'error': 'Query de busca é obrigatória'}), 400
        
        # Buscar produtos
        results = []
        for product in products_db:
            score = 0
            
            # Calcular relevância
            title = product.get('title', '').lower()
            description = product.get('description', '').lower()
            
            if query in title:
                score += 10
            if query in description:
                score += 5
            
            # Aplicar filtros
            if marketplace and product.get('marketplace') != marketplace:
                continue
            
            if category and product.get('category') != category:
                continue
            
            if score > 0:
                product_copy = product.copy()
                product_copy['relevance_score'] = score
                results.append(product_copy)
        
        # Ordenar resultados
        if sort_by == 'relevance':
            results.sort(key=lambda x: x['relevance_score'], reverse=True)
        elif sort_by == 'price_asc':
            results.sort(key=lambda x: x.get('price', 0))
        elif sort_by == 'price_desc':
            results.sort(key=lambda x: x.get('price', 0), reverse=True)
        elif sort_by == 'rating':
            results.sort(key=lambda x: x.get('rating', 0), reverse=True)
        
        # Paginação
        start = (page - 1) * limit
        end = start + limit
        paginated_results = results[start:end]
        
        return jsonify({
            'results': paginated_results,
            'total': len(results),
            'page': page,
            'limit': limit,
            'query': query
        })
        
    except Exception as e:
        logger.error(f"Erro na busca: {str(e)}")
        return jsonify({'error': 'Erro na busca'}), 500

@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Endpoint para recomendações personalizadas"""
    
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Simulação de recomendações baseadas em popularidade
        # Em produção, usar algoritmos de ML mais sofisticados
        
        recommendations = []
        for product in products_db:
            if product.get('status') == 'active':
                # Calcular score de recomendação
                score = 0
                score += product.get('rating', 0) * 20
                score += min(product.get('review_count', 0) / 100, 10)
                score += 10 if product.get('is_featured') else 0
                
                product_copy = product.copy()
                product_copy['recommendation_score'] = score
                recommendations.append(product_copy)
        
        # Ordenar por score e limitar
        recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)
        recommendations = recommendations[:limit]
        
        return jsonify({
            'recommendations': recommendations,
            'user_id': user_id,
            'generated_at': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Erro ao gerar recomendações: {str(e)}")
        return jsonify({'error': 'Erro ao gerar recomendações'}), 500

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard_analytics():
    """Endpoint para analytics do dashboard"""
    
    try:
        # Calcular estatísticas
        total_products = len(products_db)
        active_products = len([p for p in products_db if p.get('status') == 'active'])
        
        marketplaces = {}
        categories = {}
        price_ranges = {'0-50': 0, '50-100': 0, '100-500': 0, '500+': 0}
        
        for product in products_db:
            # Contagem por marketplace
            marketplace = product.get('marketplace', 'unknown')
            marketplaces[marketplace] = marketplaces.get(marketplace, 0) + 1
            
            # Contagem por categoria
            category = product.get('category', 'uncategorized')
            categories[category] = categories.get(category, 0) + 1
            
            # Contagem por faixa de preço
            price = product.get('price', 0)
            if price < 50:
                price_ranges['0-50'] += 1
            elif price < 100:
                price_ranges['50-100'] += 1
            elif price < 500:
                price_ranges['100-500'] += 1
            else:
                price_ranges['500+'] += 1
        
        analytics_data = {
            'summary': {
                'total_products': total_products,
                'active_products': active_products,
                'inactive_products': total_products - active_products
            },
            'marketplaces': marketplaces,
            'categories': categories,
            'price_ranges': price_ranges,
            'generated_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(analytics_data)
        
    except Exception as e:
        logger.error(f"Erro ao gerar analytics: {str(e)}")
        return jsonify({'error': 'Erro ao gerar analytics'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    # Adicionar alguns produtos de exemplo
    sample_products = [
        {
            'id': 'prod_1',
            'title': 'Smartphone Samsung Galaxy A54',
            'price': 1299.99,
            'original_price': 1499.99,
            'marketplace': 'amazon',
            'category': 'electronics',
            'rating': 4.5,
            'review_count': 1250,
            'status': 'active',
            'is_featured': True,
            'created_at': datetime.utcnow().isoformat()
        },
        {
            'id': 'prod_2',
            'title': 'Fone de Ouvido Bluetooth JBL',
            'price': 199.99,
            'marketplace': 'shopee',
            'category': 'electronics',
            'rating': 4.2,
            'review_count': 890,
            'status': 'active',
            'created_at': datetime.utcnow().isoformat()
        }
    ]
    
    products_db.extend(sample_products)
    
    # Executar app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

