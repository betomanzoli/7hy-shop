
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event_type: string;
  product_id?: string;
  event_data?: Record<string, any>;
  session_id?: string;
  user_agent?: string;
  referrer?: string;
}

export const useAnalytics = () => {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      const sessionId = sessionStorage.getItem('session_id') || 
        crypto.randomUUID();
      
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      const analyticsData = {
        event_type: event.event_type,
        product_id: event.product_id || null,
        event_data: event.event_data || {},
        session_id: sessionId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        user_id: (await supabase.auth.getUser()).data.user?.id || null,
      };

      const { error } = await supabase
        .from('user_analytics')
        .insert([analyticsData]);

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, []);

  const trackSearch = useCallback((searchTerm: string, filters?: Record<string, any>) => {
    trackEvent({
      event_type: 'search',
      event_data: {
        search_term: searchTerm,
        filters: filters || {},
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackProductView = useCallback((productId: string, productData?: Record<string, any>) => {
    trackEvent({
      event_type: 'product_view',
      product_id: productId,
      event_data: {
        product_data: productData || {},
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackProductClick = useCallback((productId: string, context?: string) => {
    trackEvent({
      event_type: 'product_click',
      product_id: productId,
      event_data: {
        context: context || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackPageView = useCallback((page: string, additionalData?: Record<string, any>) => {
    trackEvent({
      event_type: 'page_view',
      event_data: {
        page,
        ...additionalData,
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  const trackToolUsage = useCallback((toolName: string, toolData?: Record<string, any>) => {
    trackEvent({
      event_type: 'tool_usage',
      event_data: {
        tool_name: toolName,
        tool_data: toolData || {},
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackSearch,
    trackProductView,
    trackProductClick,
    trackPageView,
    trackToolUsage,
  };
};
