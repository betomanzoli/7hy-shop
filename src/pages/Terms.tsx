
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const Terms = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Termos de Serviço</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceite dos Termos</h2>
              <p>
                Ao acessar e usar o 7hy.shop, você concorda em cumprir e ficar vinculado aos presentes 
                Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve 
                usar nosso serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p>
                O 7hy.shop é uma plataforma de agregação de produtos que integra ofertas da Amazon, 
                Shopee e outros marketplaces em um único local. Somos participantes dos programas 
                de afiliados oficiais desses marketplaces e recebemos comissões pelas compras 
                qualificadas realizadas através dos nossos links.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Programa de Afiliados</h2>
              <p>
                Como participantes dos programas Amazon Associates, Shopee Affiliates e outros programas 
                de afiliados, informamos que:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Recebemos comissões pelas compras qualificadas realizadas através dos nossos links</li>
                <li>Você não paga nenhum custo adicional por isso</li>
                <li>Os preços apresentados são os mesmos dos sites oficiais dos marketplaces</li>
                <li>Todas as transações ocorrem diretamente nos sites dos marketplaces parceiros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Responsabilidades do Usuário</h2>
              <p>Ao usar nosso serviço, você concorda em:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Fornecer informações precisas quando solicitado</li>
                <li>Não usar o serviço para atividades ilegais ou prejudiciais</li>
                <li>Respeitar os direitos de propriedade intelectual</li>
                <li>Não tentar interferir no funcionamento do serviço</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitação de Responsabilidade</h2>
              <p>
                O 7hy.shop atua como intermediário entre você e os marketplaces parceiros. Não somos 
                responsáveis por:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Qualidade, autenticidade ou defeitos dos produtos</li>
                <li>Políticas de entrega, devolução ou garantia dos marketplaces</li>
                <li>Disputas entre compradores e vendedores</li>
                <li>Alterações de preços ou disponibilidade após o redirecionamento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo do 7hy.shop, incluindo textos, imagens, logos e design, são de nossa 
                propriedade ou licenciados para nosso uso. É proibida a reprodução sem autorização prévia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As mudanças 
                entrarão em vigor imediatamente após sua publicação no site. É sua responsabilidade 
                revisar regularmente estes termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
              <p>
                Para dúvidas sobre estes Termos de Serviço, entre em contato conosco através da 
                nossa <a href="/contact" className="text-brand-600 hover:text-brand-700">página de contato</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
