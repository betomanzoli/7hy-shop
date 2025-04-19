
import React from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Trash, Star, StarOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MarketplaceLogo } from '@/components/marketplace/MarketplaceLogo';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductsListProps {
  products: Product[];
  onRemove: (id: string) => void;
  onFeature: (id: string, featured: boolean) => void;
}

export function ProductsList({ products, onRemove, onFeature }: ProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead>Destaque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="align-top">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={product.imageUrl || "https://placehold.co/100x100"} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium line-clamp-2">{product.title}</div>
                    {product.rating && (
                      <div className="flex items-center text-amber-500 text-sm">
                        <Star className="h-3 w-3 fill-amber-500 mr-1" /> {product.rating}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.category}</Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-semibold">{formatCurrency(product.price)}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <MarketplaceLogo type={product.marketplace} />
              </TableCell>
              <TableCell>
                {product.featured ? (
                  <Badge className="bg-amber-500">Destaque</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Normal</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFeature(product.id, !product.featured)}
                >
                  {product.featured ? (
                    <StarOff className="h-4 w-4" />
                  ) : (
                    <Star className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(product.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
