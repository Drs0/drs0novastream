'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { getEffectiveVariantPriceMad } from '@/lib/catalog/pricing';

const CART_STORAGE_KEY = 'novastream_cart_v1';

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPriceMad: number;
  isOpen: boolean;
  whatsappNumber: string;
  locale: Locale;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (variantId: string) => boolean;
  getItemQuantity: (variantId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  whatsappNumber,
  locale,
}: {
  children: ReactNode;
  whatsappNumber: string;
  locale: Locale;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore storage read errors
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write errors
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
      const addQty = Math.max(1, quantity);
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.variantId === newItem.variantId
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...newItem,
            quantity: updated[existingIndex].quantity + addQty,
          };
          return updated;
        }
        return [...prev, { ...newItem, quantity: addQty }];
      });
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (variantId: string) => items.some((i) => i.variantId === variantId),
    [items]
  );

  const getItemQuantity = useCallback(
    (variantId: string) =>
      items.find((i) => i.variantId === variantId)?.quantity ?? 0,
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const totalPriceMad = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc + getEffectiveVariantPriceMad(item.variant) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalPriceMad,
      isOpen,
      whatsappNumber,
      locale,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
    }),
    [
      items,
      totalItems,
      totalPriceMad,
      isOpen,
      whatsappNumber,
      locale,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

