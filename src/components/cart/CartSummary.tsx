"use client";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

interface CartSummaryProps {
  subtotal: number;
  deliveryCost: number;
  total: number;
  onCheckout: () => void;
  isLoading: boolean;
}

/**
 * Сводка корзины с разбивкой суммы
 * Client Component для интерактивности
 */
export function CartSummary({
  subtotal,
  deliveryCost,
  total,
  onCheckout,
  isLoading,
}: CartSummaryProps) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      bg="surface"
      boxShadow="md"
    >
      <Heading size="md" mb={4}>
        Сводка заказа
      </Heading>

      <VStack gap={3} align="stretch">
        {/* Товары */}
        <Text display="flex" justifyContent="space-between">
          <span>Товары</span>
          <span>${subtotal.toFixed(2)}</span>
        </Text>

        {/* Доставка */}
        <Text display="flex" justifyContent="space-between">
          <span>Доставка</span>
          <span color={deliveryCost > 0 ? "teal.600" : "text.muted"}>
            {deliveryCost > 0 ? `$${deliveryCost.toFixed(2)}` : "Не требуется"}
          </span>
        </Text>

        {/* Разделитель */}
        <Box borderTopWidth="1px" borderColor="gray.200" />

        {/* Итого */}
        <Heading size="md" display="flex" justifyContent="space-between" alignItems="center">
          <span>Итого</span>
          <span color="teal.600">${total.toFixed(2)}</span>
        </Heading>
      </VStack>

      <Button
        mt={6}
        w="full"
        size="lg"
        bg="accent.default"
        color="white"
        _hover={{ bg: "accent.hover" }}
        _active={{ bg: "accent.active" }}
        onClick={onCheckout}
        loading={isLoading}
      >
        Оформить заказ
      </Button>
    </Box>
  );
}
