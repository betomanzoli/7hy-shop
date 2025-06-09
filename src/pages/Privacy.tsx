
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
              <p>Coletamos as seguintes informações:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Informações fornecidas voluntariamente:</strong> Nome, email e mensagens enviadas através do formulário de contato</li>
                <li><strong>Informações de navegação:</strong> Páginas visitadas, produtos visualizados, tempo de permanência no site</li>
                <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional</li>
                <li><strong>Cookies:</strong> Para melhorar sua experiência de navegação e rastrear conversões de afiliados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Como Usamos suas Informações</h2>
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Responder às suas mensagens e solicitações</li>
                <li>Melhorar nosso serviço e experiência do usuário</li>
                <li>Rastrear conversões dos programas de afiliados</li>
                <li>Enviar comunicações sobre produtos e ofertas (apenas se você optar por receber)</li>
                <li>Cumprir obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
              <p>
                Compartilhamos informações limitadas com nossos parceiros de afiliados (Amazon, Shopee) 
                apenas para rastreamento de conversões e cumprimento dos termos dos programas de afiliados. 
                Nunca vendemos suas informações pessoais para terceiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cookies e Tecnologias Similares</h2>
              <p>
                Utilizamos cookies para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Lembrar suas preferências de navegação</li>
                <li>Rastrear links de afiliados para recebimento de comissões</li>
                <li>Analisar como você usa nosso site</li>
                <li>Personalizar conteúdo e ofertas</li>
              </ul>
              <p className="mt-4">
                Você pode desabilitar cookies em seu navegador, mas isso pode afetar algumas 
                funcionalidades do site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                informações contra acesso não autorizado, alteração, divulgação ou destruição. 
                No entanto, nenhum método de transmissão pela internet é 100% seguro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
              <p>Você tem o direito de:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Acessar as informações que temos sobre você</li>
                <li>Corrigir informações imprecisas</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Optar por não receber comunicações de marketing</li>
                <li>Portar seus dados para outro serviço</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações apenas pelo tempo necessário para cumprir as finalidades 
                descritas nesta política, exceto quando um período de retenção mais longo for 
                exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Menores de Idade</h2>
              <p>
                Nosso serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente 
                informações pessoais de menores de idade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
                mudanças significativas publicando a nova política em nosso site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
              <p>
                Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos, 
                entre em contato através da nossa <a href="/contact" className="text-brand-600 hover:text-brand-700">página de contato</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
