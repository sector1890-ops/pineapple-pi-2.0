"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { toaster } from "@/lib/toaster";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; message: string }) => Promise<boolean>;
}

/**
 * Форма обратной связи с валидацией
 * Client Component для интерактивности
 */
export function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      newErrors.email = "Введите корректный email";
    }

    if (message.trim().length < 10) {
      newErrors.message = "Сообщение должно содержать минимум 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (success) {
        toaster.create({
          title: "Сообщение отправлено!",
          type: "success",
        });
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
        setIsSubmitted(true);
      } else {
        toaster.create({
          title: "Ошибка отправки",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Ошибка отправки",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <VStack gap={6} align="stretch" py={8}>
        <Heading size="md">Спасибо за обращение!</Heading>
        <Text color="text.muted">
          Мы получили ваше сообщение и ответим в ближайшее время.
        </Text>
        <Button
          w="fit-content"
          bg="accent.default"
          color="white"
          _hover={{ bg: "accent.hover" }}
          _active={{ bg: "accent.active" }}
          onClick={() => {
            setIsSubmitted(false);
          }}
        >
          Отправить ещё
        </Button>
      </VStack>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit} py={8}>
      <VStack gap={5} align="stretch">
        {/* Поле: Имя */}
        <VStack gap={2} align="stretch">
          <Text fontWeight="medium">Имя</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            bg={errors.name ? "red.50" : "bg.surface"}
            borderColor={errors.name ? "red.500" : "border"}
            _focus={{
              borderColor: errors.name ? "red.500" : "teal.500",
              boxShadow: errors.name ? "0 0 0 1px var(--chakra-colors-red-500)" : "0 0 0 1px var(--chakra-colors-teal-500)",
            }}
          />
          {errors.name && (
            <Text fontSize="sm" color="red.500">
              {errors.name}
            </Text>
          )}
        </VStack>

        {/* Поле: Email */}
        <VStack gap={2} align="stretch">
          <Text fontWeight="medium">Email</Text>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            bg={errors.email ? "red.50" : "bg.surface"}
            borderColor={errors.email ? "red.500" : "border"}
            _focus={{
              borderColor: errors.email ? "red.500" : "teal.500",
              boxShadow: errors.email ? "0 0 0 1px var(--chakra-colors-red-500)" : "0 0 0 1px var(--chakra-colors-teal-500)",
            }}
          />
          {errors.email && (
            <Text fontSize="sm" color="red.500">
              {errors.email}
            </Text>
          )}
        </VStack>

        {/* Поле: Сообщение */}
        <VStack gap={2} align="stretch">
          <Text fontWeight="medium">Сообщение</Text>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишите ваше сообщение..."
            rows={5}
            bg={errors.message ? "red.50" : "bg.surface"}
            borderColor={errors.message ? "red.500" : "border"}
            _focus={{
              borderColor: errors.message ? "red.500" : "teal.500",
              boxShadow: errors.message ? "0 0 0 1px var(--chakra-colors-red-500)" : "0 0 0 1px var(--chakra-colors-teal-500)",
            }}
          />
          {errors.message && (
            <Text fontSize="sm" color="red.500">
              {errors.message}
            </Text>
          )}
        </VStack>

        {/* Кнопка отправки */}
        <Button
          type="submit"
          w="fit-content"
          size="lg"
          bg="accent.default"
          color="white"
          _hover={{ bg: "accent.hover" }}
          _active={{ bg: "accent.active" }}
          loading={isSubmitting}
          mt={2}
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </Button>
      </VStack>
    </Box>
  );
}
