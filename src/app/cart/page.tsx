import { CartPageClient } from "./CartPageClient";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

/**
 * Страница корзины (Server Component)
 */
export default function CartPage() {
  return (
    <Box py={8}>
      <Container maxW="container.xl" mb={8}>
        <Heading size="2xl" textAlign={{ base: "center", md: "left" }}>
          Корзина
        </Heading>
        <Text mt={2} color="text.muted" fontSize="lg">
          Управляйте товарами и оформите заказ
        </Text>
      </Container>

      <CartPageClient />
    </Box>
  );
}
