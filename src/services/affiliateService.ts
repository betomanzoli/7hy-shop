
import { supabase } from "@/integrations/supabase/client";

interface ClickTrackingData {
  marketplaceId: string;
  productId: string;
  userId?: string;
  referrer?: string;
  platformType: 'amazon' | 'shopee' | 'mercadolivre';
}

export async function trackAffiliateClick(data: ClickTrackingData): Promise<void> {
  try {
    const { marketplaceId, productId, userId, referrer, platformType } = data;
    
    // Call the Supabase Edge Function to track the click
    const { error } = await supabase.functions.invoke('track-affiliate-click', {
      body: {
        marketplaceId,
        productId,
        userId,
        referrer,
        platformType,
        originalUrl: window.location.href
      }
    });
    
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
    referrer: window.location.href,
    platformType
  });
  
  return affiliateUrl;
}
