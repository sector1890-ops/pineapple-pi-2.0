"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Badge,
  Text,
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerTrigger,
  DrawerCloseTrigger,
  Button,
  Stack,
  Container,
} from "@chakra-ui/react";
import { Menu, ShoppingCart, Heart, Monitor } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О компании" },
  { href: "/contact", label: "Контакты" },
  { href: "/favorites", label: "Избранное" },
  { href: "/cart", label: "Корзина" },
];

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalItems = useCartStore((state) => state.totalItems);
  const favoritesCount = useFavoriteStore((state) => state.count);

  const isActive = (href: string) => {
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
      <Container maxW="container.xl" py={4}>
        <Flex alignItems="center" justifyContent="space-between">
          {/* Логотип */}
          <Link href="/" passHref>
            <HStack gap={2} cursor="pointer">
              <Monitor size={28} color="var(--chakra-colors-teal-500)" />
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="teal.500"
                letterSpacing="tight"
              >
                Pineapple Pi
              </Text>
            </HStack>
          </Link>

          {/* Десктопная навигация (lg+) */}
          <HStack gap={6} display={{ base: "none", lg: "flex" }}>
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
                  {link.href === "/cart" && totalItems > 0 && (
                    <Badge
                      ml={1}
                      colorScheme="teal"
                      bg="teal.500"
                      color="white"
                      fontSize="xs"
                      px={1.5}
                      py={0.5}
                      borderRadius="full"
                    >
                      {totalItems}
                    </Badge>
                  )}
                  {link.href === "/favorites" && favoritesCount > 0 && (
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
                      {favoritesCount}
                    </Badge>
                  )}
                </Text>
              </Link>
            ))}
          </HStack>

          {/* Мобильные иконки + гамбургер */}
          <HStack gap={2} display={{ base: "flex", lg: "none" }}>
            <Link href="/favorites" passHref>
              <Box position="relative">
                <IconButton
                  aria-label="Избранное"
                  variant="ghost"
                  size="sm"
                >
                  <Heart size={20} />
                </IconButton>
                {favoritesCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="red.500"
                    color="white"
                    fontSize="xs"
                    minW={4}
                    h={4}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={1}
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Box>
            </Link>

            <Link href="/cart" passHref>
              <Box position="relative">
                <IconButton
                  aria-label="Корзина"
                  variant="ghost"
                  size="sm"
                >
                  <ShoppingCart size={20} />
                </IconButton>
                {totalItems > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="teal.500"
                    color="white"
                    fontSize="xs"
                    minW={4}
                    h={4}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={1}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Box>
            </Link>

            {/* Гамбургер-меню */}
            <DrawerRoot
              open={drawerOpen}
              onOpenChange={(e) => setDrawerOpen(e.open)}
              placement="end"
            >
              <DrawerTrigger asChild>
                <IconButton
                  aria-label="Меню"
                  variant="ghost"
                  size="sm"
                >
                  <Menu size={20} />
                </IconButton>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>Меню</DrawerHeader>
                <DrawerCloseTrigger />
                <DrawerBody>
                  <Stack gap={2}>
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} passHref>
                        <Button
                          variant="ghost"
                          justifyContent="flex-start"
                          width="full"
                          color={
                            isActive(link.href) ? "teal.500" : "text.default"
                          }
                          onClick={() => setDrawerOpen(false)}
                        >
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </Stack>
                </DrawerBody>
              </DrawerContent>
            </DrawerRoot>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
