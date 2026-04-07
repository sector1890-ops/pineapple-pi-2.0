"use client";

import { useState, useEffect } from "react";
import { Toaster, Toast } from "@chakra-ui/react";
import { toaster } from "@/lib/toaster";

export function ToastRenderer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toaster toaster={toaster}>
      {(toast) => {
        const typeColors: Record<string, { bg: string; color: string }> = {
          success: { bg: "teal.500", color: "white" },
          error: { bg: "red.500", color: "white" },
          info: { bg: "blue.500", color: "white" },
        };

        const colors = typeColors[toast.type ?? ""] ?? { bg: "gray.600", color: "white" };

        return (
          <Toast.Root
            minW={{ base: "200px", md: "260px" }}
            maxW={{ base: "90vw", md: "380px" }}
            bg={colors.bg}
            color={colors.color}
          >
            <Toast.Title whiteSpace="normal" wordBreak="break-word">
              {toast.title}
            </Toast.Title>
            <Toast.CloseTrigger />
          </Toast.Root>
        );
      }}
    </Toaster>
  );
}
