import Link from "next/link";
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Text,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { Monitor, Mail, Phone, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "О компании" },
  { href: "/contact", label: "Контакты" },
  { href: "/favorites", label: "Избранное" },
  { href: "/cart", label: "Корзина" },
];

const contacts = [
  { icon: Mail, label: "Email", value: "info@pineapplepi.dev" },
  { icon: Phone, label: "Телефон", value: "+7 (800) 123-45-67" },
  { icon: MapPin, label: "Адрес", value: "г. Москва, ул. Примерная, д. 42" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="bg.muted"
      borderTopWidth="1px"
      borderColor="border.default"
      mt="auto"
    >
      <Container maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {/* Навигация */}
          <VStack align="flex-start" gap={3}>
            <HStack gap={2}>
              <Monitor size={20} color="var(--chakra-colors-teal-500)" />
              <Heading size="sm" color="teal.500">
                Pineapple Pi
              </Heading>
            </HStack>
            <VStack align="flex-start" gap={2}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <Text
                    color="text.muted"
                    _hover={{ color: "teal.500" }}
                    transition="color 0.2s"
                    cursor="pointer"
                    fontSize="sm"
                  >
                    {link.label}
                  </Text>
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Контакты */}
          <VStack align="flex-start" gap={3}>
            <Heading size="sm">Контакты</Heading>
            <VStack align="flex-start" gap={3}>
              {contacts.map((contact) => (
                <HStack key={contact.label} gap={2}>
                  <contact.icon size={16} color="var(--chakra-colors-teal-500)" />
                  <VStack align="flex-start" gap={0}>
                    <Text fontSize="xs" color="text.muted">
                      {contact.label}
                    </Text>
                    <Text fontSize="sm">{contact.value}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>

          {/* Копирайт */}
          <VStack align="flex-start" gap={3}>
            <Heading size="sm">О проекте</Heading>
            <Text fontSize="sm" color="text.muted">
              Pineapple Pi — каталог микрокомпьютеров для встраиваемых систем,
              IoT и прототипирования. Компактные решения для разработчиков и
              инженеров.
            </Text>
          </VStack>
        </SimpleGrid>

        <Box mt={8} mb={4} borderTopWidth="1px" borderColor="border.default" />

        <Text textAlign="center" fontSize="sm" color="text.muted">
          &copy; {currentYear} Pineapple Pi. Все права защищены.
        </Text>
      </Container>
    </Box>
  );
}
