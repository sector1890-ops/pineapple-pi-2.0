import { VStack, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { Package2 } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Компонент пустого состояния для страниц
 * Отображается когда нет данных (корзина, избранное, каталог)
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon: IconComponent = Package2,
}: EmptyStateProps) {
  return (
    <VStack
      justify="center"
      minH="400px"
      gap={6}
      py={16}
      textAlign="center"
    >
      <Icon
        as={IconComponent}
        boxSize="64px"
        color="gray.400"
      />
      <Heading size="xl">{title}</Heading>
      <Text color="gray.600" fontSize="lg" maxW="md">
        {description}
      </Text>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button
            bg="accent.default"
            color="white"
            size="lg"
            mt={4}
            textDecoration="none"
            _hover={{
              bg: "accent.hover",
              textDecoration: "none",
            }}
          >
            {actionLabel}
          </Button>
        </Link>
      )}
    </VStack>
  );
}
