"use client";

import { useState, useEffect, useCallback } from "react";
import { IconButton } from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";

const COLOR_MODE_KEY = "chakra-ui-color-mode";

type ColorMode = "light" | "dark";

/**
 * Переключатель светлой/тёмной темы
 * Client Component с сохранением выбора в localStorage
 */
export function ThemeToggle() {
  const [colorMode, setColorMode] = useState<ColorMode>("light");
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = localStorage.getItem(COLOR_MODE_KEY) as ColorMode | null;
    if (saved === "light" || saved === "dark") {
      setColorMode(saved);
      applyColorMode(saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setColorMode("dark");
      applyColorMode("dark");
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleColorMode = useCallback(() => {
    const next = colorMode === "light" ? "dark" : "light";
    setColorMode(next);
    localStorage.setItem(COLOR_MODE_KEY, next);
    applyColorMode(next);
  }, [colorMode]);

  if (!hydrated) {
    return null;
  }

  return (
    <IconButton
      aria-label={
        colorMode === "light"
          ? "Переключить на тёмную тему"
          : "Переключить на светлую тему"
      }
      variant="ghost"
      size="sm"
      minW="auto"
      w={9}
      h={9}
      p={0}
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </IconButton>
  );
}

function applyColorMode(mode: ColorMode) {
  const html = document.documentElement;
  html.classList.toggle("dark", mode === "dark");
  html.classList.toggle("light", mode === "light");
}
