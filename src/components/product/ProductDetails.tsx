"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  List,
  Button,
  Flex,
  NumberInput,
} from "@chakra-ui/react";
import type { Product } from "@/types/product";
import { FavoriteIcon } from "./FavoriteIcon";

interface ProductDetailsProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string, quantity: number) => void;
}

export function ProductDetails({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState("1");

  const handleAddToCart = () => {
    onAddToCart(product.id, parseInt(quantity, 10) || 1);
  };

  return (
    <Box py={8}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} maxW="container.xl" mx="auto" px={4}>
        {/* Изображение */}
        <Box position="relative" width="100%" pt="75%" bg="gray.100" borderRadius="md" overflow="hidden">
          <Image
            src={product.imagePath}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>

        {/* Информация о товаре */}
        <VStack align="stretch" gap={6}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <VStack align="stretch" gap={2} flex={1}>
              <Heading size="2xl" lineHeight="tight">
                {product.title}
              </Heading>
              <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                {product.priceFormatted}
              </Text>
            </VStack>

            <FavoriteIcon
              isFavorite={isFavorite}
              onToggle={() => onToggleFavorite(product.id)}
              size="lg"
            />
          </Flex>

          {/* Спецификации */}
          <VStack align="stretch" gap={3}>
            <Heading size="md">Характеристики</Heading>
            <List.Root variant="plain">
              {product.specifications.map((spec, index) => (
                <List.Item key={index} py={1}>
                  <Text fontSize="sm">{spec}</Text>
                </List.Item>
              ))}
            </List.Root>
          </VStack>

          {/* Количество и кнопка */}
          <Flex gap={4} alignItems="center" mt={4}>
            <VStack align="flex-start" gap={1}>
              <Text fontSize="sm" color="text.muted">
                Количество
              </Text>
              <NumberInput.Root
                value={quantity}
                onValueChange={(details) => setQuantity(details.value)}
                min={1}
                max={99}
                width="160px"
              >
                <NumberInput.Control>
                  <NumberInput.DecrementTrigger />
                  <NumberInput.Input />
                  <NumberInput.IncrementTrigger />
                </NumberInput.Control>
              </NumberInput.Root>
            </VStack>

            <Button
              size="lg"
              bg="teal.500"
              color="white"
              _hover={{ bg: "teal.600" }}
              flex={1}
              onClick={handleAddToCart}
            >
              В корзину
            </Button>
          </Flex>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}
