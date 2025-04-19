
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { MarketplaceType } from '@/components/marketplace/MarketplaceLogo';
import { Product } from '@/types/product';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  initialData?: Partial<Product>;
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter no mínimo 3 caracteres' }),
  price: z.coerce.number().min(0, { message: 'O preço deve ser um número positivo' }),
  originalPrice: z.coerce.number().min(0, { message: 'O preço original deve ser um número positivo' }).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Forneça uma URL de imagem válida' }),
  affiliateUrl: z.string().url({ message: 'Forneça uma URL de afiliado válida' }),
  marketplace: z.enum(['amazon', 'shopee'] as const),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  rating: z.coerce.number().min(0).max(5).optional(),
});

const categoryOptions = [
  { value: 'electronics', label: 'Eletrônicos' },
  { value: 'fashion', label: 'Moda' },
  { value: 'home', label: 'Casa & Decoração' },
  { value: 'beauty', label: 'Beleza & Cuidados' },
  { value: 'accessories', label: 'Acessórios' },
  { value: 'sports', label: 'Esportes' },
  { value: 'other', label: 'Outros' },
];

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScrapingData, setIsScrapingData] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      price: initialData?.price || 0,
      originalPrice: initialData?.originalPrice || 0,
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      affiliateUrl: initialData?.affiliateUrl || '',
      marketplace: (initialData?.marketplace as any) || 'shopee',
      category: initialData?.category || 'electronics',
      rating: initialData?.rating || 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // In a real app, you might want to validate the link format here
    const marketplaceType = values.marketplace as MarketplaceType;
    
    // Process the form data
    const productData: Product = {
      id: initialData?.id || '',
      title: values.title,
      price: values.price,
      originalPrice: values.originalPrice,
      description: values.description,
      imageUrl: values.imageUrl,
      affiliateUrl: values.affiliateUrl,
      marketplace: marketplaceType,
      category: values.category,
      rating: values.rating,
      featured: initialData?.featured || false,
    };
    
    // Submit the product
    setTimeout(() => {
      onSubmit(productData);
      setIsLoading(false);
      form.reset();
    }, 500);
  };

  const tryScrapingLink = async () => {
    const affiliateUrl = form.getValues('affiliateUrl');
    
    if (!affiliateUrl) {
      form.setError('affiliateUrl', { message: 'Forneça um link para extrair informações' });
      return;
    }
    
    setIsScrapingData(true);
    
    // This would be a real scraping function in production
    // For now, we'll simulate a delay and provide mock data
    setTimeout(() => {
      const mockData = {
        title: 'Produto Extraído da URL',
        price: 99.9,
        originalPrice: 129.9,
        description: 'Descrição extraída do produto...',
        imageUrl: 'https://placehold.co/400x400',
        rating: 4.5,
      };
      
      // Update form with scraped data
      form.setValue('title', mockData.title);
      form.setValue('price', mockData.price);
      form.setValue('originalPrice', mockData.originalPrice);
      form.setValue('description', mockData.description);
      form.setValue('imageUrl', mockData.imageUrl);
      form.setValue('rating', mockData.rating);
      
      setIsScrapingData(false);
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="marketplace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketplace</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um marketplace" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="shopee">Shopee</SelectItem>
                    <SelectItem value="amazon">Amazon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="affiliateUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link de Afiliado</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={tryScrapingLink}
                    disabled={isScrapingData}
                  >
                    {isScrapingData ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extraindo...
                      </>
                    ) : (
                      'Extrair Dados'
                    )}
                  </Button>
                </div>
                <FormDescription>
                  Cole o link de afiliado completo do produto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-2 grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Original (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do produto..." className="min-h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avaliação (0-5)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min="0" max="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Produto'
          )}
        </Button>
      </form>
    </Form>
  );
}
