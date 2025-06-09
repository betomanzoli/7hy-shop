# =====================================================
# Serviço de Scraping para Amazon e Shopee
# Arquivo: product_scraper.py
# =====================================================

import asyncio
import aiohttp
import json
import re
import time
from typing import Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ProductData:
    """Estrutura de dados do produto extraído"""
    title: str
    price: float
    original_price: Optional[float] = None
    description: str = ""
    image_url: str = ""
    additional_images: List[str] = None
    marketplace: str = ""
    marketplace_id: str = ""
    rating: Optional[float] = None
    review_count: int = 0
    is_in_stock: bool = True
    specifications: Dict[str, str] = None
    features: List[str] = None
    seller_name: str = ""
    seller_rating: Optional[float] = None
    category: str = ""
    shipping_info: Dict[str, Union[str, int, float]] = None

    def __post_init__(self):
        if self.additional_images is None:
            self.additional_images = []
        if self.specifications is None:
            self.specifications = {}
        if self.features is None:
            self.features = []
        if self.shipping_info is None:
            self.shipping_info = {}

class ProductScraper:
    """Classe principal para scraping de produtos"""
    
    def __init__(self):
        self.ua = UserAgent()
        self.session = None
        self.proxies = []  # Lista de proxies para rotação
        
    async def __aenter__(self):
        """Context manager para sessão async"""
        connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            headers={'User-Agent': self.ua.random}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Fechar sessão"""
        if self.session:
            await self.session.close()
    
    def detect_marketplace(self, url: str) -> Optional[str]:
        """Detecta o marketplace pela URL"""
        domain = urlparse(url).netloc.lower()
        
        if 'amazon.com' in domain or 'amazon.com.br' in domain:
            return 'amazon'
        elif 'shopee.com' in domain or 'shopee.com.br' in domain:
            return 'shopee'
        
        return None
    
    def extract_amazon_asin(self, url: str) -> Optional[str]:
        """Extrai ASIN da URL da Amazon"""
        # Padrões comuns de ASIN na Amazon
        patterns = [
            r'/([A-Z0-9]{10})(?:[/?]|$)',
            r'/dp/([A-Z0-9]{10})',
            r'/product/([A-Z0-9]{10})',
            r'asin=([A-Z0-9]{10})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None
    
    def extract_shopee_id(self, url: str) -> Optional[str]:
        """Extrai ID do produto da Shopee"""
        # Padrão comum: shopee.com.br/produto.123.456
        match = re.search(r'\.(\d+)\.(\d+)(?:\?|$)', url)
        if match:
            return f"{match.group(1)}.{match.group(2)}"
        
        return None
    
    async def get_page_content(self, url: str, retries: int = 3) -> Optional[str]:
        """Obtém conteúdo da página com retry e rotação de headers"""
        
        for attempt in range(retries):
            try:
                headers = {
                    'User-Agent': self.ua.random,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Cache-Control': 'max-age=0'
                }
                
                async with self.session.get(url, headers=headers) as response:
                    if response.status == 200:
                        content = await response.text()
                        return content
                    elif response.status == 429:  # Rate limited
                        wait_time = 2 ** attempt
                        logger.warning(f"Rate limited, waiting {wait_time}s before retry")
                        await asyncio.sleep(wait_time)
                    else:
                        logger.warning(f"HTTP {response.status} for {url}")
                        
            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed for {url}: {str(e)}")
                if attempt < retries - 1:
                    await asyncio.sleep(2 ** attempt)
        
        return None
    
    async def scrape_amazon_product(self, url: str, asin: str) -> Optional[ProductData]:
        """Scraping específico para Amazon"""
        
        content = await self.get_page_content(url)
        if not content:
            return None
        
        soup = BeautifulSoup(content, 'html.parser')
        
        try:
            # Título do produto
            title_selectors = [
                '#productTitle',
                '.product-title',
                'h1.a-size-large'
            ]
            title = ""
            for selector in title_selectors:
                element = soup.select_one(selector)
                if element:
                    title = element.get_text().strip()
                    break
            
            # Preço
            price = 0.0
            original_price = None
            
            price_selectors = [
                '.a-price-whole',
                '.a-offscreen',
                '.a-price .a-offscreen'
            ]
            
            for selector in price_selectors:
                element = soup.select_one(selector)
                if element:
                    price_text = element.get_text().strip()
                    price_match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
                    if price_match:
                        price = float(price_match.group().replace(',', ''))
                        break
            
            # Preço original (se houver desconto)
            original_price_element = soup.select_one('.a-text-price .a-offscreen')
            if original_price_element:
                original_price_text = original_price_element.get_text().strip()
                original_price_match = re.search(r'[\d,]+\.?\d*', original_price_text.replace(',', ''))
                if original_price_match:
                    original_price = float(original_price_match.group().replace(',', ''))
            
            # Imagem principal
            image_url = ""
            image_selectors = [
                '#landingImage',
                '.a-dynamic-image',
                '#imgBlkFront'
            ]
            
            for selector in image_selectors:
                element = soup.select_one(selector)
                if element:
                    image_url = element.get('src') or element.get('data-src', '')
                    break
            
            # Imagens adicionais
            additional_images = []
            image_elements = soup.select('.a-button-thumbnail img')
            for img in image_elements[:5]:  # Máximo 5 imagens adicionais
                img_src = img.get('src') or img.get('data-src', '')
                if img_src and img_src not in additional_images:
                    additional_images.append(img_src)
            
            # Avaliação
            rating = None
            rating_element = soup.select_one('.a-icon-alt')
            if rating_element:
                rating_text = rating_element.get_text()
                rating_match = re.search(r'(\d+\.?\d*)', rating_text)
                if rating_match:
                    rating = float(rating_match.group(1))
            
            # Número de avaliações
            review_count = 0
            review_element = soup.select_one('#acrCustomerReviewText')
            if review_element:
                review_text = review_element.get_text()
                review_match = re.search(r'(\d+)', review_text.replace(',', ''))
                if review_match:
                    review_count = int(review_match.group(1))
            
            # Descrição
            description = ""
            desc_selectors = [
                '#feature-bullets ul',
                '#productDescription',
                '.a-unordered-list.a-vertical'
            ]
            
            for selector in desc_selectors:
                element = soup.select_one(selector)
                if element:
                    description = element.get_text().strip()[:1000]  # Limitar tamanho
                    break
            
            # Características/Features
            features = []
            feature_elements = soup.select('#feature-bullets li span.a-list-item')
            for feature in feature_elements[:10]:  # Máximo 10 features
                feature_text = feature.get_text().strip()
                if feature_text and len(feature_text) > 10:
                    features.append(feature_text)
            
            # Especificações técnicas
            specifications = {}
            spec_table = soup.select_one('#productDetails_techSpec_section_1')
            if spec_table:
                rows = spec_table.select('tr')
                for row in rows:
                    cells = row.select('td')
                    if len(cells) == 2:
                        key = cells[0].get_text().strip()
                        value = cells[1].get_text().strip()
                        specifications[key] = value
            
            # Vendedor
            seller_name = ""
            seller_element = soup.select_one('#sellerProfileTriggerId')
            if seller_element:
                seller_name = seller_element.get_text().strip()
            
            # Status de estoque
            is_in_stock = True
            stock_element = soup.select_one('#availability span')
            if stock_element:
                stock_text = stock_element.get_text().lower()
                if 'indisponível' in stock_text or 'fora de estoque' in stock_text:
                    is_in_stock = False
            
            return ProductData(
                title=title,
                price=price,
                original_price=original_price,
                description=description,
                image_url=image_url,
                additional_images=additional_images,
                marketplace='amazon',
                marketplace_id=asin,
                rating=rating,
                review_count=review_count,
                is_in_stock=is_in_stock,
                specifications=specifications,
                features=features,
                seller_name=seller_name
            )
            
        except Exception as e:
            logger.error(f"Error scraping Amazon product {asin}: {str(e)}")
            return None
    
    async def scrape_shopee_product(self, url: str, product_id: str) -> Optional[ProductData]:
        """Scraping específico para Shopee"""
        
        content = await self.get_page_content(url)
        if not content:
            return None
        
        soup = BeautifulSoup(content, 'html.parser')
        
        try:
            # Shopee usa muito JavaScript, então vamos tentar extrair dados do JSON
            script_tags = soup.find_all('script')
            product_data = None
            
            for script in script_tags:
                if script.string and 'window.__INITIAL_STATE__' in script.string:
                    # Extrair dados JSON do estado inicial
                    json_match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.+?});', script.string)
                    if json_match:
                        try:
                            data = json.loads(json_match.group(1))
                            # Navegar pela estrutura JSON para encontrar dados do produto
                            if 'item' in data:
                                product_data = data['item']
                                break
                        except json.JSONDecodeError:
                            continue
            
            if not product_data:
                # Fallback para scraping HTML tradicional
                return await self.scrape_shopee_html(soup, product_id)
            
            # Extrair dados do JSON
            title = product_data.get('name', '')
            
            # Preço (Shopee usa centavos)
            price = 0.0
            if 'price' in product_data:
                price = product_data['price'] / 100000  # Converter de centavos
            
            original_price = None
            if 'price_before_discount' in product_data:
                original_price = product_data['price_before_discount'] / 100000
            
            # Imagens
            image_url = ""
            additional_images = []
            if 'images' in product_data:
                images = product_data['images']
                if images:
                    image_url = f"https://cf.shopee.com.br/file/{images[0]}"
                    additional_images = [f"https://cf.shopee.com.br/file/{img}" for img in images[1:6]]
            
            # Avaliação
            rating = None
            if 'item_rating' in product_data:
                rating_data = product_data['item_rating']
                if 'rating_star' in rating_data:
                    rating = rating_data['rating_star']
            
            # Número de avaliações
            review_count = 0
            if 'cmt_count' in product_data:
                review_count = product_data['cmt_count']
            
            # Descrição
            description = product_data.get('description', '')
            
            # Vendedor
            seller_name = ""
            if 'shop_location' in product_data:
                seller_name = product_data['shop_location']
            
            # Status de estoque
            is_in_stock = product_data.get('stock', 0) > 0
            
            return ProductData(
                title=title,
                price=price,
                original_price=original_price,
                description=description,
                image_url=image_url,
                additional_images=additional_images,
                marketplace='shopee',
                marketplace_id=product_id,
                rating=rating,
                review_count=review_count,
                is_in_stock=is_in_stock,
                seller_name=seller_name
            )
            
        except Exception as e:
            logger.error(f"Error scraping Shopee product {product_id}: {str(e)}")
            return None
    
    async def scrape_shopee_html(self, soup: BeautifulSoup, product_id: str) -> Optional[ProductData]:
        """Fallback para scraping HTML da Shopee"""
        
        try:
            # Título
            title = ""
            title_element = soup.select_one('h1')
            if title_element:
                title = title_element.get_text().strip()
            
            # Preço (buscar em elementos comuns)
            price = 0.0
            price_selectors = [
                '.product-price',
                '.price',
                '[data-testid="price"]'
            ]
            
            for selector in price_selectors:
                element = soup.select_one(selector)
                if element:
                    price_text = element.get_text().strip()
                    price_match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
                    if price_match:
                        price = float(price_match.group().replace(',', ''))
                        break
            
            return ProductData(
                title=title,
                price=price,
                marketplace='shopee',
                marketplace_id=product_id
            )
            
        except Exception as e:
            logger.error(f"Error in Shopee HTML fallback: {str(e)}")
            return None
    
    async def scrape_product(self, url: str) -> Optional[ProductData]:
        """Método principal para scraping de produto"""
        
        marketplace = self.detect_marketplace(url)
        if not marketplace:
            raise ValueError("Marketplace não suportado")
        
        if marketplace == 'amazon':
            asin = self.extract_amazon_asin(url)
            if not asin:
                raise ValueError("Não foi possível extrair ASIN da URL da Amazon")
            return await self.scrape_amazon_product(url, asin)
        
        elif marketplace == 'shopee':
            product_id = self.extract_shopee_id(url)
            if not product_id:
                raise ValueError("Não foi possível extrair ID do produto da Shopee")
            return await self.scrape_shopee_product(url, product_id)
        
        return None

# Função utilitária para uso em APIs
async def scrape_product_data(url: str) -> Dict:
    """Função para scraping de produto que retorna dict"""
    
    async with ProductScraper() as scraper:
        product_data = await scraper.scrape_product(url)
        
        if product_data:
            return asdict(product_data)
        else:
            raise Exception("Não foi possível extrair dados do produto")

# Exemplo de uso
if __name__ == "__main__":
    async def test_scraper():
        test_urls = [
            "https://www.amazon.com.br/dp/B08N5WRWNW",  # Exemplo Amazon
            "https://shopee.com.br/produto.123.456"     # Exemplo Shopee
        ]
        
        async with ProductScraper() as scraper:
            for url in test_urls:
                try:
                    product = await scraper.scrape_product(url)
                    if product:
                        print(f"Produto extraído: {product.title}")
                        print(f"Preço: R$ {product.price:.2f}")
                        print(f"Marketplace: {product.marketplace}")
                        print("-" * 50)
                    else:
                        print(f"Falha ao extrair produto de: {url}")
                except Exception as e:
                    print(f"Erro: {str(e)}")
    
    # Executar teste
    # asyncio.run(test_scraper())

