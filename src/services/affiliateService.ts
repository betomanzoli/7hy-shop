
import { supabase } from "@/integrations/supabase/client";

interface ClickTrackingData {
  marketplaceId: string;
  productId: string;
  userId?: string;
  referrer?: string;
}

export async function trackAffiliateClick(data: ClickTrackingData): Promise<void> {
  try {
    const { marketplaceId, productId, userId, referrer } = data;
    
    const { error } = await supabase
      .from('affiliate_clicks')
      .insert([
        { 
          marketplace_id: marketplaceId,
          product_id: productId,
          user_id: userId,
          referrer: referrer,
          clicked_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error tracking affiliate click:', error);
    }
    
  } catch (err) {
    console.error('Failed to track affiliate click:', err);
  }
}

export function generateAffiliateUrl(baseUrl: string, affiliateCode: string, platformType: 'amazon' | 'shopee' | 'mercadolivre'): string {
  switch (platformType) {
    case 'amazon':
      // Amazon affiliate URL format
      return `${baseUrl}?tag=${affiliateCode}`;
    
    case 'shopee':
      // Shopee affiliate URL format
      return `${baseUrl}?smtt=${affiliateCode}`;
    
    case 'mercadolivre':
      // Mercado Livre affiliate URL format
      return `${baseUrl}?af=${affiliateCode}`;
    
    default:
      return baseUrl;
  }
}

export function handleProductRedirect(
  productUrl: string, 
  affiliateCode: string, 
  platformType: 'amazon' | 'shopee' | 'mercadolivre',
  productId: string,
  marketplaceId: string,
  userId?: string
): string {
  // Generate the affiliate URL
  const affiliateUrl = generateAffiliateUrl(productUrl, affiliateCode, platformType);
  
  // Track the click
  trackAffiliateClick({
    marketplaceId,
    productId,
    userId,
    referrer: window.location.href
  });
  
  return affiliateUrl;
}
