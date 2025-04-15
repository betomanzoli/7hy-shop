
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Definir o schema de validação do formulário
const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  productType: z.string().min(2, { message: 'Digite o tipo de produto que procura' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' }),
});

type FormValues = z.infer<typeof formSchema>;

export function CustomerSuggestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      productType: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Em uma implementação real, você enviaria os dados para o Supabase aqui
      // Simulando um envio para o backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular sucesso
      toast({
        title: "Sugestão enviada!",
        description: "Obrigado por nos enviar sua sugestão. Analisaremos e entraremos em contato se necessário.",
        variant: "default",
      });
      
      // Limpar o formulário
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar sugestão",
        description: "Ocorreu um erro ao enviar sua sugestão. Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error('Erro ao enviar sugestão:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-brand-600" />
        <h2 className="text-2xl font-bold">Precisa de Ajuda?</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Não encontrou o produto que procura? Conte-nos o que você gostaria de ver em nossa seleção e podemos incluí-lo em nossa próxima atualização semanal.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
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
                    <Input placeholder="Digite seu email" type="email" {...field} />
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
                <FormLabel>Qual produto você procura?</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Fones de ouvido com cancelamento de ruído" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detalhes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nos conte mais detalhes sobre o produto que você está procurando..." 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Quanto mais detalhes você fornecer, melhor poderemos ajudá-lo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⭮</span>
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Sugestão
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
