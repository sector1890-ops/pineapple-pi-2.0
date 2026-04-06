"use client";

import { useState, ChangeEvent, KeyboardEvent } from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Text,
  List,
  Button,
  Flex,
  Input,
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
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = +e.target.value.replace(/\D/g, "");
    setQuantity(onlyNumbers);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "Enter", "Escape"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <Box py={8}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        gap={8}
        maxW="container.xl"
        mx="auto"
        px={4}
      >
        {/* Изображение */}
        <Box
          width={{ base: "100%", lg: "90%" }}
          mx={{ lg: "auto" }}
          borderRadius="md"
          overflow="hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imagePath}
            alt={product.title}
            style={{ width: "100%", height: "auto", display: "block" }}
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
          <Flex
            gap={4}
            mt={4}
            width="100%"
            direction={{ base: "column", lg: "row" }}
            alignItems={{ base: "stretch", lg: "center" }}
          >
            <Text
              fontSize="sm"
              color="text.muted"
              whiteSpace="nowrap"
              alignSelf={{ base: "flex-start", lg: "center" }}
            >
              Количество
            </Text>
            <Flex
              gap={1}
              alignItems="center"
              direction="row"
              width={{ base: "100%", lg: "auto" }}
              flexWrap={{ base: "wrap", lg: "nowrap" }}
            >
              <Button
                size="sm"
                borderRadius="full"
                width="32px"
                height="32px"
                minWidth="unset"
                bg="teal.500"
                color="white"
                _hover={{ bg: "teal.600" }}
                fontSize="lg"
                fontWeight="bold"
                onClick={() => {
                  if (quantity > 1) setQuantity((prev) => prev - 1);
                }}
              >
                −
              </Button>
              <Input
                textAlign="center"
                value={quantity}
                width="0.5"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="sm"
                borderRadius="full"
                width="32px"
                height="32px"
                minWidth="unset"
                bg="teal.500"
                color="white"
                _hover={{ bg: "teal.600" }}
                fontSize="lg"
                fontWeight="bold"
                onClick={() => {
                  setQuantity((prev) => prev + 1);
                }}
              >
                +
              </Button>
            </Flex>

            <Button
              size={{ base: "xl", lg: "lg" }}
              bg="teal.500"
              color="white"
              _hover={{ bg: "teal.600" }}
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
