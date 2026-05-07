import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../data';

export interface CartItem extends Product { quantity: number; }

interface CartCtx {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (p: Product) => void;
  updateQty: (id: string, d: number) => void;
  removeFromCart: (id: string) => void;
  setIsCartOpen: (v: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const Ctx = createContext<CartCtx>(null!);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((p: Product) => {
    setCart(prev => {
      const hit = prev.find(i => i.id === p.id);
      setIsCartOpen(true);
      return hit
        ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...p, quantity: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: string, d: number) =>
    setCart(p => p.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i)), []);

  const removeFromCart = useCallback((id: string) =>
    setCart(p => p.filter(i => i.id !== id)), []);

  return (
    <Ctx.Provider value={{
      cart, isCartOpen, addToCart, updateQty, removeFromCart, setIsCartOpen,
      cartTotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      cartCount:  cart.reduce((s, i) => s + i.quantity, 0),
    }}>
      {children}
    </Ctx.Provider>
  );
}
