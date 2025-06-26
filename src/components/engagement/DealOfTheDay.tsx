
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Flame, Star, Users, ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

export const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const { products, loading } = useProducts({ featuredOnly: true, limit: 1 });
  const featuredProduct = products[0];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimDeal = () => {
    toast.success('Oferta aproveitada! Redirecionando para o produto...');
    // Analytics tracking would go here
  };

  if (loading || !featuredProduct) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const discountPercentage = featuredProduct.original_price 
    ? Math.round(((featuredProduct.original_price - featuredProduct.price) / featuredProduct.original_price) * 100)
    : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
          <CardTitle className="text-2xl font-bold">Deal do Dia</CardTitle>
          <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>
        <CardDescription className="text-orange-100">
          Oferta especial por tempo limitado
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Countdown Timer */}
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Timer className="w-5 h-5" />
            <span className="text-sm font-medium">Termina em:</span>
          </div>
          <div className="flex justify-center space-x-4 text-center">
            <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
              <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs">Horas</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
              <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs">Min</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
              <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs">Seg</div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/3">
            <img
              src={featuredProduct.image_url || 'https://via.placeholder.com/200'}
              alt={featuredProduct.title}
              className="w-full h-40 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2">
                {featuredProduct.title}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-yellow-500 text-black font-bold animate-pulse">
                  {discountPercentage}% OFF
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  {featuredProduct.marketplace}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">
                  R$ {featuredProduct.price.toFixed(2)}
                </span>
                {featuredProduct.original_price && (
                  <span className="text-lg text-white/70 line-through">
                    R$ {featuredProduct.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {featuredProduct.rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1">{featuredProduct.rating.toFixed(1)}</span>
                  </div>
                  {featuredProduct.review_count && (
                    <span className="text-sm text-white/80">
                      ({featuredProduct.review_count} avaliações)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>47 pessoas compraram hoje</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>12 pessoas visualizando agora</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleClaimDeal}
          className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold py-4 text-lg"
          size="lg"
        >
          Aproveitar Oferta
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Savings Info */}
        {discountPercentage > 0 && (
          <div className="text-center text-sm bg-green-600/20 rounded-lg p-3">
            <span className="font-semibold">
              💰 Você economiza R$ {((featuredProduct.original_price || 0) - featuredProduct.price).toFixed(2)} nesta oferta!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
