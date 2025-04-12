
import { supabase } from "@/integrations/supabase/client";

// Default affiliate IDs
const DEFAULT_AFFILIATE_IDS = {
  amazon: "7hy01-20",
  shopee: "",
  mercadolivre: ""
};

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
  // If no affiliate code is provided, use the default for the platform
  const code = affiliateCode || DEFAULT_AFFILIATE_IDS[platformType];
  
  switch (platformType) {
    case 'amazon':
      // Amazon affiliate URL format
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}tag=${code}`;
    
    case 'shopee':
      // Shopee affiliate URL format
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}smtt=${code}`;
    
    case 'mercadolivre':
      // Mercado Livre affiliate URL format
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}af=${code}`;
    
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
  // Use the default affiliate code if none is provided
  const code = affiliateCode || DEFAULT_AFFILIATE_IDS[platformType];
  
  // Generate the affiliate URL
  const affiliateUrl = generateAffiliateUrl(productUrl, code, platformType);
  
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

// Function to get the default affiliate ID for a platform
export function getDefaultAffiliateId(platform: 'amazon' | 'shopee' | 'mercadolivre'): string {
  return DEFAULT_AFFILIATE_IDS[platform];
}
