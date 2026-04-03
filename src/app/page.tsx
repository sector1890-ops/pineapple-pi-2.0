import { getAllProducts } from "@/lib/products";
import { HomePageClient } from "./HomePageClient";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  const products = getAllProducts();

  return (
    <Box py={8}>
      <Container maxW="container.xl" mb={8}>
        <Heading size="2xl" textAlign={{ base: "center", md: "left" }}>
          Каталог микрокомпьютеров
        </Heading>
        <Text mt={2} color="text.muted" fontSize="lg">
          Компактные решения для встраиваемых систем, IoT и прототипирования
        </Text>
      </Container>

      {products.length > 0 ? (
        <HomePageClient products={products} />
      ) : (
        <Container maxW="container.xl" py={16}>
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              Товары пока не добавлены
            </Heading>
            <Text color="text.muted">
              Мы работаем над наполнением каталога. Загляните позже!
            </Text>
          </Box>
        </Container>
      )}
    </Box>
  );
}
