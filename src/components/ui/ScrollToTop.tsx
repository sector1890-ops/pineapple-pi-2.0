"use client";

import { useState, useEffect } from "react";
import { IconButton } from "@chakra-ui/react";
import { ChevronUp } from "lucide-react";

const SCROLL_THRESHOLD = 100;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) {
    return null;
  }

  return (
    <IconButton
      aria-label="Прокрутить наверх"
      position="fixed"
      bottom={{ base: 4, md: 8 }}
      right={{ base: 4, md: 8 }}
      zIndex="overlay"
      w={12}
      h={12}
      borderRadius="full"
      bg="accent.default"
      color="white"
      _hover={{ bg: "accent.hover" }}
      _active={{ bg: "accent.active" }}
      shadow="md"
      onClick={handleClick}
    >
      <ChevronUp size={24} />
    </IconButton>
  );
}
