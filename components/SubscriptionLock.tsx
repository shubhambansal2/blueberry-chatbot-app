import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, ExternalLink } from 'lucide-react';
import { checkSalesAndFaqSubscription } from '../lib/chatbotsfetch';
import { useShop } from './ShopContext';

interface SubscriptionLockProps {
  chatbot: {
    chatbot_id: number;
    chatbot_name: string;
    is_product_recommender?: boolean;
  };
  children: React.ReactNode;
  onLockedAction?: () => void;
  variant?: 'default' | 'compact';
}

const SubscriptionLock: React.FC<SubscriptionLockProps> = ({ 
  chatbot, 
  children, 
  onLockedAction,
  variant = 'default'
}) => {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const shop = useShop();

  useEffect(() => {
    const checkSubscription = async () => {
      console.log('SubscriptionLock: Checking subscription for chatbot:', chatbot.chatbot_name);
      console.log('SubscriptionLock: Shop parameter:', shop);
      console.log('SubscriptionLock: Is product recommender:', chatbot.is_product_recommender);
      
      // Only check subscription if shop parameter is present AND chatbot is a product recommender
      if (!shop || !chatbot.is_product_recommender) {
        console.log('SubscriptionLock: No subscription check needed - no shop or not product recommender');
        setHasSubscription(true); // No subscription needed if no shop or not product recommender
        return;
      }

      console.log('SubscriptionLock: Checking subscription for shop:', shop);
      setIsChecking(true);
      try {
        const hasAccess = await checkSalesAndFaqSubscription(shop);
        console.log('SubscriptionLock: Subscription check result:', hasAccess);
        setHasSubscription(hasAccess);
      } catch (error) {
        console.error('SubscriptionLock: Error checking subscription:', error);
        setHasSubscription(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSubscription();
  }, [chatbot.is_product_recommender, shop]);

  // If still checking, show loading state
  if (isChecking) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="text-sm">Checking subscription...</span>
          </div>
        </div>
      </div>
    );
  }

  // If no shop parameter or chatbot doesn't require subscription or user has subscription, show normal content
  if (!shop || !chatbot.is_product_recommender || hasSubscription) {
    console.log('SubscriptionLock: Showing normal content - no lock needed');
    return <>{children}</>;
  }

  // If chatbot requires subscription but user doesn't have it, show locked state
  console.log('SubscriptionLock: Showing locked state - subscription required');
  
  // Compact variant for deploychatbot and chatbotmessages pages
  if (variant === 'compact') {
    return (
      <div className="relative">
        <div className="opacity-60 pointer-events-none">
          {React.cloneElement(children as React.ReactElement, { disabled: true })}
        </div>
        <div className="absolute top-1 right-1">
          <button
            onClick={() => {
              const shopName = shop.split('.')[0];
              window.open(
                `https://admin.shopify.com/store/${shopName}/charges/purpleberry-chatbot/pricing_plans`,
                '_blank'
              );
              onLockedAction?.();
            }}
            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-1.5 py-0.5 rounded text-xs font-medium transition-colors shadow-sm"
            title="Subscription Required - Click to Upgrade"
          >
            <Lock className="w-2.5 h-2.5" />
            <span className="text-xs">Upgrade</span>
          </button>
        </div>
      </div>
    );
  }

  // Default variant for testchatbot and createchatbot pages
  return (
    <div className="relative">
      <div className="opacity-99 pointer-events-none">
        {React.cloneElement(children as React.ReactElement, { disabled: true })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
        <div className="text-center p-1.5 bg-white/95 rounded-lg shadow-lg max-w-[85%] mx-auto">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Lock className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-semibold text-gray-800">Subscription Required</span>
          </div>
          <button
            onClick={() => {
              const shopName = shop.split('.')[0];
              window.open(
                `https://admin.shopify.com/store/${shopName}/charges/purpleberry-chatbot/pricing_plans`,
                '_blank'
              );
              onLockedAction?.();
            }}
            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-1.5 py-0.5 rounded text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5" />
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionLock; 