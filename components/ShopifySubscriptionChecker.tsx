'use client'

import { useEffect } from 'react';
import { useShop } from './ShopContext';
import { checkShopifySubscription, getShopAccessToken } from '../lib/shopifySubscription';

export default function ShopifySubscriptionChecker() {
  const shop = useShop();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!shop) {
        console.log('ℹ️ No shop parameter found, skipping subscription check');
        return;
      }

      console.log(`🔍 Starting subscription check for shop: ${shop}`);
      
      // Get the access token for this shop
      const accessToken = await getShopAccessToken(shop);
      
      if (accessToken) {
        // Check subscription using the access token
        await checkShopifySubscription(shop, accessToken);
      } else {
        console.log(`❌ Could not retrieve access token for shop ${shop}`);
      }
    };

    checkSubscription();
  }, [shop]);

  // This component doesn't render anything, it just performs the subscription check
  return null;
} 