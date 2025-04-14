import { supabase } from "@/integrations/supabase/client";
import { MarketplaceType } from "@/components/marketplace/MarketplaceLogo";

// Default affiliate IDs
const DEFAULT_AFFILIATE_IDS = {
  amazon: "7hy01-20",
  shopee: "18357850294"
};

interface ClickTrackingData {
  marketplaceId: string;
  productId: string;
  userId?: string;
  referrer?: string;
  platformType: MarketplaceType;
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

export function generateAffiliateUrl(baseUrl: string, affiliateCode: string, platformType: MarketplaceType): string {
  // If no affiliate code is provided, use the default for the platform
  const code = affiliateCode || DEFAULT_AFFILIATE_IDS[platformType];
  
  switch (platformType) {
    case 'amazon':
      // Amazon affiliate URL format
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}tag=${code}`;
    
    case 'shopee':
      // Check if it's a short URL (s.shopee.com.br) or a full product URL
      if (baseUrl.includes('s.shopee.com.br')) {
        // For short URLs like https://s.shopee.com.br/5puqNwGojV, we need to keep them as is
        // The affiliate ID is handled by Shopee's redirect system
        return baseUrl;
      } else {
        // For regular Shopee product URLs, add the smtt parameter
        return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}smtt=${code}`;
      }
    
    default:
      return baseUrl;
  }
}

export function handleProductRedirect(
  productUrl: string, 
  affiliateCode: string, 
  platformType: MarketplaceType,
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
export function getDefaultAffiliateId(platform: MarketplaceType): string {
  return DEFAULT_AFFILIATE_IDS[platform];
}

// Shopee specific functions
export function getShopeeProductInfo(productUrl: string): { title: string, price: number, imageUrl: string } {
  // This is a placeholder function
  // In a real implementation, you would either:
  // 1. Use the Shopee API to get product details
  // 2. Parse product details from the URL or data you have
  
  // For now, return placeholder data
  return {
    title: "Produto Shopee",
    price: 99.99,
    imageUrl: "https://placehold.co/300x300?text=Produto+Shopee"
  };
}

// Map of Shopee shortened URLs to their categories
export const shopeeProductCategories: Record<string, string> = {
  "5puqNwGojV": "electronics",
  "5VHzzLHc6C": "electronics",
  "20i7ov4Cj2": "electronics",
  "VtK2BIJIG": "electronics",
  "7KjeAmzsqz": "fashion",
  "4fiszua1ul": "fashion",
  "7fMUZTWCG3": "fashion",
  "x3RQTNCw": "home",
  "1qOhcnr7hN": "home",
  "4fit01Jvzh": "home",
  "9zkPLsG5Qt": "beauty",
  "8fF1lRBxWg": "beauty",
  "5VHzzeaPDB": "beauty",
  "5fbQBzCxrn": "accessories",
  "2B1Y1Z3t0q": "accessories",
  "6AXgmvfSHz": "accessories",
  "x3Rbkvd8": "sports",
  "30af19qEJi": "sports",
  "AKNFkdxZxP": "sports",
  // Add more as needed
};

// Helper function to extract the ID from a Shopee short URL
export function extractShopeeShortUrlId(url: string): string | null {
  const regex = /https?:\/\/s\.shopee\.com\.br\/([A-Za-z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
