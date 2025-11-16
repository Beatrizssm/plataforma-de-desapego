/**
 * Layout principal da aplicação
 * Inclui Header e Footer conforme design do Figma
 */

import { ReactNode } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAuth } from "../hooks/useAuth";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function AppLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && isAuthenticated && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

