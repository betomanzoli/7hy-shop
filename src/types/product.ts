
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description?: string;
  imageUrl: string;
  affiliateUrl: string;
  marketplace: MarketplaceType;
  category: string;
  rating?: number;
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
