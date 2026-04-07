import { getAllProducts } from "@/lib/products";
import { FavoritesPageClient } from "./FavoritesPageClient";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

/**
 * Страница избранного (Server Component)
 * Загружает данные и передаёт в Client Component
 */
export default function FavoritesPage() {
  const allProducts = getAllProducts();

  return (
    <Box py={8}>
      <Container maxW="container.xl" mb={8}>
        <Heading size="2xl" textAlign={{ base: "center", md: "left" }}>
          Избранное
        </Heading>
        <Text mt={2} color="text.muted" fontSize="lg">
          Здесь будут ваши избранные товары
        </Text>
      </Container>

      <FavoritesPageClient allProducts={allProducts} />
    </Box>
  );
}
