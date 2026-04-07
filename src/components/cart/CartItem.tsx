"use client";

import Image from "next/image";
import { Box, Flex, Text, IconButton, HStack } from "@chakra-ui/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/product";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

/**
 * Элемент корзины с управлением количеством
 * Client Component для интерактивности
 */
export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;

  const handleIncrement = () => {
    if (quantity < 99) {
      onUpdateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  return (
    <Box>
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 4, lg: 6 }}
        py={4}
        alignItems={{ base: "flex-start", lg: "center" }}
      >
        {/* Миниатюра изображения */}
        <Box
          position="relative"
          width={{ base: "100%", md: "120px" }}
          height={{ base: "120px", md: "120px" }}
          borderRadius="md"
          overflow="hidden"
          flexShrink={0}
        >
          <Image
            src={product.imagePath}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 120px"
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Информация о товаре */}
        <Flex
          flex={1}
          direction="column"
          gap={2}
          width="full"
        >
          <Text fontSize="lg" fontWeight="bold" lineHeight="tight">
            {product.title}
          </Text>

          <Text fontSize="sm" color="text.muted" lineClamp={2}>
            {product.shortDescription}
          </Text>

          {/* Управление количеством и удаление */}
          <HStack justify="space-between" alignItems="center" mt={2}>
            {/* Контрол количества */}
            <HStack gap={2}>
              <IconButton
                aria-label="Уменьшить количество"
                size="sm"
                variant="outline"
                borderRadius="full"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </IconButton>

              <Text fontSize="md" fontWeight="bold" minW="30px" textAlign="center">
                {quantity}
              </Text>

              <IconButton
                aria-label="Увеличить количество"
                size="sm"
                variant="outline"
                borderRadius="full"
                onClick={handleIncrement}
                disabled={quantity >= 99}
              >
                <Plus size={14} />
              </IconButton>
            </HStack>

            {/* Цена */}
            <Text fontSize="lg" fontWeight="bold" color="teal.600">
              ${(product.price * quantity).toFixed(2)}
            </Text>

            {/* Удалить */}
            <IconButton
              aria-label="Удалить из корзины"
              size="sm"
              variant="ghost"
              color="red.500"
              borderRadius="full"
              onClick={handleRemove}
              _hover={{ bg: "red.50", color: "red.600" }}
            >
              <Trash2 size={16} />
            </IconButton>
          </HStack>
        </Flex>
      </Flex>

      {/* Разделитель */}
      <Box borderBottomWidth="1px" borderColor="gray.200" />
    </Box>
  );
}
