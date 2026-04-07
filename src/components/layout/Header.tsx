"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Badge,
  Text,
  Container,
} from "@chakra-ui/react";
import { Menu, Monitor } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О компании" },
  { href: "/contact", label: "Контакты" },
  { href: "/favorites", label: "Избранное" },
  { href: "/cart", label: "Корзина" },
];

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const favoritesCount = useFavoriteStore((state) => state.getCount());

  // Hydration guard: синхронизация SSR/CSR
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHydrated(true);
  }, []);
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
      as="header"
      bg="bg.default"
      borderBottomWidth="1px"
      borderColor="border.default"
      position="sticky"
      top={0}
      zIndex="sticky"
      shadow="sm"
    >
      <Container maxW="container.xl" py={{ base: 2, md: 4 }}>
        <Flex alignItems="center" justifyContent="space-between" gap={2}>
          {/* Логотип */}
          <Link href="/" passHref>
            <HStack gap={1} cursor="pointer" flexShrink={0}>
              <Monitor size={24} color="var(--chakra-colors-teal-500)" />
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                color="teal.500"
                letterSpacing="tight"
                whiteSpace="nowrap"
              >
                Pineapple Pi
              </Text>
            </HStack>
          </Link>

          {/* Десктопная навигация (lg+) */}
          <HStack gap={6} display={{ base: "none", md: "flex" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <Text
                  color={isActive(link.href) ? "teal.500" : "text.default"}
                  fontWeight={isActive(link.href) ? "semibold" : "medium"}
                  _hover={{ color: "teal.500" }}
                  transition="color 0.2s"
                  cursor="pointer"
                >
                  {link.label}
                  {link.href === "/cart" && displayCartCount > 0 && (
                    <Badge
                      ml={1}
                      bg="red.500"
                      color="white"
                      fontSize="xs"
                      px={1.5}
                      py={0.5}
                      borderRadius="full"
                    >
                      {displayCartCount}
                    </Badge>
                  )}
                  {link.href === "/favorites" && displayFavoritesCount > 0 && (
                    <Badge
                      ml={1}
                      colorScheme="red"
                      bg="red.500"
                      color="white"
                      fontSize="xs"
                      px={1.5}
                      py={0.5}
                      borderRadius="full"
                    >
                      {displayFavoritesCount}
                    </Badge>
                  )}
                </Text>
              </Link>
            ))}
          </HStack>
        
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Меню"
            variant="ghost"
            minW="auto"
            w={9}
            h={9}
            p={0}
            flexShrink={0}
            onClick={onMenuClick}
          >
            <Menu size={22} />
          </IconButton>
        </Flex>
      </Container>
    </Box>
  );
}

export { navLinks };
