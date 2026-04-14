import { getAllProducts } from "@/lib/products";
import { HomePageClient } from "./HomePageClient";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { HeroScene } from "@/components/hero/HeroScene";

export default function Home() {
  const products = getAllProducts();

  return (
    <Box>
      <HeroScene />

      <Box
        id="catalog"
        py={8}
        style={{ scrollMarginTop: "80px" }}
        overflowX="hidden"
      >
        <Container maxW="container.xl" mb={{ base: 0, md: 4 }}>
          <Heading size="2xl" textAlign="center">
            Каталог микрокомпьютеров
          </Heading>
          <Text mt={2} color="text.muted" fontSize="lg" textAlign="center">
            Компактные решения для встраиваемых систем, IoT и прототипирования
          </Text>
        </Container>
      </Box>

      {products.length > 0 ? (
        <Container maxW="container.xl">
          <HomePageClient products={products} />
        </Container>
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
