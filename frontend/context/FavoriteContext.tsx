'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product } from '@/interfaces';
import { favoriteService } from '@/services';
import { useAuth } from './AuthContext';
import { notify } from '@/helper/toast';
import { useRouter } from 'next/navigation';

interface FavoriteContextType {
  favorites: Product[];
  favoriteIds: number[];
  isFavorite: (productId: number | string) => boolean;
  toggleFavorite: (product: { id: number | string; name?: string; title?: string }) => Promise<boolean>;
  addFavorite: (productId: number | string) => Promise<void>;
  removeFavorite: (productId: number | string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isLoading: boolean;
  favoritesCount: number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteIds([]);
      return;
    }

    setIsLoading(true);
    try {
      const [favRes, idsRes] = await Promise.allSettled([
        favoriteService.getFavorites(),
        favoriteService.getFavoriteIds(),
      ]);

      if (favRes.status === 'fulfilled' && favRes.value.success && favRes.value.data) {
        setFavorites(favRes.value.data);
      }
      if (idsRes.status === 'fulfilled' && idsRes.value.success && idsRes.value.data) {
        setFavoriteIds(idsRes.value.data.map(Number));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (productId: number | string) => {
      const numericId = Number(productId);
      return favoriteIds.includes(numericId);
    },
    [favoriteIds]
  );

  const toggleFavorite = async (product: { id: number | string; name?: string; title?: string }): Promise<boolean> => {
    if (!isAuthenticated) {
      notify.info('Please log in to manage your favorites.');
      router.push('/login');
      return false;
    }

    const numericId = Number(product.id);
    const productName = product.name || product.title || 'Product';
    const wasFavorited = isFavorite(numericId);

    // Optimistic UI update
    if (wasFavorited) {
      setFavoriteIds((prev) => prev.filter((id) => id !== numericId));
      setFavorites((prev) => prev.filter((p) => Number(p.id) !== numericId));
    } else {
      setFavoriteIds((prev) => [...prev, numericId]);
    }

    try {
      const res = await favoriteService.toggleFavorite(numericId);
      if (res.success && res.data) {
        const isNowFavorited = res.data.favorited;
        if (isNowFavorited) {
          notify.success(`Added ${productName} to favorites.`);
        } else {
          notify.success(`Removed ${productName} from favorites.`);
        }
        // Refresh to ensure in-sync full product objects
        refreshFavorites();
        return isNowFavorited;
      } else {
        // Rollback on unexpected failure
        refreshFavorites();
        return wasFavorited;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update favorites';
      notify.error(message);
      // Rollback
      refreshFavorites();
      return wasFavorited;
    }
  };

  const addFavorite = async (productId: number | string) => {
    if (!isAuthenticated) {
      notify.info('Please log in to add favorites.');
      router.push('/login');
      return;
    }

    const numericId = Number(productId);
    try {
      const res = await favoriteService.addFavorite(numericId);
      if (res.success) {
        notify.success('Added to favorites.');
        refreshFavorites();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add favorite';
      notify.error(message);
    }
  };

  const removeFavorite = async (productId: number | string) => {
    if (!isAuthenticated) return;

    const numericId = Number(productId);

    // Optimistic UI update
    setFavoriteIds((prev) => prev.filter((id) => id !== numericId));
    setFavorites((prev) => prev.filter((p) => Number(p.id) !== numericId));

    try {
      const res = await favoriteService.removeFavorite(numericId);
      if (res.success) {
        notify.success('Removed from favorites.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove favorite';
      notify.error(message);
      refreshFavorites();
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        refreshFavorites,
        isLoading,
        favoritesCount: favoriteIds.length,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
