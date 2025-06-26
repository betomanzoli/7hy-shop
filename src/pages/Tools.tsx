
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SavingsCalculator } from '@/components/tools/SavingsCalculator';
import { ProductComparator } from '@/components/tools/ProductComparator';
import { PriceTracker } from '@/components/tools/PriceTracker';
import { PriceAlertSystem } from '@/components/notifications/PriceAlertSystem';
import { PointsSystem } from '@/components/gamification/PointsSystem';
import { DealOfTheDay } from '@/components/engagement/DealOfTheDay';
import { Calculator, TrendingUp, Bell, Trophy, Target, Flame } from 'lucide-react';

const Tools = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Ferramentas Inteligentes</h1>
          <p className="text-xl text-gray-600">
            Use nossas ferramentas para economizar mais e comprar melhor
          </p>
        </div>

        <Tabs defaultValue="deal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="deal" className="flex items-center">
              <Flame className="w-4 h-4 mr-2" />
              Deal do Dia
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="comparator" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Comparador
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Price Tracker
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Pontos
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="deal">
              <div className="flex justify-center">
                <DealOfTheDay />
              </div>
            </TabsContent>

            <TabsContent value="calculator">
              <div className="flex justify-center">
                <SavingsCalculator />
              </div>
            </TabsContent>

            <TabsContent value="comparator">
              <ProductComparator />
            </TabsContent>

            <TabsContent value="tracker">
              <PriceTracker />
            </TabsContent>

            <TabsContent value="alerts">
              <PriceAlertSystem />
            </TabsContent>

            <TabsContent value="points">
              <PointsSystem />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tools;
