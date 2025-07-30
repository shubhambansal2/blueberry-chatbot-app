'use client';

import { SidebarLayout } from "../../components/Sidebar"; 
import AuthGuard from "./AuthGuard";
import ShopifySubscriptionChecker from "../../components/ShopifySubscriptionChecker";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <AuthGuard>
        <ShopifySubscriptionChecker />
        <SidebarLayout>
      {children}
    </SidebarLayout>
      </AuthGuard>
    
  );
}