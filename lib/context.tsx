'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AppData } from '@/lib/types';
import {
  loadAppData,
  saveAppData,
  getCart,
  addToCart as addItem,
  updateCartQuantity as updateQty,
  removeFromCart as removeItem,
  clearCart as clear,
} from '@/lib/storage';
import type { CartItem } from '@/lib/types';

interface DataContextType {
  data: AppData | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  updateData: (newData: AppData) => void;
}

const DataContext = createContext<DataContextType>({
  data: null,
  loading: true,
  refreshData: async () => {},
  updateData: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const appData = await loadAppData();
      setData(appData);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback((newData: AppData) => {
    saveAppData(newData);
    setData(newData);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DataContext.Provider value={{ data, loading, refreshData, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
    const handler = () => setCart(getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart: (item, qty) => setCart(addItem(item, qty)),
        updateQuantity: (id, qty) => setCart(updateQty(id, qty)),
        removeFromCart: (id) => setCart(removeItem(id)),
        clearCart: () => {
          clear();
          setCart([]);
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
