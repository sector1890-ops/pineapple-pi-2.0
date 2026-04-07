"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { DeliveryOption } from "@/components/cart/DeliveryOption";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { ShoppingBag } from "lucide-react";
import { createToaster } from "@chakra-ui/react";

const toaster = createToaster({
  placement: "top-end",
  duration: 3000,
  gap: 3,
});

/**
 * Client Component для страницы корзины
 * Работает с Zustand stores и обрабатывает оформление заказа
 */
export function CartPageClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Чтение состояния корзины
  const items = useCartStore((state) => state.items);
  const delivery = useCartStore((state) => state.delivery);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleDelivery = useCartStore((state) => state.toggleDelivery);

  // Геттеры
  const subtotal = useCartStore((state) => state.getSubtotal());
  const deliveryCost = useCartStore((state) => state.getDeliveryCost());
  const total = useCartStore((state) => state.getTotal());

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    toaster.create({
      title: "Товар удалён из корзины",
      type: "info",
    });
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toaster.create({
        title: "Корзина пуста",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
        })),
        delivery,
        subtotal,
        deliveryCost,
        total,
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        toaster.create({
          title: `Заказ оформлен! ID: ${result.orderId}`,
          type: "success",
        });
        router.push("/");
      } else {
        toaster.create({
          title: result.message || "Ошибка оформления заказа",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Ошибка оформления заказа",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Пустая корзина
  if (items.length === 0) {
    return (
      <Container maxW="container.xl">
        <EmptyState
          title="Корзина пуста"
          description="Добавляйте товары из каталога, чтобы оформить заказ"
          actionLabel="Перейти в каталог"
          actionHref="/"
          icon={ShoppingBag}
        />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
        {/* Список товаров */}
        <Box gridColumn={{ lg: "span 2" }}>
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}

          {/* Выбор доставки */}
          <Box mt={6}>
            <DeliveryOption
              enabled={delivery}
              onToggle={toggleDelivery}
              price={5}
            />
          </Box>
        </Box>

        {/* Сводка */}
        <Box>
          <CartSummary
            subtotal={subtotal}
            deliveryCost={deliveryCost}
            total={total}
            onCheckout={handleCheckout}
            isLoading={isLoading}
          />
        </Box>
      </SimpleGrid>
    </Container>
  );
}
