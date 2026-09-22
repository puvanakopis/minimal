'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Cart, CartItem, Product, AddToCartPayload } from '@/interfaces';
import { cartService } from '@/services';
import { useAuth } from './AuthContext';
import { notify } from '@/helper/toast';

interface CartContextType {
  cart: Cart;
  cartCount: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string) => Promise<boolean>;
  updateQuantity: (itemId: string | number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const defaultCart: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shippingCost: 0,
  total: 0,
};

const calculateCartTotals = (items: CartItem[]): Cart => {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 25000 || subtotal === 0 ? 0 : 1500;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  return {
    items,
    totalItems,
    subtotal,
    tax,
    shippingCost,
    total,
  };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'minimal_cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoading, setIsLoading] = useState(true);
  const initialSyncRef = useRef(false);

  // Helper to load guest cart from localStorage
  const loadLocalCart = useCallback((): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Helper to save guest cart to localStorage
  const saveLocalCart = (items: CartItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  };

  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await cartService.getCart();
        if (res.success && res.data) {
          setCart(res.data);
        }
      } catch (err) {
        console.error('Failed to load backend cart:', err);
      }
    } else {
      const localItems = loadLocalCart();
      setCart(calculateCartTotals(localItems));
    }
    setIsLoading(false);
  }, [isAuthenticated, loadLocalCart]);

  // Sync guest cart to backend upon login
  useEffect(() => {
    const handleAuthSync = async () => {
      if (isAuthenticated && !initialSyncRef.current) {
        initialSyncRef.current = true;
        const localItems = loadLocalCart();
        if (localItems.length > 0) {
          try {
            const syncPayload: AddToCartPayload[] = localItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
            }));
            const res = await cartService.syncCart(syncPayload);
            if (res.success && res.data) {
              setCart(res.data);
              localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
            }
          } catch (e) {
            console.error('Failed to sync guest cart to backend:', e);
          }
        } else {
          refreshCart();
        }
      } else if (!isAuthenticated) {
        initialSyncRef.current = false;
        const localItems = loadLocalCart();
        setCart(calculateCartTotals(localItems));
        setIsLoading(false);
      }
    };

    handleAuthSync();
  }, [isAuthenticated, loadLocalCart, refreshCart]);

  const addToCart = async (
    product: Product,
    quantity: number = 1,
    size?: string
  ): Promise<boolean> => {
    const selectedSize = size || 'M';
    const colorSize = `Size ${selectedSize}`;
    const productImage = product.mainImage || product.image || (product.images && product.images[0]) || '';

    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart({
          productId: Number(product.id),
          quantity,
          size: selectedSize,
        });

        if (res.success && res.data) {
          setCart(res.data);
          notify.success(`Added ${quantity} × ${product.name} (Size ${selectedSize}) to your bag.`);
          return true;
        }
      } catch (err) {
        console.error('Failed to add to cart:', err);
        notify.error('Could not add item to bag. Please try again.');
        return false;
      }
    }

    // Guest fallback
    const currentItems = loadLocalCart();
    const existingIndex = currentItems.findIndex(
      (item) =>
        item.productId === Number(product.id) &&
        (item.size || 'M') === selectedSize
    );

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity += quantity;
      updatedItems[existingIndex].subtotal =
        updatedItems[existingIndex].quantity * updatedItems[existingIndex].price;
    } else {
      const newItem: CartItem = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: Number(product.id),
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: productImage,
        size: selectedSize,
        colorSize,
        quantity,
        subtotal: product.price * quantity,
      };
      updatedItems = [newItem, ...currentItems];
    }

    saveLocalCart(updatedItems);
    setCart(calculateCartTotals(updatedItems));
    notify.success(`Added ${quantity} × ${product.name} (Size ${selectedSize}) to your bag.`);
    return true;
  };

  const updateQuantity = async (itemId: string | number, quantity: number) => {
    if (isAuthenticated && typeof itemId === 'number') {
      try {
        const res = await cartService.updateCartItem(itemId, { quantity });
        if (res.success && res.data) {
          setCart(res.data);
          return;
        }
      } catch (err) {
        console.error('Failed to update cart item:', err);
      }
    }

    // Guest or fallback
    const currentItems = loadLocalCart();
    let updatedItems: CartItem[];
    if (quantity <= 0) {
      updatedItems = currentItems.filter((i) => String(i.id) !== String(itemId));
    } else {
      updatedItems = currentItems.map((i) => {
        if (String(i.id) === String(itemId)) {
          return {
            ...i,
            quantity,
            subtotal: i.price * quantity,
          };
        }
        return i;
      });
    }

    saveLocalCart(updatedItems);
    setCart(calculateCartTotals(updatedItems));
  };

  const removeFromCart = async (itemId: string | number) => {
    const itemToRemove = cart.items.find((i) => String(i.id) === String(itemId));

    if (isAuthenticated && typeof itemId === 'number') {
      try {
        const res = await cartService.removeCartItem(itemId);
        if (res.success && res.data) {
          setCart(res.data);
          if (itemToRemove) notify.info(`Removed ${itemToRemove.name} from your bag.`);
          return;
        }
      } catch (err) {
        console.error('Failed to remove cart item:', err);
      }
    }

    const currentItems = loadLocalCart();
    const updatedItems = currentItems.filter((i) => String(i.id) !== String(itemId));
    saveLocalCart(updatedItems);
    setCart(calculateCartTotals(updatedItems));
    if (itemToRemove) notify.info(`Removed ${itemToRemove.name} from your bag.`);
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    }
    setCart(defaultCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.totalItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
