"use client";

import { useState } from "react";
import { ProductDetails } from "@/components/product/ProductDetails";
import type { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
import { createToaster } from "@chakra-ui/react";

const toaster = createToaster({
  placement: "top-end",
  duration: 3000,
  gap: 3,
});

interface ProductPageClientProps {
  product: Product;
}

/**
 * Клиентский компонент страницы товара
 * Подключает cartStore и favoriteStore для интерактива
 * 
 * Используем useState с инициализацией в callback для предотвращения 
 * гидратационных ошибок — до монтирования клиента показываем 
 * дефолтные значения (isFavorite = false)
 */
export function ProductPageClient({ product }: ProductPageClientProps) {
  const [mounted] = useState(() => {
    // Проверяем, что код выполняется на клиенте
    if (typeof window !== "undefined") {
      return true;
    }
    return false;
  });

  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  const handleAddToCart = (id: string, quantity: number) => {
    const productData = { ...product, id };
    // Добавляем товар указанное количество раз
    for (let i = 0; i < quantity; i++) {
      addItem(productData);
    }
    toaster.create({
      title: `${quantity > 1 ? `Товары (${quantity} шт.)` : "Товар"} добавлен в корзину`,
      type: "success",
    });
  };

  const handleToggleFavorite = (id: string) => {
    const checkFavorite = mounted ? isFavorite(id) : false;
    toggleFavorite(id);
    toaster.create({
      title: checkFavorite ? "Удалено из избранного" : "Добавлено в избранное",
      type: checkFavorite ? "info" : "success",
    });
  };

  // До завершения гидратации показываем дефолтное состояние
  const favoriteStatus = mounted ? isFavorite(product.id) : false;

  return (
    <ProductDetails
      product={product}
      isFavorite={favoriteStatus}
      onToggleFavorite={handleToggleFavorite}
      onAddToCart={handleAddToCart}
    />
  );
}
