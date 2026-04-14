"use client";

import { Box, Flex, HStack, Text, Icon } from "@chakra-ui/react";
import { Check } from "lucide-react";

interface DeliveryOptionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  price: number;
}

/**
 * Чекбокс выбора доставки
 * Client Component для интерактивности
 */
export function DeliveryOption({ enabled, onToggle, price }: DeliveryOptionProps) {
  return (
    <Box
      data-testid="delivery-option-box"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg={enabled ? "bg.muted" : "transparent"}
      borderColor={enabled ? "accent.default" : "border.default"}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onToggle(!enabled)}
    >
      <Flex alignItems="center" gap={3}>
        {/* Кастомный чекбокс */}
        <Box
          w={5}
          h={5}
          borderWidth="2px"
          borderRadius="sm"
          borderColor={enabled ? "accent.default" : "text.muted"}
          bg={enabled ? "accent.default" : "transparent"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.2s"
          flexShrink={0}
        >
          {enabled && <Icon as={Check} boxSize={3.5} color="white" />}
        </Box>

        <HStack gap={1}>
          <Text>Добавить доставку</Text>
          <Text fontWeight="bold" color="accent.default">
            (+${price})
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}
