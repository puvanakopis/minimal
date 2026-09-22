'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShippingDetails, Order } from '@/interfaces';
import { orderService } from '@/services';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { notify } from '@/helper/toast';

interface CheckoutContextType {
  shippingDetails: ShippingDetails;
  setShippingDetails: React.Dispatch<React.SetStateAction<ShippingDetails>>;
  updateShippingField: (field: keyof ShippingDetails, value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  isSubmittingOrder: boolean;
  completeOrder: (customPaymentStatus?: string) => Promise<Order | null>;
}

const defaultShippingDetails: ShippingDetails = {
  fullName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  district: '',
  postalCode: '',
  country: 'Sri Lanka',
};

const CHECKOUT_SHIPPING_STORAGE_KEY = 'minimal_checkout_shipping';

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(defaultShippingDetails);
  const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Initialize shipping form from local storage or logged-in user profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CHECKOUT_SHIPPING_STORAGE_KEY);
      if (saved) {
        try {
          setShippingDetails(JSON.parse(saved));
          return;
        } catch {
          // ignore parsing error
        }
      }
    }

    if (user) {
      setShippingDetails((prev) => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: prev.email || user.email || '',
        phone: prev.phone || user.phoneNumber || '',
        streetAddress: prev.streetAddress || user.shippingAddress || '',
      }));
    }
  }, [user]);

  const updateShippingField = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails((prev) => {
      const updated = { ...prev, [field]: value };
      if (typeof window !== 'undefined') {
        localStorage.setItem(CHECKOUT_SHIPPING_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const completeOrder = async (customPaymentStatus?: string): Promise<Order | null> => {
    if (!shippingDetails.fullName || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.streetAddress || !shippingDetails.city) {
      notify.error('Please fill in all required shipping fields');
      return null;
    }

    if (cart.items.length === 0) {
      notify.error('Your shopping bag is empty');
      return null;
    }

    setIsSubmittingOrder(true);
    try {
      const itemsPayload = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
      }));

      const res = await orderService.createOrder({
        shippingDetails,
        paymentMethod,
        paymentStatus: customPaymentStatus || (paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID'),
        items: itemsPayload,
      });

      if (res.success && res.data) {
        notify.success('Order completed successfully!');
        await clearCart();
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CHECKOUT_SHIPPING_STORAGE_KEY);
        }
        return res.data;
      } else {
        notify.error(res.message || 'Failed to place order');
        return null;
      }
    } catch (err: any) {
      notify.apiError(err, 'Failed to place order');
      return null;
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        shippingDetails,
        setShippingDetails,
        updateShippingField,
        paymentMethod,
        setPaymentMethod,
        isSubmittingOrder,
        completeOrder,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
