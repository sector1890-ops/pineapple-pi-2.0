"use client";

import { useEffect, useState } from "react";
import { Box, Container, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { ArrowRight, Cpu } from "lucide-react";
import { MicroComputerSVG } from "./MicroComputerSVG";

/* ------------------------------------------------------------------ */
/*  Основной компонент HeroScene                                       */
/* ------------------------------------------------------------------ */

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [svgVisible, setSvgVisible] = useState(false);

  /* -- Mount animation -- */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const timer = setTimeout(() => setSvgVisible(true), 300);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      w="100%"
      h="100vh"
      overflow="hidden"
    >
      {/* SVG микрокомпьютер — серый контур с 3D-эффектом наклона */}
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        h={{ base: "35vh", sm: "40vh", md: "65vh" }}
        minH={0}
        px={4}
        overflow="hidden"
        flexShrink={0}
        position="relative"
      >
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Box
            w={{ base: "85vw", md: "600px" }}
            transform="perspective(1000px) rotateX(20deg) rotateY(-8deg)"
            opacity={svgVisible ? 1 : 0}
            scale={svgVisible ? 1 : 0.7}
            transitionProperty="opacity, transform"
            transitionDuration="1s, 0.8s"
            transitionTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
          >
            <MicroComputerSVG />
          </Box>
        </Box>
      </Box>

      {/* Glassmorphism overlay */}
      <Box
        px={4}
        pb={{ base: 6, md: 8 }}
        pt={{ base: 6, sm: 10, md: 0 }}
        minH={0}
      >
        <Container maxW="container.lg">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
            p={{ base: 4, md: 6 }}
            borderRadius="2xl"
            bg="rgba(255, 255, 255, 0.06)"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            border="1px solid rgba(255, 255, 255, 0.12)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            textAlign="center"
            pointerEvents="auto"
            opacity={mounted ? 1 : 0}
            transform={`translateY(${mounted ? 0 : 20}px)`}
            transition="opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s"
          >
            <Flex alignItems="center" gap={3} mb={1}>
              <Cpu
                size={32}
                color="var(--chakra-colors-accent-default)"
                style={{ flexShrink: 0 }}
              />
              <Heading
                size={{ base: "lg", md: "2xl" }}
                color="text.default"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                Микрокомпьютеры будущего
              </Heading>
            </Flex>

            <Text
              color="text.muted"
              fontSize={{ base: "md", md: "lg" }}
              maxW="container.md"
              lineHeight="tall"
            >
              Компактные одноплатные компьютеры для встраиваемых систем, IoT
              и&nbsp;прототипирования. Мощность размером с кредитную карту.
            </Text>

            <a href="#catalog">
              <Button
                size={{ base: "md", md: "lg" }}
                bg="teal.500"
                color="white"
                _hover={{ bg: "teal.600" }}
                _active={{ bg: "teal.700" }}
                borderRadius="xl"
                px={{ base: 6, md: 8 }}
                gap={2}
                fontWeight="semibold"
                data-testid="hero-cta"
                w="100%"
              >
                Перейти в каталог
                <ArrowRight size={18} />
              </Button>
            </a>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
