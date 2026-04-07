"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { ContactForm } from "@/components/ui/ContactForm";
import { toaster } from "@/lib/toaster";

/**
 * Страница контактов (Client Component)
 * Форма обратной связи с POST /api/feedback
 */
export default function ContactPage() {
  const handleSubmit = async (data: { name: string; email: string; message: string }): Promise<boolean> => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        if (result.errors) {
          toaster.create({
            title: "Ошибка валидации",
            description: result.errors.join(", "),
            type: "error",
          });
        }
        return false;
      }
    } catch {
      toaster.create({
        title: "Ошибка сервера",
        type: "error",
      });
      return false;
    }
  };

  return (
    <Box py={8}>
      <Container maxW="container.md">
        <VStack gap={2} mb={8} align="stretch">
          <Heading size="2xl" textAlign={{ base: "center", md: "left" }}>
            Контакты
          </Heading>
          <Text color="text.muted" fontSize="lg">
            Свяжитесь с нами по любым вопросам
          </Text>
        </VStack>

        <ContactForm onSubmit={handleSubmit} />
      </Container>
    </Box>
  );
}
