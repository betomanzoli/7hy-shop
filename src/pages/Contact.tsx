
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada",
      description: "Agradecemos seu contato! Responderemos em breve.",
    });
  };
  
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Entre em Contato</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Fale Conosco</h2>
              <p className="text-muted-foreground mb-6">
                Estamos aqui para ajudar! Preencha o formulário e nossa equipe entrará em contato o mais rápido possível.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <Input id="name" placeholder="Seu nome completo" required />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Assunto
                  </label>
                  <Input id="subject" placeholder="Como podemos ajudar?" required />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensagem
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Escreva sua mensagem detalhada aqui..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Enviar Mensagem</Button>
              </form>
              
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-1">Horário de Atendimento</h3>
                  <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
                  <p className="text-muted-foreground">Sábado: 9h às 13h</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-1">Siga-nos</h3>
                  <div className="flex space-x-4 mt-2">
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-muted/40 p-8 rounded-xl">
                <h2 className="text-2xl font-semibold mb-6">Perguntas Frequentes (FAQ)</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como o 7hy.shop funciona?</AccordionTrigger>
                    <AccordionContent>
                      O 7hy.shop é uma plataforma que agrega produtos dos melhores marketplaces (Amazon e Shopee) em um só lugar. Quando você clica em um produto, é redirecionado para o site oficial do marketplace para finalizar a compra.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Os preços são os mesmos dos sites originais?</AccordionTrigger>
                    <AccordionContent>
                      Sim! Você verá exatamente os mesmos preços que estão nos sites oficiais dos marketplaces. Não adicionamos nenhuma taxa ou custo extra ao produto.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Como vocês ganham dinheiro?</AccordionTrigger>
                    <AccordionContent>
                      Somos parceiros oficiais dos programas de afiliados da Amazon e Shopee. Quando você realiza uma compra através dos nossos links, recebemos uma pequena comissão, sem qualquer custo adicional para você.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Onde faço o pagamento da compra?</AccordionTrigger>
                    <AccordionContent>
                      Todas as compras e pagamentos são realizados diretamente nos sites oficiais dos marketplaces (Amazon ou Shopee). O 7hy.shop apenas direciona você para o produto desejado no site oficial.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Como funciona a garantia e devolução?</AccordionTrigger>
                    <AccordionContent>
                      As políticas de garantia e devolução seguem as regras do marketplace onde você realizou a compra (Amazon ou Shopee). Você terá todas as proteções oferecidas por essas plataformas.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Posso sugerir produtos para o site?</AccordionTrigger>
                    <AccordionContent>
                      Sim! Na página de produtos, há um formulário onde você pode sugerir produtos que gostaria de ver no nosso site. Analisamos todas as sugestões e adicionamos produtos relevantes regularmente.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-7">
                    <AccordionTrigger>Vocês têm aplicativo móvel?</AccordionTrigger>
                    <AccordionContent>
                      Atualmente não temos um aplicativo móvel, mas nosso site é totalmente responsivo e funciona perfeitamente em smartphones e tablets. Estamos considerando desenvolver um app no futuro.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-8">
                    <AccordionTrigger>Como posso acompanhar as melhores ofertas?</AccordionTrigger>
                    <AccordionContent>
                      Você pode se inscrever em nossa newsletter no rodapé do site para receber as melhores ofertas semanalmente. Também atualizamos nossa seção "Produtos Selecionados da Semana" regularmente.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-8 p-4 bg-brand-50 dark:bg-brand-950 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Não encontrou sua resposta?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Entre em contato conosco através do formulário ao lado. Nossa equipe responde em até 24 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
