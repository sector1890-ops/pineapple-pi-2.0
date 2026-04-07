"use client";

import { useFavoriteStore } from "@/stores/favoriteStore";
import { useCartStore } from "@/stores/cartStore";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container, Text } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { toaster } from "@/lib/toaster";

interface FavoritesPageClientProps {
  allProducts: Product[];
}

/**
 * Client Component для страницы избранного
 * Работает с Zustand stores и обрабатывает интерактив
 */
export function FavoritesPageClient({ allProducts }: FavoritesPageClientProps) {
  const favorites = useFavoriteStore((state) => state.items);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const addItem = useCartStore((state) => state.addItem);

  // Фильтруем товары по избранным
  const favoriteProducts = allProducts.filter((p) =>
    favorites.includes(p.id)
  );

  const handleToggleFavorite = (id: string) => {
    const wasFavorite = favorites.includes(id);
    toggleFavorite(id);
    toaster.create({
      title: wasFavorite
        ? "Удалено из избранного"
        : "Добавлено в избранное",
      type: "success",
    });
  };

  const handleAddToCart = (id: string) => {
    const product = allProducts.find((p) => p.id === id);
    if (product) {
      addItem(product);
      toaster.create({
        title: "Товар добавлен в корзину",
        type: "success",
      });
    }
  };

  return (
    <>
      {favoriteProducts.length > 0 ? (
        <>
          <Container maxW="container.xl" mb={4}>
            <Text color="text.muted" fontSize="lg">
              Выбранные товары ({favoriteProducts.length})
            </Text>
          </Container>
          <ProductGrid
            products={favoriteProducts}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        </>
      ) : (
        <Container maxW="container.xl">
          <EmptyState
            title="Список избранного пуст"
            description="Добавляйте товары в избранное, чтобы быстро найти их позже"
            actionLabel="Перейти в каталог"
            actionHref="/"
            icon={Heart}
          />
        </Container>
      )}
    </>
  );
}
