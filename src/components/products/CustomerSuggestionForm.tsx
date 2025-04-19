
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerSuggestion } from '@/types/product';
import { Loader2 } from 'lucide-react';

const STORAGE_KEY = 'customer_suggestions';

const formSchema = z.object({
  name: z.string().min(3, { 
    message: 'Por favor, digite seu nome completo' 
  }),
  email: z.string().email({ 
    message: 'Por favor, digite um email válido' 
  }),
  productType: z.string().min(1, { 
    message: 'Por favor, selecione um tipo de produto' 
  }),
  message: z.string().min(10, { 
    message: 'A mensagem deve ter pelo menos 10 caracteres' 
  }).max(500, { 
    message: 'A mensagem deve ter no máximo 500 caracteres' 
  }),
});

export function CustomerSuggestionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      productType: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Create a new suggestion
      const newSuggestion: CustomerSuggestion = {
        id: Date.now().toString(),
        name: values.name,
        email: values.email,
        productType: values.productType,
        message: values.message,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing suggestions
      const existingData = localStorage.getItem(STORAGE_KEY);
      const existing = existingData ? JSON.parse(existingData) : [];
      
      // Add the new suggestion
      const updated = [...existing, newSuggestion];
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Show success message
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado por sua sugestão. Vamos avaliar e responder em breve.",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao enviar",
        description: "Houve um problema ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Sugestão de Produtos</h2>
        <p className="text-muted-foreground">
          Procurando algum produto específico? Deixe sua mensagem e vamos adicionar às nossas recomendações semanais.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de produto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Eletrônicos</SelectItem>
                    <SelectItem value="fashion">Moda</SelectItem>
                    <SelectItem value="home">Casa & Decoração</SelectItem>
                    <SelectItem value="beauty">Beleza & Cuidados</SelectItem>
                    <SelectItem value="accessories">Acessórios</SelectItem>
                    <SelectItem value="sports">Esportes</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o produto que você está procurando..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Sugestão'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
