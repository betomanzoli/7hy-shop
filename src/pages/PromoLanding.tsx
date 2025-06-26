
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  TrendingUp, 
  Gift, 
  Star, 
  Zap, 
  Target,
  Users,
  Timer,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const PromoLanding = () => {
  const [email, setEmail] = useState('');
  const [savings, setSavings] = useState(0);
  const [originalPrice, setOriginalPrice] = useState('');
  const [dealPrice, setDealPrice] = useState('');

  const calculateSavings = () => {
    const original = parseFloat(originalPrice);
    const deal = parseFloat(dealPrice);
    if (original && deal && original > deal) {
      const saved = original - deal;
      const percentage = ((saved / original) * 100).toFixed(1);
      setSavings(saved);
      toast.success(`Você economizaria R$ ${saved.toFixed(2)} (${percentage}%)`);
    }
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Email cadastrado! Você receberá nossas melhores ofertas.');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <div className="animate-pulse mb-4">
            <Sparkles className="w-8 h-8 mx-auto text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Economize até 70%
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            A plataforma inteligente que encontra os melhores preços para você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full">
              <Zap className="w-5 h-5 mr-2" />
              Começar a Economizar
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 mr-1" />
              +10.000 usuários economizando
            </Badge>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Calculadora de Economia */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Calculadora de Economia
              </CardTitle>
              <CardDescription className="text-white/80">
                Descubra quanto você pode economizar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Preço original (R$)"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              <Input
                placeholder="Preço da oferta (R$)"
                value={dealPrice}
                onChange={(e) => setDealPrice(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              <Button onClick={calculateSavings} className="w-full bg-green-600 hover:bg-green-700">
                Calcular Economia
              </Button>
              {savings > 0 && (
                <div className="text-center p-4 bg-green-600/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-300">
                    R$ {savings.toFixed(2)} economizados!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deal of The Day */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Timer className="w-5 h-5 mr-2" />
                  Deal do Dia
                </span>
                <Badge className="bg-yellow-500 text-black animate-pulse">
                  70% OFF
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="bg-white/20 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Smartphone Premium</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold">R$ 899</span>
                    <span className="line-through text-white/60">R$ 2.999</span>
                  </div>
                </div>
                <Button className="w-full bg-white text-red-600 hover:bg-white/90 font-bold">
                  Ver Oferta
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-white/80">⏰ Restam apenas 6 horas!</p>
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Preço */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Alertas Inteligentes
              </CardTitle>
              <CardDescription className="text-white/80">
                Seja notificado quando o preço baixar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Monitoramento 24/7</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Alertas por email e push</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Histórico de preços</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Criar Alerta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Tools Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ferramentas Inteligentes
          </h2>
          <p className="text-xl text-white/80">
            Mais do que comparar preços, nós te ajudamos a decidir melhor
          </p>
        </div>

        <Tabs defaultValue="comparator" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="comparator" className="text-white data-[state=active]:bg-white/20">
              Comparador
            </TabsTrigger>
            <TabsTrigger value="tracker" className="text-white data-[state=active]:bg-white/20">
              Price Tracker
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-white/20">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-white/20">
              Quiz
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparator" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle>Comparador Inteligente</CardTitle>
                <CardDescription className="text-white/80">
                  Compare até 3 produtos lado a lado com análise detalhada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-white/20 rounded p-4 text-center">
                      <div className="w-full h-32 bg-white/20 rounded mb-4 flex items-center justify-center">
                        <span className="text-white/60">Produto {i}</span>
                      </div>
                      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                        Adicionar Produto
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                  Comparar Produtos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracker" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Histórico de Preços
                </CardTitle>
                <CardDescription className="text-white/80">
                  Veja a evolução dos preços ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 p-6 rounded-lg">
                  <div className="h-40 flex items-end justify-between space-x-2">
                    {[40, 65, 30, 80, 45, 70, 25].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t"
                        style={{ height: `${height}%`, width: '12%' }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>Jan</span>
                    <span>Fev</span>
                    <span>Mar</span>
                    <span>Abr</span>
                    <span>Mai</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-600/20 rounded-lg">
                  <p className="text-green-300 font-semibold">
                    💡 Melhor época para comprar: Final do mês
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Agregador de Reviews
                </CardTitle>
                <CardDescription className="text-white/80">
                  Reviews consolidadas de Amazon, Shopee e outras plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Amazon', 'Shopee', 'MercadoLivre'].map((platform) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{platform}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm">4.8</span>
                      </div>
                    </div>
                    <span className="text-sm text-white/60">1.2k reviews</span>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-blue-600/20 rounded-lg">
                  <p className="text-blue-300 font-semibold">
                    ⭐ Nota geral: 4.9/5 (Excelente)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Quiz: Encontre seu Produto Ideal
                </CardTitle>
                <CardDescription className="text-white/80">
                  Responda algumas perguntas e descubra o produto perfeito para você
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Qual é o seu orçamento?</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Até R$ 100', 'R$ 100-500', 'R$ 500-1000', 'Acima R$ 1000'].map((budget) => (
                      <Button
                        key={budget}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 text-xs"
                      >
                        {budget}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Categoria de interesse:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Eletrônicos', 'Moda', 'Casa', 'Beleza'].map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Encontrar Produtos Ideais
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            O que nossos usuários dizem
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Maria Silva",
              savings: "R$ 2.547",
              text: "Economizei mais de R$ 2.500 em apenas 3 meses! As ofertas são realmente incríveis."
            },
            {
              name: "João Santos",
              savings: "R$ 1.832",
              text: "Os alertas de preço me salvaram muito dinheiro. Nunca mais perco uma promoção!"
            },
            {
              name: "Ana Costa",
              savings: "R$ 3.156",
              text: "O comparador é fantástico! Encontro sempre o melhor preço em segundos."
            }
          ].map((testimonial, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{testimonial.name}</span>
                  <Badge className="bg-green-600">
                    Economizou {testimonial.savings}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0 text-black">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para Economizar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de pessoas que já economizam com nossa plataforma
            </p>
            <form onSubmit={handleEmailSignup} className="max-w-md mx-auto flex gap-4">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 placeholder:text-black/60"
                required
              />
              <Button type="submit" className="bg-black text-white hover:bg-gray-800 whitespace-nowrap">
                Começar Grátis
              </Button>
            </form>
            <p className="text-sm mt-4 opacity-75">
              ✅ Grátis para sempre • ✅ Sem spam • ✅ Cancelar a qualquer momento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-black/20 backdrop-blur-lg border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/80">
            <p>&copy; 2024 7hy-Shop. Economize inteligente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoLanding;
