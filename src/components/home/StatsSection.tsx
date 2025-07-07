import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Users, TrendingUp, Star, Clock, Target } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      value: "50K+",
      label: "Usuários Ativos",
      subtitle: "Compradores inteligentes",
      color: "from-blue-50 to-indigo-50",
      border: "border-blue-200"
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
      value: "2M+",
      label: "Produtos Comparados",
      subtitle: "Em 3 marketplaces",
      color: "from-green-50 to-emerald-50",
      border: "border-green-200"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      value: "R$ 2,5M",
      label: "Economia Total",
      subtitle: "Gerada para usuários",
      color: "from-purple-50 to-pink-50",
      border: "border-purple-200"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      value: "4.8/5",
      label: "Avaliação",
      subtitle: "Satisfação dos usuários",
      color: "from-yellow-50 to-orange-50",
      border: "border-yellow-200"
    }
  ];

  const features = [
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: "Economia de Tempo",
      description: "Compare preços em segundos, não horas"
    },
    {
      icon: <Target className="w-5 h-5 text-green-600" />,
      title: "Decisões Inteligentes",
      description: "Ferramentas para escolhas informadas"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      title: "Máxima Economia",
      description: "Encontre sempre o melhor preço"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br ${stat.color} ${stat.border} border`}>
              <CardContent className="p-6 text-center">
                <div className="mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.subtitle}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Por que escolher o 7hy.shop?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sua Compra Inteligente Começa Aqui
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Não somos apenas um comparador. Somos seu assistente pessoal para decisões de compra inteligentes.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">1,234 pessoas usando agora</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">Nota 4.8/5 no Google</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm">R$ 15.7k economizados hoje</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}