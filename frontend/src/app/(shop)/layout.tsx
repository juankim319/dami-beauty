import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingShopActions } from "@/components/FloatingShopActions";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@/components/Analytics";
import { ExitIntentOffer } from "@/components/shop/ExitIntentOffer";
import { PurchaseToast } from "@/components/shop/PurchaseToast";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <PurchaseToast />
          <FloatingShopActions />
          <CookieConsent />
          <ExitIntentOffer />
        </div>
        <Analytics />
      </CartProvider>
    </ThemeProvider>
  );
}
