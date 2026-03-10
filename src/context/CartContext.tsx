import { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images?: Array<{ path?: string; filename?: string }>;
  sku?: string;
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  loading: boolean;
  itemCount: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const res = await cartAPI.getCart();
      const data = res.data?.data;
      setItems(data?.items || []);
      setTotalPrice(data?.totalPrice ?? 0);
    } catch (err) {
      console.error('Failed to load cart', err);
      setItems([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, quantity = 1) => {
    await cartAPI.addToCart(productId, quantity);
    await refreshCart();
  };

  const removeItem = async (productId: string) => {
    await cartAPI.removeFromCart(productId);
    await refreshCart();
  };

  const updateItem = async (productId: string, quantity: number) => {
    await cartAPI.updateCart(productId, quantity);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setItems([]);
    setTotalPrice(0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
      setTotalPrice(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        loading,
        itemCount,
        addItem,
        removeItem,
        updateItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
