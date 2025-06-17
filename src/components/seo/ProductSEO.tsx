
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductSEOProps {
  product: {
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    marketplace: string;
    rating?: number;
    reviewCount?: number;
  };
  canonical?: string;
}

export function ProductSEO({ product, canonical }: ProductSEOProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const seoTitle = `${product.title} - Melhor Preço R$ ${product.price.toFixed(2)} | 7hy Shop`;
  const seoDescription = product.description 
    ? product.description.substring(0, 160) + '...'
    : `Compre ${product.title} por R$ ${product.price.toFixed(2)} na ${product.marketplace}. ${discount > 0 ? `${discount}% de desconto!` : 'Melhor preço garantido!'} Ofertas imperdíveis no 7hy Shop.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": seoDescription,
    "image": product.imageUrl,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": product.marketplace
      }
    },
    "aggregateRating": product.rating && product.reviewCount ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "brand": {
      "@type": "Brand",
      "name": product.marketplace === 'amazon' ? 'Amazon' : 
             product.marketplace === 'shopee' ? 'Shopee' : 'Mercado Livre'
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="robots" content="index, follow" />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Tags */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={product.imageUrl} />
      <meta property="og:price:amount" content={product.price.toString()} />
      <meta property="og:price:currency" content="BRL" />
      <meta property="og:availability" content="instock" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="product" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={product.imageUrl} />

      {/* Product Specific Meta Tags */}
      <meta name="product:price:amount" content={product.price.toString()} />
      <meta name="product:price:currency" content="BRL" />
      {product.originalPrice && (
        <meta name="product:original_price:amount" content={product.originalPrice.toString()} />
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional SEO Meta Tags */}
      <meta name="keywords" content={`${product.title.toLowerCase()}, ${product.marketplace}, comprar, melhor preço, oferta, desconto, promoção`} />
      <meta name="author" content="7hy Shop" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Helmet>
  );
}
