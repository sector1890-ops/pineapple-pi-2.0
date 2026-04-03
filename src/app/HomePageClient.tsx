"use client";

import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";
import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  duration: 3000,
  gap: 3,
});

interface HomePageClientProps {
  products: Product[];
}

export function HomePageClient({ products }: HomePageClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const favorites = useFavoriteStore((state) => state.items);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      addItem(product);
      toaster.create({
        title: "Товар добавлен в корзину",
        type: "success",
      });
    }
  };

  const handleToggleFavorite = (id: string) => {
    const wasFavorite = isFavorite(id);
    toggleFavorite(id);
    toaster.create({
      title: wasFavorite
        ? "Удалено из избранного"
        : "Добавлено в избранное",
      type: wasFavorite ? "info" : "success",
    });
  };

  return (
    <ProductGrid
      products={products}
      favorites={favorites}
      onToggleFavorite={handleToggleFavorite}
      onAddToCart={handleAddToCart}
    />
  );
}
