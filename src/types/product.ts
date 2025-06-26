
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

export interface Product {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  description?: string;
  image_url: string;
  affiliate_url: string;
  marketplace: MarketplaceType;
  category: string;
  rating?: number;
  review_count?: number;
  is_deal?: boolean;
  featured?: boolean;
  createdAt?: string;
}

export interface CustomerSuggestion {
  id: string;
  name: string;
  email: string;
  message: string;
  productType: string;
  createdAt: string;
  processed?: boolean;
}
