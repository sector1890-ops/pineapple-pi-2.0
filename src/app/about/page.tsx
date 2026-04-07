import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { aboutCompany } from "@/data/about-company";

/**
 * Страница "О компании" (Server Component)
 * Статический контент о компании Pineapple Pi
 */
export default function AboutPage() {
  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="container.lg">
        {/* Hero */}
        <VStack gap={4} align="stretch" mb={12}>
          <Heading
            size="2xl"
            textAlign={{ base: "center", md: "left" }}
          >
            {aboutCompany.title}
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="text.muted"
            textAlign={{ base: "center", md: "left" }}
          >
            {aboutCompany.subtitle}
          </Text>
        </VStack>

        {/* Introduction */}
        <Box mb={12}>
          <VStack gap={4} align="stretch">
            <Text fontSize="lg" lineHeight="tall">
              {aboutCompany.introduction.text}
            </Text>
            <Box
              px={4}
              py={3}
              bg="teal.50"
              borderLeftWidth={4}
              borderColor="teal.500"
              borderRadius="md"
            >
              <Text fontWeight="medium" color="teal.700">
                {aboutCompany.introduction.highlight}
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Mission */}
        <Box mb={12}>
          <Heading size="lg" mb={4}>
            {aboutCompany.mission.title}
          </Heading>
          <Text fontSize="lg" lineHeight="tall" color="text.muted">
            {aboutCompany.mission.text}
          </Text>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Values */}
        <Box mb={12}>
          <Heading size="lg" mb={6}>
            Наши ценности
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {aboutCompany.values.map((value) => (
              <Box
                key={value.title}
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                bg="bg.surface"
                _hover={{ shadow: "md", borderColor: "teal.300" }}
                transition="all 0.2s"
              >
                <Heading size="md" mb={2} color="teal.600">
                  {value.title}
                </Heading>
                <Text color="text.muted" lineHeight="tall">
                  {value.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* History */}
        <Box mb={12}>
          <Heading size="lg" mb={6}>
            {aboutCompany.history.title}
          </Heading>
          <VStack gap={4} align="stretch">
            {aboutCompany.history.content.map((item) => (
              <Box key={item.year} display="flex" gap={4} alignItems="flex-start">
                <Box
                  flexShrink={0}
                  w="80px"
                  py={1}
                  px={3}
                  bg="teal.500"
                  color="white"
                  borderRadius="md"
                  textAlign="center"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {item.year}
                </Box>
                <Text color="text.muted" pt={1}>
                  {item.event}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Statistics */}
        <Box mb={12}>
          <Heading size="lg" mb={6} textAlign="center">
            {aboutCompany.statistics.title}
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
            {aboutCompany.statistics.items.map((stat) => (
              <Box
                key={stat.label}
                textAlign="center"
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                bg="bg.surface"
              >
                <Heading size="xl" color="teal.600" mb={2}>
                  {stat.value}
                </Heading>
                <Text fontSize="sm" color="text.muted">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Team */}
        <Box mb={12}>
          <Heading size="lg" mb={4}>
            {aboutCompany.team.title}
          </Heading>
          <Text fontSize="lg" color="text.muted" mb={6}>
            {aboutCompany.team.description}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            {aboutCompany.team.roles.map((role) => (
              <Box
                key={role}
                px={4}
                py={3}
                bg="bg.surface"
                borderRadius="md"
                borderLeftWidth={3}
                borderColor="teal.400"
              >
                <Text fontWeight="medium">{role}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Manufacturing */}
        <Box mb={12}>
          <Heading size="lg" mb={4}>
            {aboutCompany.manufacturing.title}
          </Heading>
          <Text fontSize="lg" color="text.muted" lineHeight="tall">
            {aboutCompany.manufacturing.content}
          </Text>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Sustainability */}
        <Box mb={12}>
          <Heading size="lg" mb={4}>
            {aboutCompany.sustainability.title}
          </Heading>
          <Text fontSize="lg" color="text.muted" lineHeight="tall">
            {aboutCompany.sustainability.content}
          </Text>
        </Box>

        <Box borderBottomWidth="1px" borderColor="gray.200" my={12} />

        {/* Contact */}
        <Box mb={8}>
          <Heading size="lg" mb={6}>
            {aboutCompany.contact.title}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.surface">
              <Text fontWeight="medium" mb={1}>Общие вопросы</Text>
              <Text color="teal.600" fontWeight="medium">
                {aboutCompany.contact.email}
              </Text>
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.surface">
              <Text fontWeight="medium" mb={1}>Поддержка</Text>
              <Text color="teal.600" fontWeight="medium">
                {aboutCompany.contact.support}
              </Text>
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.surface">
              <Text fontWeight="medium" mb={1}>Пресса</Text>
              <Text color="teal.600" fontWeight="medium">
                {aboutCompany.contact.press}
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
