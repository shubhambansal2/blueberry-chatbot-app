'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

const ShopContext = createContext<string | null>(null);

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [shop, setShop] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let shopParam = params.get('shop');
      if (shopParam) {
        sessionStorage.setItem('shop', shopParam);
      } else {
        shopParam = sessionStorage.getItem('shop');
        if (shopParam) {
          // Auto-append shop param to URL if missing
          params.set('shop', shopParam);
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      }
      setShop(shopParam);
    }
  }, []);

  return (
    <ShopContext.Provider value={shop}>
      {children}
    </ShopContext.Provider>
  );
}; 