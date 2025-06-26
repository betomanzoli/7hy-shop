
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  product_id?: string;
  event_data?: Record<string, any>;
  session_id?: string;
  user_agent?: string;
  referrer?: string;
}

export const useAnalytics = () => {
  // Função para validar UUID
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      // Verificar se há um product_id e se é um UUID válido
      if (event.product_id && !isValidUUID(event.product_id)) {
        console.log('Skipping analytics for invalid UUID product ID:', event.product_id);
        return;
      }

      // Obter ID do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user for analytics');
        return;
      }

      const analyticsData = {
        user_id: user.id,
        event_type: event.event_type,
        product_id: event.product_id || null,
        event_data: event.event_data || {},
        session_id: event.session_id || crypto.randomUUID(),
        user_agent: event.user_agent || navigator.userAgent,
        referrer: event.referrer || document.referrer,
        ip_address: null // Will be handled by Supabase if needed
      };

      const { error } = await supabase
        .from('user_analytics')
        .insert([analyticsData]);

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const trackPageView = (page: string) => {
    trackEvent({
      event_type: 'page_view',
      event_data: { page }
    });
  };

  const trackProductView = (productId: string, productTitle?: string) => {
    // Só fazer tracking se for um UUID válido
    if (!isValidUUID(productId)) {
      console.log('Skipping product view tracking for invalid UUID:', productId);
      return;
    }
    
    trackEvent({
      event_type: 'product_view',
      product_id: productId,
      event_data: { product_title: productTitle }
    });
  };

  const trackProductClick = (productId: string, productTitle?: string, affiliateUrl?: string) => {
    // Só fazer tracking se for um UUID válido
    if (!isValidUUID(productId)) {
      console.log('Skipping product click tracking for invalid UUID:', productId);
      return;
    }

    trackEvent({
      event_type: 'product_click',
      product_id: productId,
      event_data: { 
        product_title: productTitle,
        affiliate_url: affiliateUrl
      }
    });
  };

  const trackSearch = (searchTerm: string, resultsCount?: number) => {
    trackEvent({
      event_type: 'search',
      event_data: { 
        search_term: searchTerm,
        results_count: resultsCount
      }
    });
  };

  const trackToolUsage = (toolName: string, toolData?: Record<string, any>) => {
    trackEvent({
      event_type: 'tool_usage',
      event_data: { 
        tool_name: toolName,
        ...toolData
      }
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackProductClick,
    trackSearch,
    trackToolUsage
  };
};
