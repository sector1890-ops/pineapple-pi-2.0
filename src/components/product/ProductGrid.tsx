import { SimpleGrid, Container } from "@chakra-ui/react";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export function ProductGrid({
  products,
  favorites,
  onToggleFavorite,
  onAddToCart,
}: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
