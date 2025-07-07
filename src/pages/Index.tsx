
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { TrendingProducts } from '@/components/products/TrendingProducts';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaSection } from '@/components/home/CtaSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <div className="container px-4 py-12">
        <TrendingProducts />
      </div>
      <HowItWorksSection />
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
