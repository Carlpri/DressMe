import { useState, useEffect, useCallback } from "react";
import type { Product } from "../types/product";

const RECENTLY_VIEWED_KEY = "dressme_recently_viewed_products";
const MAX_RECENT_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        setRecentProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recently viewed products:", e);
    }
  }, []);

  const addRecentlyViewed = useCallback((product: Product) => {
    try {
      setRecentProducts((prev) => {
        const filtered = prev.filter((p) => p.id !== product.id);
        const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to save recently viewed product:", e);
    }
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    setRecentProducts([]);
  }, []);

  return {
    recentProducts,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
