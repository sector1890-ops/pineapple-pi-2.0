import Link from "next/link";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
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
      bg="bg.emphasized"
      borderTopWidth="1px"
      borderColor="border.default"
    >
      <Container maxW="container.xl" py={10}>
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
        >
          {/* Навигация */}
          <VStack alignItems="flex-start" gap={3}>
            <Flex alignItems="center" gap={2}>
              <Monitor size={20} color="var(--chakra-colors-accent-default)" />
              <Text fontSize="sm" fontWeight={600} color="accent.default">
                Pineapple Pi
              </Text>
            </Flex>
            <VStack alignItems="flex-start" gap={2}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "var(--chakra-colors-text-muted)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--chakra-colors-accent-default)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--chakra-colors-text-muted)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Контакты */}
          <VStack alignItems="flex-start" gap={3}>
            <Heading size="sm" color="text.default">
              Контакты
            </Heading>
            <VStack alignItems="flex-start"  gap={3} >
              {contacts.map((contact) => (
                <Flex key={contact.label} alignItems="flex-start" gap={2}>
                  <Box w={4} flexShrink={0} pt={0.5}>
                    <contact.icon size={16} color="var(--chakra-colors-accent-default)" />
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="text.muted">
                      {contact.label}
                    </Text>
                    <Text fontSize="sm" color="text.default">
                      {contact.value}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </VStack>

          {/* О проекте */}
          <VStack alignItems="flex-start" gap={3}>
            <Heading size="sm" color="text.default">
              О проекте
            </Heading>
            <Text fontSize="sm" color="text.muted" lineHeight={1.6}>
              Pineapple Pi — каталог микрокомпьютеров для встраиваемых систем,
              IoT и прототипирования. Компактные решения для разработчиков и
              инженеров.
            </Text>
          </VStack>
        </Box>

        <Box
          mt={8}
          mb={4}
          borderTopWidth="1px"
          borderColor="border.default"
        />

        <Text textAlign="center" fontSize="sm" color="text.muted">
          &copy; {currentYear} Pineapple Pi. Все права защищены.
        </Text>
      </Container>
    </Box>
  );
}
