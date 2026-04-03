import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Card,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { FavoriteIcon } from "./FavoriteIcon";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Проверяем, что клик не был по кнопкам
    const target = e.target as HTMLElement;
    const isButton = target.closest("button");
    if (!isButton) {
      // Переход на страницу товара происходит через Link
    }
  };

  return (
    <Card.Root
      overflow="hidden"
      transition="shadow 0.2s, transform 0.2s"
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
      onClick={handleCardClick}
    >
      <Link href={`/product/${product.slug}`} passHref>
        <Box position="relative" width="100%" pt="75%" bg="gray.100" cursor="pointer">
          <Image
            src={product.imagePath}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
          {/* Позиция для FavoriteIcon */}
          <Box
            position="absolute"
            top={2}
            right={2}
            zIndex={1}
            onClick={(e) => e.preventDefault()}
          >
            <FavoriteIcon
              isFavorite={isFavorite}
              onToggle={() => onToggleFavorite(product.id)}
              size="sm"
            />
          </Box>
        </Box>
      </Link>

      <Card.Body gap={2}>
        <Link href={`/product/${product.slug}`} passHref>
          <Text
            fontSize="lg"
            fontWeight="bold"
            _hover={{ color: "teal.500" }}
            cursor="pointer"
            lineHeight="tight"
          >
            {product.title}
          </Text>
        </Link>

        <Text fontSize="sm" color="text.muted" lineClamp={2}>
          {product.shortDescription}
        </Text>

        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Text fontSize="lg" fontWeight="bold" color="teal.600">
            {product.priceFormatted}
          </Text>

          <IconButton
            aria-label="Добавить в корзину"
            variant="solid"
            bg="teal.500"
            color="white"
            size="sm"
            _hover={{ bg: "teal.600" }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
          >
            <ShoppingCart size={16} />
          </IconButton>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
