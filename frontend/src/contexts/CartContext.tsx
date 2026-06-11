"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { CartItem } from "@/types";
import { startCartTimer } from "@/lib/fomo";

const CART_KEY = "dami_cart";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantSku: string) => void;
  updateQuantity: (productId: string, variantSku: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalTry: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    startCartTimer();
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.variantSku === item.variantSku
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantSku: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantSku === variantSku))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantSku: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantSku);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantSku === variantSku ? { ...i, quantity } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotalTry = items.reduce((s, i) => s + i.unitPriceTry * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotalTry }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
