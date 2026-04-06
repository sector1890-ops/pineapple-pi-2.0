"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  Stack,
  HStack,
  Text,
  Badge,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { Monitor } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О компании" },
  { href: "/contact", label: "Контакты" },
  { href: "/favorites", label: "Избранное" },
  { href: "/cart", label: "Корзина" },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems);
  const favoritesCount = useFavoriteStore((state) => state.count);

  const [hydrated, setHydrated] = useState(false);
  // Для анимации: при открытии сначала закрытое состояние, потом открытое
  const [panelOpen, setPanelOpen] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHydrated(true);
  }, []);

  // При изменении open: сначала false, потом true через setTimeout
  useEffect(() => {
    if (open) {
      setPanelOpen(false);
      // setTimeout(0) — макрозадача, выполняется после paint
      const timer = setTimeout(() => setPanelOpen(true), 0);
      return () => clearTimeout(timer);
    } else {
      setPanelOpen(false);
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const displayCartCount = hydrated ? totalItems : 0;
  const displayFavoritesCount = hydrated ? favoritesCount : 0;

  const isActive = (href: string) => {
    if (!hydrated) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex="overlay"
      onClick={onClose}
      bg="blackAlpha.500"
      pointerEvents={open ? "auto" : "none"}
      style={{
        opacity: open ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <Box
        position="absolute"
        top={0}
        right={0}
        w="sm"
        maxW="80vw"
        h="100dvh"
        bg="bg.panel"
        boxShadow="lg"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        display="flex"
        flexDirection="column"
        style={{
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <Flex
          alignItems="center"
          gap={2}
          px={3}
          pt={6}
          pb={4}
        >
          <Monitor size={20} color="var(--chakra-colors-teal-500)" />
          <Text fontWeight="bold" color="teal.500">
            Pineapple Pi
          </Text>
          <Box flex={1} />
          <IconButton
            aria-label="Закрыть"
            variant="ghost"
            size="sm"
            minW="auto"
            w={8}
            h={8}
            p={0}
            onClick={onClose}
          >
            ✕
          </IconButton>
        </Flex>
        {/* Navigation */}
        <Stack gap={1} px={3} py={2} overflow="auto" flex={1}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                width="full"
                color={isActive(link.href) ? "teal.500" : "text.default"}
                fontWeight={isActive(link.href) ? "semibold" : "medium"}
                onClick={onClose}
                py={3}
              >
                {link.href === "/cart" && (
                  <HStack gap={2} flex={1} justifyContent="space-between">
                    <Text>Корзина</Text>
                    {displayCartCount > 0 && (
                      <Badge bg="teal.500" color="white" borderRadius="full" px={2}>
                        {displayCartCount}
                      </Badge>
                    )}
                  </HStack>
                )}
                {link.href === "/favorites" && (
                  <HStack gap={2} flex={1} justifyContent="space-between">
                    <Text>Избранное</Text>
                    {displayFavoritesCount > 0 && (
                      <Badge bg="red.500" color="white" borderRadius="full" px={2}>
                        {displayFavoritesCount}
                      </Badge>
                    )}
                  </HStack>
                )}
                {link.href !== "/cart" && link.href !== "/favorites" && (
                  link.label
                )}
              </Button>
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export { navLinks };
