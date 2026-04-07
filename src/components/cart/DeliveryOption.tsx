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
      bg={enabled ? "teal.50" : "transparent"}
      borderColor={enabled ? "teal.500" : "gray.200"}
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
          borderColor={enabled ? "teal.500" : "gray.300"}
          bg={enabled ? "teal.500" : "transparent"}
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
          <Text fontWeight="bold" color="teal.600">
            (+${price})
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}
