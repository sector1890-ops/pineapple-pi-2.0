"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Text, Button, Container } from "@chakra-ui/react";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "pineapple-cookie-consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setIsVisible(false);
  };

  // Не рендерим ничего до монтирования (избегаем гидратации)
  if (!isMounted) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="bg.default"
      borderTopWidth="1px"
      borderColor="border.default"
      shadow="lg"
      zIndex="toast"
      py={4}
    >
      <Container maxW="container.xl">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap={4}
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <Flex alignItems="center" gap={3} flex={1}>
            <Cookie size={24} color="var(--chakra-colors-teal-500)" />
            <Text fontSize="sm" color="text.muted">
              Мы используем файлы cookie для улучшения вашего опыта на сайте.
              Продолжая использовать сайт, вы соглашаетесь с нашей политикой
              использования cookie.
            </Text>
          </Flex>
          <Flex gap={2} flexShrink={0}>
            <Button
              size="sm"
              variant="solid"
              bg="teal.500"
              color="white"
              _hover={{ bg: "teal.600" }}
              onClick={handleAccept}
            >
              Принять
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
